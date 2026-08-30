import test from 'node:test';
import assert from 'node:assert/strict';

import {
  BLUE,
  RED,
  createInitialBoard,
  getValidMoves,
  validateMoveForPlayer,
  getWinner,
  applyMove,
  normalizeCell,
} from '../src/lib/checkersCore.js';

test('initial board creates 12 pieces for each side', () => {
  const board = createInitialBoard();
  const blueCount = board.flat().filter((cell) => cell && cell.player === BLUE).length;
  const redCount = board.flat().filter((cell) => cell && cell.player === RED).length;

  assert.equal(blueCount, 12);
  assert.equal(redCount, 12);
});

test('normalizeCell accepts common coordinate formats', () => {
  assert.deepEqual(normalizeCell('A3'), { r: 5, c: 0 });
  assert.deepEqual(normalizeCell({ r: 2, c: 3 }), { r: 2, c: 3 });
});

test('valid blue move is accepted', () => {
  const board = Array.from({ length: 8 }, () => Array(8).fill(null));
  board[5][2] = { player: BLUE, isKing: false };

  const result = validateMoveForPlayer(board, BLUE, BLUE, { r: 5, c: 2 }, { r: 4, c: 3 });

  assert.equal(result.valid, true);
  assert.equal(result.board[4][3].player, BLUE);
});

test('jump move is accepted when available', () => {
  const board = Array.from({ length: 8 }, () => Array(8).fill(null));
  board[5][2] = { player: BLUE, isKing: false };
  board[4][3] = { player: RED, isKing: false };

  const result = validateMoveForPlayer(board, BLUE, BLUE, { r: 5, c: 2 }, { r: 3, c: 4 });

  assert.equal(result.valid, true);
  assert.equal(result.board[4][3], null);
});

test('winner is detected when opponent has no pieces', () => {
  const board = Array.from({ length: 8 }, () => Array(8).fill(null));
  board[0][0] = { player: BLUE, isKing: false };

  const result = getWinner(board);

  assert.equal(result.winner, BLUE);
});

test('multiple jump detection works', () => {
  const board = Array.from({ length: 8 }, () => Array(8).fill(null));
  board[5][2] = { player: BLUE, isKing: false };
  board[4][3] = { player: RED, isKing: false };
  board[2][5] = { player: RED, isKing: false };

  const firstJump = getValidMoves(board, 5, 2, board[5][2])[0];
  assert.deepEqual(firstJump, { r: 3, c: 4, jump: { r: 4, c: 3 } });

  const nextBoard = applyMove(board, { r: 5, c: 2 }, { r: 3, c: 4 }, firstJump);
  assert.equal(nextBoard.board[4][3], null);

  const followUpMoves = getValidMoves(nextBoard.board, 3, 4, nextBoard.board[3][4]);
  assert.deepEqual(followUpMoves.some((move) => move.r === 1 && move.c === 6), true);
});
