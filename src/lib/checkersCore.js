export const BOARD_SIZE = 8;
export const RED = 'RED';
export const BLUE = 'BLUE';

export const normalizeCell = (cell) => {
  if (!cell) return null;

  if (typeof cell === 'string') {
    const match = cell.trim().match(/^([A-Ha-h])([1-8])$/);
    if (!match) return null;

    const col = match[1].toUpperCase().charCodeAt(0) - 65;
    const row = Number(match[2]) - 1;
    return { r: 8 - row - 1, c: col };
  }

  if (typeof cell === 'object' && 'r' in cell && 'c' in cell) {
    return { r: Number(cell.r), c: Number(cell.c) };
  }

  return null;
};

export const createInitialBoard = () => {
  const nextBoard = Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(null));

  for (let row = 0; row < BOARD_SIZE; row += 1) {
    for (let col = 0; col < BOARD_SIZE; col += 1) {
      if ((row + col) % 2 !== 0) {
        if (row < 3) {
          nextBoard[row][col] = { player: RED, isKing: false };
        } else if (row > 4) {
          nextBoard[row][col] = { player: BLUE, isKing: false };
        }
      }
    }
  }

  return nextBoard;
};

export const getDirections = (piece) => {
  if (!piece) return [];

  if (piece.isKing) {
    return [[1, 1], [1, -1], [-1, 1], [-1, -1]];
  }

  if (piece.player === BLUE) {
    return [[-1, -1], [-1, 1]];
  }

  return [[1, -1], [1, 1]];
};

export const getValidMoves = (board, row, col, piece) => {
  if (!board || !piece) return [];

  const captures = [];
  const directions = getDirections(piece);

  directions.forEach(([dr, dc]) => {
    const targetRow = row + dr;
    const targetCol = col + dc;

    if (targetRow < 0 || targetRow >= BOARD_SIZE || targetCol < 0 || targetCol >= BOARD_SIZE) {
      return;
    }

    const targetCell = board[targetRow][targetCol];
    if (targetCell && targetCell.player !== piece.player) {
      const jumpRow = targetRow + dr;
      const jumpCol = targetCol + dc;

      if (
        jumpRow >= 0 &&
        jumpRow < BOARD_SIZE &&
        jumpCol >= 0 &&
        jumpCol < BOARD_SIZE &&
        !board[jumpRow][jumpCol]
      ) {
        captures.push({ r: jumpRow, c: jumpCol, jump: { r: targetRow, c: targetCol } });
      }
    }
  });

  if (captures.length > 0) {
    return captures;
  }

  const regularMoves = [];
  directions.forEach(([dr, dc]) => {
    const targetRow = row + dr;
    const targetCol = col + dc;

    if (targetRow >= 0 && targetRow < BOARD_SIZE && targetCol >= 0 && targetCol < BOARD_SIZE) {
      if (!board[targetRow][targetCol]) {
        regularMoves.push({ r: targetRow, c: targetCol, jump: null });
      }
    }
  });

  return regularMoves;
};

export const applyMove = (board, from, to, moveDetail) => {
  const normalizedFrom = normalizeCell(from);
  const normalizedTo = normalizeCell(to);

  if (!normalizedFrom || !normalizedTo) {
    return { board, winner: null, nextTurn: null, promoted: false, move: null };
  }

  const nextBoard = board.map((row) => row.map((cell) => (cell ? { ...cell } : null)));
  const movingPiece = nextBoard[normalizedFrom.r][normalizedFrom.c];

  if (!movingPiece) {
    return { board: nextBoard, winner: null, nextTurn: null, promoted: false, move: null };
  }

  nextBoard[normalizedTo.r][normalizedTo.c] = { ...movingPiece };
  nextBoard[normalizedFrom.r][normalizedFrom.c] = null;

  if (moveDetail?.jump) {
    nextBoard[moveDetail.jump.r][moveDetail.jump.c] = null;
  }

  if (
    (movingPiece.player === RED && normalizedTo.r === BOARD_SIZE - 1) ||
    (movingPiece.player === BLUE && normalizedTo.r === 0)
  ) {
    nextBoard[normalizedTo.r][normalizedTo.c].isKing = true;
  }

  const winnerResult = getWinner(nextBoard);

  const nextTurn = winnerResult.winner
    ? null
    : (moveDetail?.jump && hasFollowUpJump(nextBoard, normalizedTo.r, normalizedTo.c, nextBoard[normalizedTo.r][normalizedTo.c]))
      ? movingPiece.player
      : movingPiece.player === BLUE ? RED : BLUE;

  return {
    board: nextBoard,
    winner: winnerResult.winner,
    nextTurn,
    promoted: nextBoard[normalizedTo.r][normalizedTo.c].isKing && !movingPiece.isKing,
    move: { from: normalizedFrom, to: normalizedTo, jump: moveDetail?.jump ?? null },
  };
};

export const hasFollowUpJump = (board, row, col, piece) => {
  if (!piece) return false;
  const followUpMoves = getValidMoves(board, row, col, piece);
  return followUpMoves.some((move) => move.jump);
};

export const getWinner = (board) => {
  const counts = { [RED]: 0, [BLUE]: 0 };

  board.forEach((row) => {
    row.forEach((cell) => {
      if (cell) {
        counts[cell.player] += 1;
      }
    });
  });

  if (counts[RED] === 0) {
    return { winner: BLUE, reason: 'Red has no pieces left.' };
  }

  if (counts[BLUE] === 0) {
    return { winner: RED, reason: 'Blue has no pieces left.' };
  }

  let redHasMove = false;
  let blueHasMove = false;

  board.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      if (!cell) return;
      if (cell.player === RED && getValidMoves(board, rowIndex, colIndex, cell).length > 0) {
        redHasMove = true;
      }
      if (cell.player === BLUE && getValidMoves(board, rowIndex, colIndex, cell).length > 0) {
        blueHasMove = true;
      }
    });
  });

  if (!redHasMove && blueHasMove) {
    return { winner: BLUE, reason: 'Red cannot move.' };
  }

  if (!blueHasMove && redHasMove) {
    return { winner: RED, reason: 'Blue cannot move.' };
  }

  if (!redHasMove && !blueHasMove) {
    return { winner: 'DRAW', reason: 'No legal moves remaining.' };
  }

  return { winner: null, reason: null };
};

export const validateMoveForPlayer = (board, playerColor, actingPlayer, from, to) => {
  const fromCell = normalizeCell(from);
  const toCell = normalizeCell(to);

  if (!fromCell || !toCell) {
    return { valid: false, reason: 'Invalid coordinates.' };
  }

  const sourcePiece = board[fromCell.r]?.[fromCell.c];
  if (!sourcePiece) {
    return { valid: false, reason: 'No piece selected.' };
  }

  if (sourcePiece.player !== actingPlayer) {
    return { valid: false, reason: 'That piece does not belong to this player.' };
  }

  if (playerColor !== actingPlayer) {
    return { valid: false, reason: 'Not your turn.' };
  }

  const validMoves = getValidMoves(board, fromCell.r, fromCell.c, sourcePiece);
  const match = validMoves.find((move) => move.r === toCell.r && move.c === toCell.c);

  if (!match) {
    return { valid: false, reason: 'Invalid move for this piece.' };
  }

  const moveResult = applyMove(board, fromCell, toCell, match);

  if (!moveResult.move) {
    return { valid: false, reason: 'Move could not be completed.' };
  }

  return {
    valid: true,
    ...moveResult,
  };
};
