/**
 * Tetris定数定義
 */

import type { TetrominoType } from '../types/tetris';

// ゲームボードサイズ
export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;

// ゲームスピード (ミリ秒)
export const INITIAL_DROP_SPEED = 1000;
export const MIN_DROP_SPEED = 100;
export const SPEED_INCREASE_PER_LINE = 50;

// スコアリング
export const SCORE_SINGLE_LINE = 100;
export const SCORE_DOUBLE_LINE = 300;
export const SCORE_TRIPLE_LINE = 500;
export const SCORE_TETRIS = 800;
export const SCORE_SOFT_DROP = 1;
export const SCORE_HARD_DROP = 2;

// テトリミノの形状定義
export const TETROMINO_SHAPES: Record<TetrominoType, number[][]> = {
  I: [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  J: [
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  L: [
    [0, 0, 1],
    [1, 1, 1],
    [0, 0, 0],
  ],
  O: [
    [1, 1],
    [1, 1],
  ],
  S: [
    [0, 1, 1],
    [1, 1, 0],
    [0, 0, 0],
  ],
  T: [
    [0, 1, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  Z: [
    [1, 1, 0],
    [0, 1, 1],
    [0, 0, 0],
  ],
};

// テトリミノの色
export const TETROMINO_COLORS: Record<TetrominoType, string> = {
  I: '#00f0f0', // シアン
  J: '#0000f0', // 青
  L: '#f0a000', // オレンジ
  O: '#f0f000', // 黄
  S: '#00f000', // 緑
  T: '#a000f0', // 紫
  Z: '#f00000', // 赤
};

// すべてのテトリミノタイプ
export const TETROMINO_TYPES: TetrominoType[] = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];
