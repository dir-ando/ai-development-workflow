/**
 * Tetrisゲーム状態管理フック
 */

'use client';

import { useState, useCallback, useRef } from 'react';
import type { GameState, Tetromino, Board } from '../types/tetris';
import {
  createEmptyBoard,
  createRandomTetromino,
  canPlaceTetromino,
  tryRotateWithWallKick,
  mergeTetromino,
  clearLines,
  calculateDropDistance,
} from '../utils/tetris';
import { SCORE_SOFT_DROP, SCORE_HARD_DROP } from '../constants/tetris';

export function useTetrisGame() {
  const [gameState, setGameState] = useState<GameState>(() => {
    const firstPiece = createRandomTetromino();
    const secondPiece = createRandomTetromino();

    return {
      board: createEmptyBoard(),
      currentPiece: firstPiece,
      nextPiece: secondPiece,
      score: 0,
      gameOver: false,
      isPaused: false,
    };
  });

  // useRefで現在のゲーム状態を保持（クロージャ問題を回避）
  const gameStateRef = useRef(gameState);
  gameStateRef.current = gameState;

  /**
   * テトリミノを固定し、新しいピースを生成
   * useCallbackで安定した参照を保つ
   */
  const lockPiece = useCallback(() => {
    const state = gameStateRef.current;

    if (!state.currentPiece || state.gameOver || state.isPaused) {
      return;
    }

    // ボードにピースを固定
    const mergedBoard = mergeTetromino(state.board, state.currentPiece);

    // ライン消去とスコア計算
    const { newBoard, score: lineScore } = clearLines(mergedBoard);

    // 次のピースを生成
    const newCurrentPiece = state.nextPiece;
    const newNextPiece = createRandomTetromino();

    // ゲームオーバー判定
    const isGameOver = newCurrentPiece
      ? !canPlaceTetromino(newBoard, newCurrentPiece, newCurrentPiece.position)
      : true;

    setGameState({
      board: newBoard,
      currentPiece: isGameOver ? null : newCurrentPiece,
      nextPiece: newNextPiece,
      score: state.score + lineScore,
      gameOver: isGameOver,
      isPaused: state.isPaused,
    });
  }, []);

  /**
   * テトリミノを左に移動
   */
  const moveLeft = useCallback(() => {
    setGameState(state => {
      if (!state.currentPiece || state.gameOver || state.isPaused) {
        return state;
      }

      const newPosition = { x: state.currentPiece.position.x - 1, y: state.currentPiece.position.y };

      if (canPlaceTetromino(state.board, state.currentPiece, newPosition)) {
        return {
          ...state,
          currentPiece: { ...state.currentPiece, position: newPosition },
        };
      }

      return state;
    });
  }, []);

  /**
   * テトリミノを右に移動
   */
  const moveRight = useCallback(() => {
    setGameState(state => {
      if (!state.currentPiece || state.gameOver || state.isPaused) {
        return state;
      }

      const newPosition = { x: state.currentPiece.position.x + 1, y: state.currentPiece.position.y };

      if (canPlaceTetromino(state.board, state.currentPiece, newPosition)) {
        return {
          ...state,
          currentPiece: { ...state.currentPiece, position: newPosition },
        };
      }

      return state;
    });
  }, []);

  /**
   * テトリミノを回転
   */
  const rotate = useCallback(() => {
    setGameState(state => {
      if (!state.currentPiece || state.gameOver || state.isPaused) {
        return state;
      }

      const rotated = tryRotateWithWallKick(state.board, state.currentPiece);

      if (rotated) {
        return {
          ...state,
          currentPiece: rotated,
        };
      }

      return state;
    });
  }, []);

  /**
   * ソフトドロップ（1マス下に移動）
   */
  const softDrop = useCallback(() => {
    setGameState(state => {
      if (!state.currentPiece || state.gameOver || state.isPaused) {
        return state;
      }

      const newPosition = { x: state.currentPiece.position.x, y: state.currentPiece.position.y + 1 };

      if (canPlaceTetromino(state.board, state.currentPiece, newPosition)) {
        return {
          ...state,
          currentPiece: { ...state.currentPiece, position: newPosition },
          score: state.score + SCORE_SOFT_DROP,
        };
      }

      // 移動できない場合は固定
      lockPiece();
      return state;
    });
  }, [lockPiece]);

  /**
   * ハードドロップ（一番下まで即座に落とす）
   */
  const hardDrop = useCallback(() => {
    setGameState(state => {
      if (!state.currentPiece || state.gameOver || state.isPaused) {
        return state;
      }

      const dropDistance = calculateDropDistance(state.board, state.currentPiece);
      const newPosition = {
        x: state.currentPiece.position.x,
        y: state.currentPiece.position.y + dropDistance,
      };

      const updatedPiece = { ...state.currentPiece, position: newPosition };
      const newScore = state.score + dropDistance * SCORE_HARD_DROP;

      // 即座に固定
      lockPiece();

      return {
        ...state,
        score: newScore,
      };
    });
  }, [lockPiece]);

  /**
   * ポーズ/再開
   */
  const togglePause = useCallback(() => {
    setGameState(state => {
      if (state.gameOver) {
        return state;
      }

      return {
        ...state,
        isPaused: !state.isPaused,
      };
    });
  }, []);

  /**
   * ゲームをリセット
   */
  const resetGame = useCallback(() => {
    const firstPiece = createRandomTetromino();
    const secondPiece = createRandomTetromino();

    setGameState({
      board: createEmptyBoard(),
      currentPiece: firstPiece,
      nextPiece: secondPiece,
      score: 0,
      gameOver: false,
      isPaused: false,
    });
  }, []);

  return {
    gameState,
    moveLeft,
    moveRight,
    rotate,
    softDrop,
    hardDrop,
    togglePause,
    resetGame,
    lockPiece,
  };
}
