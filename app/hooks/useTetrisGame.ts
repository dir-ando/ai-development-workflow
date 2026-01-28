import { useState, useCallback } from 'react';

import {
  createEmptyBoard,
  createRandomTetromino,
  rotateTetromino,
  isValidMove,
  mergePieceToBoard,
  clearLines,
  calculateScore,
  isGameOver,
} from '@/app/utils/tetris';

import type { GameState, Tetromino, Position } from '@/app/types/tetris';

export function useTetrisGame() {
  const [gameState, setGameState] = useState<GameState>(() => ({
    board: createEmptyBoard(),
    currentPiece: createRandomTetromino(),
    nextPiece: createRandomTetromino(),
    score: 0,
    isGameOver: false,
    isPaused: false,
  }));

  const resetGame = useCallback(() => {
    setGameState({
      board: createEmptyBoard(),
      currentPiece: createRandomTetromino(),
      nextPiece: createRandomTetromino(),
      score: 0,
      isGameOver: false,
      isPaused: false,
    });
  }, []);

  const togglePause = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      isPaused: !prev.isPaused,
    }));
  }, []);

  const movePiece = useCallback((dx: number, dy: number) => {
    setGameState(prev => {
      if (prev.isGameOver || prev.isPaused || !prev.currentPiece) {
        return prev;
      }

      const newPosition: Position = {
        x: prev.currentPiece.position.x + dx,
        y: prev.currentPiece.position.y + dy,
      };

      if (isValidMove(prev.board, prev.currentPiece, newPosition)) {
        return {
          ...prev,
          currentPiece: {
            ...prev.currentPiece,
            position: newPosition,
          },
        };
      }

      // If moving down and can't move, lock the piece
      if (dy > 0) {
        return lockPiece(prev);
      }

      return prev;
    });
  }, []);

  const rotatePiece = useCallback(() => {
    setGameState(prev => {
      if (prev.isGameOver || prev.isPaused || !prev.currentPiece) {
        return prev;
      }

      const rotated = rotateTetromino(prev.currentPiece);

      if (isValidMove(prev.board, rotated, rotated.position)) {
        return {
          ...prev,
          currentPiece: rotated,
        };
      }

      // Try wall kicks
      const kicks = [
        { x: -1, y: 0 },
        { x: 1, y: 0 },
        { x: -2, y: 0 },
        { x: 2, y: 0 },
      ];

      for (const kick of kicks) {
        const kickedPosition: Position = {
          x: rotated.position.x + kick.x,
          y: rotated.position.y + kick.y,
        };

        if (isValidMove(prev.board, rotated, kickedPosition)) {
          return {
            ...prev,
            currentPiece: {
              ...rotated,
              position: kickedPosition,
            },
          };
        }
      }

      return prev;
    });
  }, []);

  const hardDrop = useCallback(() => {
    setGameState(prev => {
      if (prev.isGameOver || prev.isPaused || !prev.currentPiece) {
        return prev;
      }

      let newY = prev.currentPiece.position.y;
      let dropDistance = 0;

      // Find the lowest valid position
      while (
        isValidMove(prev.board, prev.currentPiece, {
          x: prev.currentPiece.position.x,
          y: newY + 1,
        })
      ) {
        newY++;
        dropDistance++;
      }

      const droppedPiece: Tetromino = {
        ...prev.currentPiece,
        position: {
          x: prev.currentPiece.position.x,
          y: newY,
        },
      };

      return lockPiece({
        ...prev,
        currentPiece: droppedPiece,
        score: prev.score + dropDistance * 2, // Bonus points for hard drop
      });
    });
  }, []);

  const lockPiece = (state: GameState): GameState => {
    if (!state.currentPiece) return state;

    // Merge piece to board
    let newBoard = mergePieceToBoard(state.board, state.currentPiece);

    // Clear completed lines
    const { newBoard: clearedBoard, linesCleared } = clearLines(newBoard);
    newBoard = clearedBoard;

    // Calculate new score
    const newScore = calculateScore(linesCleared, state.score);

    // Get next piece
    const newCurrentPiece = state.nextPiece;
    const newNextPiece = createRandomTetromino();

    // Check game over
    if (newCurrentPiece && isGameOver(newBoard, newCurrentPiece)) {
      return {
        ...state,
        board: newBoard,
        currentPiece: newCurrentPiece,
        nextPiece: newNextPiece,
        score: newScore,
        isGameOver: true,
      };
    }

    return {
      ...state,
      board: newBoard,
      currentPiece: newCurrentPiece,
      nextPiece: newNextPiece,
      score: newScore,
    };
  };

  return {
    gameState,
    movePiece,
    rotatePiece,
    hardDrop,
    resetGame,
    togglePause,
  };
}
