/**
 * Tetrisゲームページ
 */

'use client';

import { useTetrisGame } from '../hooks/useTetrisGame';
import { useKeyboardControls } from '../hooks/useKeyboardControls';
import { useGameLoop } from '../hooks/useGameLoop';
import { TETROMINO_COLORS, INITIAL_DROP_SPEED } from '../constants/tetris';
import type { Board, Tetromino } from '../types/tetris';

export default function TetrisPage() {
  const {
    gameState,
    moveLeft,
    moveRight,
    rotate,
    softDrop,
    hardDrop,
    togglePause,
    resetGame,
  } = useTetrisGame();

  // キーボード操作
  useKeyboardControls({
    onLeft: moveLeft,
    onRight: moveRight,
    onRotate: rotate,
    onSoftDrop: softDrop,
    onHardDrop: hardDrop,
    onPause: togglePause,
  });

  // 自動落下ループ
  useGameLoop({
    isActive: !gameState.gameOver && !gameState.isPaused,
    interval: INITIAL_DROP_SPEED,
    callback: softDrop,
  });

  /**
   * ボードとカレントピースを結合して表示用ボードを作成
   */
  const renderBoard = (): Board => {
    const displayBoard = gameState.board.map(row => [...row]);

    if (gameState.currentPiece) {
      const { shape, position, type } = gameState.currentPiece;

      for (let y = 0; y < shape.length; y++) {
        for (let x = 0; x < shape[y].length; x++) {
          if (shape[y][x]) {
            const boardY = position.y + y;
            const boardX = position.x + x;

            if (boardY >= 0 && boardY < displayBoard.length && boardX >= 0 && boardX < displayBoard[0].length) {
              displayBoard[boardY][boardX] = type;
            }
          }
        }
      }
    }

    return displayBoard;
  };

  /**
   * Next用のテトリミノを表示
   */
  const renderNextPiece = (piece: Tetromino | null) => {
    if (!piece) {
      return null;
    }

    const { shape, type } = piece;
    const color = TETROMINO_COLORS[type];

    return (
      <div className="inline-grid gap-[2px] bg-slate-800 p-2 rounded">
        {shape.map((row, y) => (
          <div key={y} className="flex gap-[2px]">
            {row.map((cell, x) => (
              <div
                key={x}
                className="w-6 h-6 rounded-sm border border-slate-700"
                style={{
                  backgroundColor: cell ? color : 'transparent',
                }}
              />
            ))}
          </div>
        ))}
      </div>
    );
  };

  const displayBoard = renderBoard();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            TETRIS
          </h1>
          <p className="text-slate-400 text-sm">
            矢印キー: 移動/回転 | スペース: ハードドロップ | P/Esc: ポーズ
          </p>
        </div>

        {/* メインコンテンツ */}
        <div className="flex flex-col lg:flex-row gap-8 justify-center items-start">
          {/* ゲームボード */}
          <div className="bg-slate-800 rounded-2xl shadow-2xl p-6">
            <div className="relative">
              <div className="inline-grid gap-[2px] bg-slate-900 p-4 rounded-lg">
                {displayBoard.map((row, y) => (
                  <div key={y} className="flex gap-[2px]">
                    {row.map((cell, x) => {
                      const color = cell ? TETROMINO_COLORS[cell] : '#1e293b';
                      const hasBorder = cell !== null;

                      return (
                        <div
                          key={x}
                          className={`w-7 h-7 rounded-sm transition-colors ${
                            hasBorder ? 'border-2 border-slate-700' : 'border border-slate-800'
                          }`}
                          style={{
                            backgroundColor: color,
                          }}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>

              {/* ゲームオーバー/ポーズオーバーレイ */}
              {(gameState.gameOver || gameState.isPaused) && (
                <div className="absolute inset-0 bg-black bg-opacity-80 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <h2 className="text-4xl font-bold mb-4">
                      {gameState.gameOver ? 'GAME OVER' : 'PAUSED'}
                    </h2>
                    {gameState.gameOver && (
                      <button
                        onClick={resetGame}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors"
                      >
                        リトライ
                      </button>
                    )}
                    {gameState.isPaused && (
                      <p className="text-slate-300">P/Escで再開</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* サイドパネル */}
          <div className="flex flex-col gap-6">
            {/* スコア */}
            <div className="bg-slate-800 rounded-2xl shadow-xl p-6">
              <h3 className="text-sm font-semibold text-slate-400 mb-2">SCORE</h3>
              <p className="text-4xl font-bold text-white">{gameState.score}</p>
            </div>

            {/* Next */}
            <div className="bg-slate-800 rounded-2xl shadow-xl p-6">
              <h3 className="text-sm font-semibold text-slate-400 mb-4">NEXT</h3>
              <div className="flex justify-center">
                {renderNextPiece(gameState.nextPiece)}
              </div>
            </div>

            {/* 操作説明 */}
            <div className="bg-slate-800 rounded-2xl shadow-xl p-6">
              <h3 className="text-sm font-semibold text-slate-400 mb-3">CONTROLS</h3>
              <div className="space-y-2 text-sm text-slate-300">
                <div className="flex justify-between">
                  <span>← →</span>
                  <span>移動</span>
                </div>
                <div className="flex justify-between">
                  <span>↑</span>
                  <span>回転</span>
                </div>
                <div className="flex justify-between">
                  <span>↓</span>
                  <span>ソフトドロップ</span>
                </div>
                <div className="flex justify-between">
                  <span>Space</span>
                  <span>ハードドロップ</span>
                </div>
                <div className="flex justify-between">
                  <span>P/Esc</span>
                  <span>ポーズ</span>
                </div>
              </div>
            </div>

            {/* リセットボタン */}
            <button
              onClick={resetGame}
              className="px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg font-semibold transition-colors"
            >
              新しいゲーム
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
