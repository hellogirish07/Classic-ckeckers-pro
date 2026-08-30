import { WebSocketServer } from 'ws';
import { BLUE, RED, createInitialBoard, validateMoveForPlayer, getWinner } from '../src/lib/checkersCore.js';

const PORT = Number(process.env.WS_PORT || 8080);
const rooms = new Map();

const createRoomCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';

  do {
    code = Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  } while (rooms.has(code));

  return code;
};

const getTurnLabel = (color) => (color === BLUE ? 'Blue' : 'Red');

const getRoomSnapshot = (room) => ({
  code: room.code,
  players: room.players.map((player) => ({
    color: player.color,
    playerNumber: player.playerNumber,
    connected: player.socket.readyState === 1,
  })),
  currentTurn: room.gameState.currentTurn,
  winner: room.gameState.winner,
  board: room.gameState.board,
});

const broadcastRoom = (room, payload) => {
  room.players.forEach((player) => {
    if (player.socket.readyState === 1) {
      player.socket.send(JSON.stringify(payload));
    }
  });
};

const sendError = (socket, message) => {
  socket.send(JSON.stringify({ type: 'error', message }));
};

const createRoom = () => {
  const code = createRoomCode();
  const room = {
    code,
    players: [],
    gameState: {
      board: createInitialBoard(),
      currentTurn: BLUE,
      winner: null,
    },
    createdAt: Date.now(),
    lastActivity: Date.now(),
  };

  rooms.set(code, room);
  return room;
};

const cleanupRoom = (roomCode) => {
  const room = rooms.get(roomCode);
  if (!room) return;

  if (room.players.length === 0) {
    rooms.delete(roomCode);
  }
};

const leaveRoom = (socket) => {
  const roomCode = socket.roomCode;
  if (!roomCode) return;

  const room = rooms.get(roomCode);
  if (!room) {
    socket.roomCode = null;
    socket.playerColor = null;
    return;
  }

  room.players = room.players.filter((player) => player.socket !== socket);
  room.lastActivity = Date.now();
  socket.roomCode = null;
  socket.playerColor = null;

  if (room.players.length === 0) {
    rooms.delete(roomCode);
    return;
  }

  broadcastRoom(room, {
    type: 'opponent-left',
    message: 'Your opponent has left the game.',
    roomCode,
  });
};

const handleDisconnect = (socket) => {
  const roomCode = socket.roomCode;
  if (!roomCode) return;

  const room = rooms.get(roomCode);
  if (!room) return;

  room.players = room.players.filter((player) => player.socket !== socket);
  room.lastActivity = Date.now();

  if (room.players.length === 0) {
    rooms.delete(roomCode);
    return;
  }

  broadcastRoom(room, {
    type: 'opponent-left',
    message: 'Your opponent has left the game.',
    roomCode,
    remainingPlayers: room.players.length,
  });

  room.gameState.winner = room.players[0]?.color === BLUE ? RED : BLUE;
  room.gameState.currentTurn = room.players[0]?.color || BLUE;
};

const assignPlayer = (room, socket) => {
  const playerNumber = room.players.length + 1;
  const color = playerNumber === 1 ? BLUE : RED;
  const player = {
    id: `${room.code}-${playerNumber}-${Date.now()}`,
    socket,
    color,
    playerNumber,
  };

  socket.roomCode = room.code;
  socket.playerColor = color;
  room.players.push(player);
  return player;
};

const startGame = (room) => {
  room.gameState = {
    board: createInitialBoard(),
    currentTurn: BLUE,
    winner: null,
  };

  const players = room.players.map((player) => ({
    playerNumber: player.playerNumber,
    color: player.color,
  }));

  broadcastRoom(room, {
    type: 'game-started',
    roomCode: room.code,
    players,
    currentTurn: BLUE,
    board: room.gameState.board,
    message: 'Both players connected',
  });
};

const wss = new WebSocketServer({ port: PORT });

wss.on('connection', (socket) => {
  socket.on('message', (rawMessage) => {
    try {
      const payload = JSON.parse(String(rawMessage));

      if (payload.type === 'create-room') {
        if (socket.roomCode) {
          sendError(socket, 'You are already in a room.');
          return;
        }

        const room = createRoom();
        const player = assignPlayer(room, socket);
        socket.playerNumber = player.playerNumber;

        socket.send(JSON.stringify({
          type: 'room-created',
          roomCode: room.code,
          playerColor: player.color,
          playerNumber: player.playerNumber,
          message: 'Room created successfully.',
        }));

        broadcastRoom(room, {
          type: 'room-state',
          roomCode: room.code,
          players: room.players.map((entry) => ({ playerNumber: entry.playerNumber, color: entry.color })),
          statusMessage: 'Waiting for your friend to join...',
        });
        return;
      }

      if (payload.type === 'join-room') {
        if (socket.roomCode) {
          sendError(socket, 'You are already in a room.');
          return;
        }

        const roomCode = String(payload.roomCode || '').trim().toUpperCase();
        if (!roomCode || roomCode.length !== 6) {
          sendError(socket, 'Invalid room code.');
          return;
        }

        const room = rooms.get(roomCode);
        if (!room) {
          sendError(socket, 'Room not found.');
          return;
        }

        if (room.players.length >= 2) {
          sendError(socket, 'Room is full.');
          return;
        }

        const player = assignPlayer(room, socket);
        socket.playerNumber = player.playerNumber;

        socket.send(JSON.stringify({
          type: 'room-joined',
          roomCode: room.code,
          playerColor: player.color,
          playerNumber: player.playerNumber,
          message: 'Joined room successfully.',
        }));

        broadcastRoom(room, {
          type: 'room-state',
          roomCode: room.code,
          players: room.players.map((entry) => ({ playerNumber: entry.playerNumber, color: entry.color })),
          statusMessage: room.players.length === 2 ? 'Both players connected' : 'Waiting for your friend to join...',
        });

        if (room.players.length === 2) {
          startGame(room);
        }
        return;
      }

      if (payload.type === 'leave-room') {
        leaveRoom(socket);
        socket.send(JSON.stringify({ type: 'left-room', message: 'You left the room.' }));
        return;
      }

      if (payload.type === 'move') {
        const room = rooms.get(socket.roomCode);
        if (!room) {
          sendError(socket, 'Room not found.');
          return;
        }

        const actingPlayer = room.players.find((player) => player.socket === socket);
        if (!actingPlayer) {
          sendError(socket, 'Player not found in room.');
          return;
        }

        if (room.gameState.winner) {
          sendError(socket, 'The game has already ended.');
          return;
        }

        if (room.gameState.currentTurn !== actingPlayer.color) {
          sendError(socket, `${getTurnLabel(room.gameState.currentTurn)}'s turn.`);
          return;
        }

        const moveResult = validateMoveForPlayer(
          room.gameState.board,
          actingPlayer.color,
          actingPlayer.color,
          payload.from,
          payload.to,
        );

        if (!moveResult.valid) {
          sendError(socket, moveResult.reason || 'Invalid move.');
          return;
        }

        room.gameState.board = moveResult.board;
        room.gameState.currentTurn = moveResult.nextTurn;
        room.gameState.winner = moveResult.winner || null;
        room.lastActivity = Date.now();

        const winnerPayload = getWinner(room.gameState.board);
        room.gameState.winner = winnerPayload.winner || room.gameState.winner;

        const snapshot = getRoomSnapshot(room);
        broadcastRoom(room, {
          type: 'game-state',
          roomCode: room.code,
          state: snapshot,
          message: room.gameState.winner ? 'Game over' : `${getTurnLabel(room.gameState.currentTurn)}'s turn`,
          winner: room.gameState.winner,
        });

        if (room.gameState.winner) {
          setTimeout(() => {
            cleanupRoom(room.code);
          }, 1000 * 60 * 2);
        }
      }
    } catch (error) {
      console.error('WebSocket message error:', error);
      sendError(socket, 'Something went wrong. Please try again.');
    }
  });

  socket.on('close', () => handleDisconnect(socket));
  socket.on('error', () => {
    handleDisconnect(socket);
  });
});

console.log(`Classic Checkers WebSocket server running on ws://localhost:${PORT}`);
