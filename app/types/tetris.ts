/**
 * Tetris型定義
 */

export type TetrominoType = 'I' | 'J' | 'L' | 'O' | 'S' | 'T' | 'Z';

export interface Position {
  x: number;
  y: number;
}

export interface Tetromino {
  type: TetrominoType;
  shape: number[][];
  position: Position;
}

export type Board = (TetrominoType | null)[][];

export interface GameState {
  board: Board;
  currentPiece: Tetromino | null;
  nextPiece: Tetromino | null;
  score: number;
  gameOver: boolean;
  isPaused: boolean;
}
