/**
 * Tetrisゲームロジック (純粋関数)
 */

import type { Board, Tetromino, TetrominoType, Position } from '../types/tetris';
import {
  BOARD_WIDTH,
  BOARD_HEIGHT,
  TETROMINO_SHAPES,
  TETROMINO_TYPES,
  SCORE_SINGLE_LINE,
  SCORE_DOUBLE_LINE,
  SCORE_TRIPLE_LINE,
  SCORE_TETRIS,
} from '../constants/tetris';

/**
 * 空のボードを作成
 */
export function createEmptyBoard(): Board {
  return Array.from({ length: BOARD_HEIGHT }, () =>
    Array.from({ length: BOARD_WIDTH }, () => null)
  );
}

/**
 * ランダムなテトリミノを生成
 */
export function createRandomTetromino(): Tetromino {
  const type = TETROMINO_TYPES[Math.floor(Math.random() * TETROMINO_TYPES.length)];
  return {
    type,
    shape: TETROMINO_SHAPES[type],
    position: { x: Math.floor(BOARD_WIDTH / 2) - Math.floor(TETROMINO_SHAPES[type][0].length / 2), y: 0 },
  };
}

/**
 * テトリミノが配置可能かチェック
 */
export function canPlaceTetromino(board: Board, tetromino: Tetromino, position: Position): boolean {
  const { shape } = tetromino;

  for (let y = 0; y < shape.length; y++) {
    for (let x = 0; x < shape[y].length; x++) {
      if (shape[y][x]) {
        const newX = position.x + x;
        const newY = position.y + y;

        // 範囲外チェック
        if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT) {
          return false;
        }

        // 上端より上は許可（スポーン時）
        if (newY < 0) {
          continue;
        }

        // 衝突チェック
        if (board[newY][newX] !== null) {
          return false;
        }
      }
    }
  }

  return true;
}

/**
 * テトリミノを回転
 */
export function rotateTetromino(tetromino: Tetromino): Tetromino {
  const { shape } = tetromino;
  const n = shape.length;
  const rotated = Array.from({ length: n }, () => Array(n).fill(0));

  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      rotated[x][n - 1 - y] = shape[y][x];
    }
  }

  return { ...tetromino, shape: rotated };
}

/**
 * 壁蹴り（回転時の位置調整）を試みる
 */
export function tryRotateWithWallKick(
  board: Board,
  tetromino: Tetromino
): Tetromino | null {
  const rotated = rotateTetromino(tetromino);

  // 回転後の位置で配置可能かチェック
  if (canPlaceTetromino(board, rotated, rotated.position)) {
    return rotated;
  }

  // 壁蹴りを試みる（左右に1マスずつ）
  const kicks = [
    { x: -1, y: 0 },
    { x: 1, y: 0 },
    { x: -2, y: 0 },
    { x: 2, y: 0 },
    { x: 0, y: -1 },
  ];

  for (const kick of kicks) {
    const newPosition = {
      x: rotated.position.x + kick.x,
      y: rotated.position.y + kick.y,
    };

    if (canPlaceTetromino(board, rotated, newPosition)) {
      return { ...rotated, position: newPosition };
    }
  }

  return null;
}

/**
 * テトリミノをボードに固定
 */
export function mergeTetromino(board: Board, tetromino: Tetromino): Board {
  const newBoard = board.map(row => [...row]);
  const { shape, position, type } = tetromino;

  for (let y = 0; y < shape.length; y++) {
    for (let x = 0; x < shape[y].length; x++) {
      if (shape[y][x]) {
        const newY = position.y + y;
        const newX = position.x + x;

        if (newY >= 0 && newY < BOARD_HEIGHT && newX >= 0 && newX < BOARD_WIDTH) {
          newBoard[newY][newX] = type;
        }
      }
    }
  }

  return newBoard;
}

/**
 * 完成したラインを削除し、スコアを計算
 */
export function clearLines(board: Board): { newBoard: Board; linesCleared: number; score: number } {
  const newBoard: Board = [];
  let linesCleared = 0;

  for (let y = 0; y < BOARD_HEIGHT; y++) {
    const isComplete = board[y].every(cell => cell !== null);

    if (!isComplete) {
      newBoard.push([...board[y]]);
    } else {
      linesCleared++;
    }
  }

  // 削除した分だけ上に空行を追加
  while (newBoard.length < BOARD_HEIGHT) {
    newBoard.unshift(Array(BOARD_WIDTH).fill(null));
  }

  // スコア計算
  let score = 0;
  switch (linesCleared) {
    case 1:
      score = SCORE_SINGLE_LINE;
      break;
    case 2:
      score = SCORE_DOUBLE_LINE;
      break;
    case 3:
      score = SCORE_TRIPLE_LINE;
      break;
    case 4:
      score = SCORE_TETRIS;
      break;
  }

  return { newBoard, linesCleared, score };
}

/**
 * ハードドロップ時の落下距離を計算
 */
export function calculateDropDistance(board: Board, tetromino: Tetromino): number {
  let distance = 0;

  while (canPlaceTetromino(board, tetromino, { x: tetromino.position.x, y: tetromino.position.y + distance + 1 })) {
    distance++;
  }

  return distance;
}
