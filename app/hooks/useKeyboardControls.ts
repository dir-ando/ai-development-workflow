import { useEffect, useCallback } from 'react';

interface KeyboardControlsConfig {
  onMoveLeft: () => void;
  onMoveRight: () => void;
  onMoveDown: () => void;
  onRotate: () => void;
  onHardDrop: () => void;
  onPause?: () => void;
  enabled: boolean;
}

export function useKeyboardControls({
  onMoveLeft,
  onMoveRight,
  onMoveDown,
  onRotate,
  onHardDrop,
  onPause,
  enabled,
}: KeyboardControlsConfig) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          onMoveLeft();
          break;
        case 'ArrowRight':
          event.preventDefault();
          onMoveRight();
          break;
        case 'ArrowDown':
          event.preventDefault();
          onMoveDown();
          break;
        case 'ArrowUp':
          event.preventDefault();
          onRotate();
          break;
        case ' ':
          event.preventDefault();
          onHardDrop();
          break;
        case 'p':
        case 'P':
        case 'Escape':
          event.preventDefault();
          onPause?.();
          break;
      }
    },
    [enabled, onMoveLeft, onMoveRight, onMoveDown, onRotate, onHardDrop, onPause]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
}
