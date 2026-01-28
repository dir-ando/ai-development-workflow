/**
 * キーボード入力処理フック
 */

'use client';

import { useEffect } from 'react';

interface KeyboardControls {
  onLeft: () => void;
  onRight: () => void;
  onRotate: () => void;
  onSoftDrop: () => void;
  onHardDrop: () => void;
  onPause: () => void;
}

export function useKeyboardControls({
  onLeft,
  onRight,
  onRotate,
  onSoftDrop,
  onHardDrop,
  onPause,
}: KeyboardControls) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // ゲーム操作キーの場合はデフォルト動作を防ぐ
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' ', 'p', 'P', 'Escape'].includes(event.key)) {
        event.preventDefault();
      }

      switch (event.key) {
        case 'ArrowLeft':
          onLeft();
          break;
        case 'ArrowRight':
          onRight();
          break;
        case 'ArrowUp':
          onRotate();
          break;
        case 'ArrowDown':
          onSoftDrop();
          break;
        case ' ':
          onHardDrop();
          break;
        case 'p':
        case 'P':
        case 'Escape':
          onPause();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onLeft, onRight, onRotate, onSoftDrop, onHardDrop, onPause]);
}
