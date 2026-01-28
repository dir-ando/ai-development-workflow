'use client';

import { useMemo, useCallback } from 'react';

import { useTetrisGame } from '@/app/hooks/useTetrisGame';
import { useKeyboardControls } from '@/app/hooks/useKeyboardControls';
import { useGameLoop } from '@/app/hooks/useGameLoop';
import { mergePieceToBoard } from '@/app/utils/tetris';
import { BOARD_WIDTH, BOARD_HEIGHT } from '@/app/constants/tetris';

import type { Board } from '@/app/types/tetris';

export default function TetrisPage() {
  const { gameState, movePiece, rotatePiece, hardDrop, resetGame, togglePause } = useTetrisGame();

  const handleMoveDown = useCallback(() => {
    movePiece(0, 1);
  }, [movePiece]);

  const handleMoveLeft = useCallback(() => {
    movePiece(-1, 0);
  }, [movePiece]);

  const handleMoveRight = useCallback(() => {
    movePiece(1, 0);
  }, [movePiece]);

  // Game loop for automatic piece dropping
  useGameLoop({
    onTick: handleMoveDown,
    isRunning: !gameState.isGameOver && !gameState.isPaused,
  });

  // Keyboard controls
  useKeyboardControls({
    onMoveLeft: handleMoveLeft,
    onMoveRight: handleMoveRight,
    onMoveDown: handleMoveDown,
    onRotate: rotatePiece,
    onHardDrop: hardDrop,
    onPause: togglePause,
    enabled: !gameState.isGameOver,
  });

  // Render board with current piece
  const displayBoard = useMemo((): Board => {
    if (!gameState.currentPiece) {
      return gameState.board;
    }
    return mergePieceToBoard(gameState.board, gameState.currentPiece);
  }, [gameState.board, gameState.currentPiece]);

  // Render next piece preview (4x4 grid)
  const nextPieceGrid = useMemo(() => {
    const grid: (string | null)[][] = Array.from({ length: 4 }, () =>
      Array.from({ length: 4 }, () => null)
    );

    if (gameState.nextPiece) {
      const { shape, color } = gameState.nextPiece;
      for (let y = 0; y < shape.length; y++) {
        for (let x = 0; x < shape[y].length; x++) {
          if (shape[y][x]) {
            grid[y][x] = color;
          }
        }
      }
    }

    return grid;
  }, [gameState.nextPiece]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-black py-8 px-4">
      <main className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-2">
            TETRIS
          </h1>
          <p className="text-slate-400">
            矢印キーで操作、スペースキーでハードドロップ
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 items-start justify-center">
          {/* Game Board */}
          <div className="bg-slate-800 rounded-2xl shadow-2xl p-6">
            <div
              className="grid gap-[1px] bg-slate-700 p-[1px] rounded-lg"
              style={{
                gridTemplateColumns: `repeat(${BOARD_WIDTH}, 1.5rem)`,
                gridTemplateRows: `repeat(${BOARD_HEIGHT}, 1.5rem)`,
              }}
            >
              {displayBoard.map((row, y) =>
                row.map((cell, x) => (
                  <div
                    key={`${y}-${x}`}
                    className="w-6 h-6 rounded-sm border border-slate-900/20 transition-colors"
                    style={{
                      backgroundColor: cell || '#1e293b',
                    }}
                  />
                ))
              )}
            </div>

            {/* Game Over / Paused Overlay */}
            {(gameState.isGameOver || gameState.isPaused) && (
              <div className="mt-4 text-center">
                <div className="bg-slate-900/90 rounded-lg p-4">
                  <p className="text-2xl font-bold text-white mb-2">
                    {gameState.isGameOver ? 'GAME OVER' : 'PAUSED'}
                  </p>
                  {gameState.isGameOver && (
                    <button
                      onClick={resetGame}
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200"
                    >
                      リトライ
                    </button>
                  )}
                  {gameState.isPaused && (
                    <p className="text-slate-400 text-sm">
                      Pキーまたはエスケープで再開
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Side Panel */}
          <div className="flex flex-col gap-6">
            {/* Next Piece */}
            <div className="bg-slate-800 rounded-2xl shadow-xl p-6 min-w-[200px]">
              <h2 className="text-xl font-bold text-white mb-4">Next</h2>
              <div
                className="grid gap-[1px] bg-slate-700 p-[1px] rounded-lg"
                style={{
                  gridTemplateColumns: 'repeat(4, 1.5rem)',
                  gridTemplateRows: 'repeat(4, 1.5rem)',
                }}
              >
                {nextPieceGrid.map((row, y) =>
                  row.map((cell, x) => (
                    <div
                      key={`${y}-${x}`}
                      className="w-6 h-6 rounded-sm border border-slate-900/20"
                      style={{
                        backgroundColor: cell || '#1e293b',
                      }}
                    />
                  ))
                )}
              </div>
            </div>

            {/* Score */}
            <div className="bg-slate-800 rounded-2xl shadow-xl p-6">
              <h2 className="text-xl font-bold text-white mb-2">Score</h2>
              <p className="text-4xl font-bold text-blue-400">
                {gameState.score}
              </p>
            </div>

            {/* Controls */}
            <div className="bg-slate-800 rounded-2xl shadow-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">操作方法</h2>
              <div className="space-y-2 text-sm text-slate-300">
                <div className="flex justify-between">
                  <span>移動:</span>
                  <span className="font-mono text-slate-400">← →</span>
                </div>
                <div className="flex justify-between">
                  <span>回転:</span>
                  <span className="font-mono text-slate-400">↑</span>
                </div>
                <div className="flex justify-between">
                  <span>ソフトドロップ:</span>
                  <span className="font-mono text-slate-400">↓</span>
                </div>
                <div className="flex justify-between">
                  <span>ハードドロップ:</span>
                  <span className="font-mono text-slate-400">Space</span>
                </div>
                <div className="flex justify-between">
                  <span>ポーズ:</span>
                  <span className="font-mono text-slate-400">P / Esc</span>
                </div>
              </div>

              <button
                onClick={resetGame}
                className="w-full mt-4 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
              >
                新しいゲーム
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
