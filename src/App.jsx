import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import StartScreen from './components/StartScreen';
import InviteFriendsScreen from './components/InviteFriendsScreen';
import GameHeader from './components/GameHeader';
import ScoreBoard from './components/ScoreBoard';
import BoardGrid from './components/BoardGrid';
import CpuThinkingBadge from './components/CpuThinkingBadge';
import WinnerOverlay from './components/WinnerOverlay';
import Rules from './components/Rules';
import SettingsPanel from './components/Settings';
import './App.css';
import { BLUE, RED, createInitialBoard, getValidMoves, getWinner, validateMoveForPlayer } from './lib/checkersCore';

const App = () => {
  const [gameState, setGameState] = useState('START');
  const [gameMode, setGameMode] = useState('PvP');
  const [board, setBoard] = useState(createInitialBoard());
  const [turn, setTurn] = useState(BLUE);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [validMoves, setValidMoves] = useState([]);
  const [winner, setWinner] = useState(null);
  const [isAiThinking, setIsAiThinking] = useState(false);

  const score = useMemo(() => {
    if (!Array.isArray(board) || board.length === 0) {
      return { [RED]: 0, [BLUE]: 0 };
    }

    let counts = { [RED]: 0, [BLUE]: 0 };
    board.forEach((row) => {
      row.forEach((cell) => {
        if (cell) counts[cell.player] += 1;
      });
    });

    return { [RED]: 12 - counts[BLUE], [BLUE]: 12 - counts[RED] };
  }, [board]);
  const [showRules, setShowRules] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [inviteView, setInviteView] = useState('menu');
  const [roomCode, setRoomCode] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [onlineError, setOnlineError] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [, setRoomPlayers] = useState([]);
  const [localPlayerColor, setLocalPlayerColor] = useState(BLUE);
  const [playerName, setPlayerName] = useState('You');
  const [opponentName, setOpponentName] = useState('Opponent');
  const [isLoading, setIsLoading] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [onlineCountdown, setOnlineCountdown] = useState(null);
  const [isWaitingForServer, setIsWaitingForServer] = useState(false);

  const socketRef = useRef(null);
  const pendingSocketAction = useRef(null);
  const playerNameRef = useRef(playerName);
  const localPlayerColorRef = useRef(localPlayerColor);

  const [playerColor, setPlayerColor] = useState('#3b82f6');
  const [cpuColor, setCpuColor] = useState('#ef4444');
  const [boardTheme, setBoardTheme] = useState('classic');
  const colorPalette = ['#000000', '#ffffff', '#3b82f6', '#ef4444', '#10b981', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316', '#84cc16'];
  const boardThemes = ['classic', 'wood', 'midnight', 'ocean', 'forest', 'sunset'];

  const sendWebSocketAction = useCallback((payload) => {
    const socket = socketRef.current;

    if (!socket) {
      pendingSocketAction.current = payload;
      setOnlineError('Connecting to multiplayer server...');
      return false;
    }

    if (socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(payload));
      return true;
    }

    pendingSocketAction.current = payload;
    setOnlineError('Connecting to multiplayer server...');
    return false;
  }, []);

  const resetToMenu = useCallback(() => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN && roomCode) {
      socketRef.current.send(JSON.stringify({ type: 'leave-room' }));
    }

    setGameState('START');
    setGameMode('PvP');
    setInviteView('menu');
    setRoomCode('');
    setJoinCode('');
    setOnlineError('');
    setStatusMessage('');
    setRoomPlayers([]);
    setLocalPlayerColor(BLUE);
    setWinner(null);
    setSelectedPiece(null);
    setValidMoves([]);
    setOnlineCountdown(null);
    setIsWaitingForServer(false);
    setBoard(createInitialBoard());
    setTurn(BLUE);
  }, [roomCode]);

  const handleServerMessage = useCallback((message) => {
    if (!message || !message.type) return;

    if (message.type === 'room-created') {
      setRoomCode(message.roomCode);
      setLocalPlayerColor(message.playerColor);
      setInviteView('create');
      setStatusMessage('Waiting for your friend to join...');
      setOnlineError('');
      setIsLoading(false);
      setRoomPlayers([{ color: message.playerColor, playerNumber: message.playerNumber, name: playerNameRef.current }]);
      return;
    }

    if (message.type === 'room-joined') {
      setRoomCode(message.roomCode);
      setLocalPlayerColor(message.playerColor);
      setInviteView('join');
      setStatusMessage('Joining room...');
      setOnlineError('');
      setIsLoading(false);
      // try to pick up opponent name if server provided
      if (message.players && Array.isArray(message.players)) {
        const other = message.players.find((p) => p.playerNumber !== message.playerNumber && p.name);
        if (other && other.name) setOpponentName(other.name);
      }
      return;
    }

    if (message.type === 'room-state') {
      setRoomPlayers(message.players || []);
      setStatusMessage(message.statusMessage || 'Waiting for your friend to join...');
      setIsLoading(false);
      // update opponentName if available
      if (message.players && Array.isArray(message.players)) {
        const other = message.players.find((p) => p.color !== localPlayerColorRef.current && p.name);
        if (other && other.name) setOpponentName(other.name);
      }
      return;
    }

    if (message.type === 'game-started') {
      setGameMode('Online');
      setGameState('PLAYING');
      setBoard(message.board);
      setTurn(message.currentTurn || BLUE);
      setWinner(null);
      setSelectedPiece(null);
      setValidMoves([]);
      setStatusMessage('Both players connected');
      setRoomPlayers(message.players || []);
      setOnlineCountdown(3);
      // set opponent name if provided by server
      if (message.players && Array.isArray(message.players)) {
        const other = message.players.find((p) => p.color !== localPlayerColorRef.current && p.name);
        if (other && other.name) setOpponentName(other.name);
      }
      return;
    }

    if (message.type === 'game-state') {
      setBoard(message.state.board);
      setTurn(message.state.currentTurn);
      setWinner(message.state.winner || null);
      setRoomPlayers(message.state.players || []);
      setStatusMessage(message.message || '');
      setIsWaitingForServer(false);
      if (message.state.winner) {
        setGameState('OVER');
      } else {
        setGameState('PLAYING');
      }
      return;
    }

    if (message.type === 'error') {
      setIsLoading(false);
      setIsWaitingForServer(false);
      setOnlineError(message.message || 'Something went wrong. Please try again.');
      return;
    }

    if (message.type === 'opponent-left') {
      setWinner('DISCONNECTED');
      setGameState('OVER');
      setOnlineError(message.message || 'Your opponent has left the game.');
      setStatusMessage(message.message || 'Your opponent has left the game.');
      return;
    }
  }, []);

  // socket effect is intentionally stable; do not include UI state deps
  useEffect(() => {
    const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:8080';
    const socket = new WebSocket(wsUrl);
    socketRef.current = socket;

    socket.onopen = () => {
      setOnlineError('');
      if (pendingSocketAction.current) {
        socket.send(JSON.stringify(pendingSocketAction.current));
        pendingSocketAction.current = null;
      }
    };

    socket.onmessage = (event) => {
      try {
        const parsedMessage = JSON.parse(event.data);
        handleServerMessage(parsedMessage);
      } catch {
        console.error('Could not parse WebSocket message');
      }
    };

    socket.onclose = () => {
      setOnlineError('Connection lost. Please refresh or try again.');
    };

    return () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, [handleServerMessage]);

  // keep refs up-to-date for callbacks
  useEffect(() => { playerNameRef.current = playerName; }, [playerName]);
  useEffect(() => { localPlayerColorRef.current = localPlayerColor; }, [localPlayerColor]);

  useEffect(() => {
    if (gameMode !== 'Online' && gameState === 'PLAYING') {
      const result = getWinner(board);
      if (result.winner) {
        setTimeout(() => {
          setWinner(result.winner);
          setGameState('OVER');
        }, 0);
      }
    }
  }, [board, gameMode, gameState]);

  useEffect(() => {
    if (gameMode !== 'PvC' || turn !== RED || winner || gameState !== 'PLAYING') return;

    setTimeout(() => setIsAiThinking(true), 0);
    const timer = setTimeout(() => {
      const possibleMoves = [];

      board.forEach((row, rIndex) => {
        row.forEach((cell, cIndex) => {
          if (cell?.player === RED) {
            const moves = getValidMoves(board, rIndex, cIndex, cell);
            moves.forEach((move) => possibleMoves.push({ from: { r: rIndex, c: cIndex }, to: move }));
          }
        });
      });

      if (possibleMoves.length === 0) {
        setWinner(BLUE);
        setGameState('OVER');
        setIsAiThinking(false);
        return;
      }

      const jumps = possibleMoves.filter((move) => move.to.jump);
      const chosenMove = jumps.length > 0
        ? jumps[Math.floor(Math.random() * jumps.length)]
        : possibleMoves[Math.floor(Math.random() * possibleMoves.length)];

      const moveResult = validateMoveForPlayer(board, RED, RED, chosenMove.from, chosenMove.to);
      if (moveResult.valid) {
        setBoard(moveResult.board);
        setTurn(moveResult.nextTurn || BLUE);
      }
      setIsAiThinking(false);
    }, 700);

    return () => clearTimeout(timer);
  }, [turn, gameMode, board, winner, gameState]);

  useEffect(() => {
    if (onlineCountdown === null) return;
    const timer = setTimeout(() => {
      setOnlineCountdown((current) => {
        if (current === null || current <= 1) {
          setStatusMessage('PLAY!');
          return null;
        }
        return current - 1;
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, [onlineCountdown]);

  const initBoard = useCallback((mode) => {
    const newBoard = createInitialBoard();
    setBoard(newBoard);
    setTurn(BLUE);
    setSelectedPiece(null);
    setValidMoves([]);
    setWinner(null);
    setIsAiThinking(false);
    setGameMode(mode || gameMode);
    setGameState('PLAYING');
    setOnlineCountdown(null);
  }, [gameMode]);

  const executeLocalMove = useCallback((from, to) => {
    const result = validateMoveForPlayer(board, turn, turn, from, to);

    if (!result.valid) {
      return false;
    }

    setBoard(result.board);
    setTurn(result.nextTurn || (turn === BLUE ? RED : BLUE));
    setSelectedPiece(null);
    setValidMoves([]);

    if (result.winner) {
      setWinner(result.winner);
      setGameState('OVER');
    }

    return true;
  }, [board, turn]);

  const handleSquareClick = (row, col) => {
    if (winner || isAiThinking || isWaitingForServer) return;

    if (gameMode === 'Online') {
      if (turn !== localPlayerColor) return;
      const piece = board[row][col];
      if (piece && piece.player === localPlayerColor) {
        setSelectedPiece({ r: row, c: col });
        setValidMoves(getValidMoves(board, row, col, piece));
        return;
      }

      const move = validMoves.find((entry) => entry.r === row && entry.c === col);
      if (selectedPiece && move) {
        setIsWaitingForServer(true);
        if (!sendWebSocketAction({ type: 'move', from: selectedPiece, to: { r: row, c: col } })) {
          setSelectedPiece(null);
          setValidMoves([]);
          setIsWaitingForServer(false);
        }
      } else {
        setSelectedPiece(null);
        setValidMoves([]);
      }
      return;
    }

    if (gameMode === 'PvC' && turn === RED) return;

    const piece = board[row][col];
    if (piece && piece.player === turn) {
      setSelectedPiece({ r: row, c: col });
      setValidMoves(getValidMoves(board, row, col, piece));
      return;
    }

    const move = validMoves.find((entry) => entry.r === row && entry.c === col);
    if (selectedPiece && move) {
      executeLocalMove(selectedPiece, { r: row, c: col }, move);
    } else {
      setSelectedPiece(null);
      setValidMoves([]);
    }
  };

  const onCreateRoom = () => {
    setOnlineError('');
    setIsLoading(true);
    if (!sendWebSocketAction({ type: 'create-room', name: playerName })) {
      setIsLoading(false);
      return;
    }
    setInviteView('create');
  };

  const onJoinRoom = () => {
    const trimmedCode = joinCode.trim();
    if (!trimmedCode || trimmedCode.length !== 6) {
      setOnlineError('Invalid room code.');
      return;
    }

    setOnlineError('');
    setIsLoading(true);
    if (!sendWebSocketAction({ type: 'join-room', roomCode: trimmedCode, name: playerName })) {
      setIsLoading(false);
      return;
    }
  };

  const copyRoomCode = async () => {
    if (!roomCode) return;

    try {
      await navigator.clipboard.writeText(roomCode);
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 1500);
    } catch {
      setOnlineError('Unable to copy room code.');
    }
  };

  if (gameState === 'START') {
    return (
      <>
        {inviteView === 'menu' ? (
          <StartScreen
            onStartPvC={() => initBoard('PvC')}
            onStartPvP={() => initBoard('PvP')}
            onStartInviteFriends={() => setInviteView('selection')}
            onShowRules={() => setShowRules(true)}
            onShowSettings={() => setShowSettings(true)}
          />
        ) : (
          <InviteFriendsScreen
            view={inviteView}
            onBack={() => {
              setInviteView('menu');
              setOnlineError('');
              setStatusMessage('');
              setJoinCode('');
            }}
            onSelectCreate={() => {
              setInviteView('create');
              onCreateRoom();
            }}
            onSelectJoin={() => setInviteView('join')}
            onCreateRoom={onCreateRoom}
            onJoinRoom={onJoinRoom}
            roomCode={roomCode}
            joinCode={joinCode}
            setJoinCode={setJoinCode}
            isLoading={isLoading}
            error={onlineError}
            statusMessage={statusMessage}
            copyRoomCode={copyRoomCode}
            copied={copyFeedback}
            playerName={playerName}
            setPlayerName={setPlayerName}
          />
        )}

        {showRules && <Rules onClose={() => setShowRules(false)} />}
        {showSettings && <SettingsPanel onClose={() => setShowSettings(false)} playerColor={playerColor} cpuColor={cpuColor} boardTheme={boardTheme} setPlayerColor={setPlayerColor} setCpuColor={setCpuColor} setBoardTheme={setBoardTheme} colorPalette={colorPalette} boardThemes={boardThemes} />}
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] bg-[radial-gradient(circle_at_20%_20%,rgba(37,99,235,0.22),transparent_35%),radial-gradient(circle_at_80%_80%,rgba(168,85,247,0.18),transparent_35%),radial-gradient(circle_at_50%_100%,rgba(245,158,11,0.08),transparent_30%)] text-white flex flex-col items-center p-4">
      <GameHeader
        gameMode={gameMode}
        onBackToMenu={resetToMenu}
        onResetBoard={() => {
          if (gameMode === 'Online') {
            setOnlineError('Reset is not available while playing online.');
            return;
          }
          initBoard();
        }}
        onShowSettings={() => setShowSettings(true)}
      />

      {onlineError && (
        <div className="w-full max-w-lg mb-3 rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-center text-sm text-red-200">
          {onlineError}
        </div>
      )}

      {statusMessage && gameMode === 'Online' && (
        <div className="w-full max-w-lg mb-3 rounded-2xl border border-blue-500/30 bg-neutral-800 px-4 py-3 text-center text-sm text-blue-200">
          {onlineCountdown !== null ? `Both players connected\n${onlineCountdown}` : statusMessage}
        </div>
      )}

      <ScoreBoard
        turn={turn}
        score={score}
        gameMode={gameMode}
        RED={RED}
        BLUE={BLUE}
        playerColor={playerColor}
        cpuColor={cpuColor}
        localPlayerColor={localPlayerColor}
        playerName={playerName}
        opponentName={opponentName}
      />

      <div className="relative">
        <BoardGrid
          board={board}
          selectedPiece={selectedPiece}
          validMoves={validMoves}
          onSquareClick={handleSquareClick}
          RED={RED}
          BLUE={BLUE}
          playerColor={playerColor}
          cpuColor={cpuColor}
          boardTheme={boardTheme}
        />

        {showSettings && (
          <SettingsPanel
            onClose={() => setShowSettings(false)}
            playerColor={playerColor}
            cpuColor={cpuColor}
            boardTheme={boardTheme}
            setPlayerColor={setPlayerColor}
            setCpuColor={setCpuColor}
            setBoardTheme={setBoardTheme}
            colorPalette={colorPalette}
            boardThemes={boardThemes}
          />
        )}

        {isAiThinking && !winner && <CpuThinkingBadge />}
        <WinnerOverlay
          winner={winner}
          localPlayerColor={localPlayerColor}
          onBackToMenu={resetToMenu}
          playerName={playerName}
          opponentName={opponentName}
        />
      </div>
    </div>
  );
};

export default App;