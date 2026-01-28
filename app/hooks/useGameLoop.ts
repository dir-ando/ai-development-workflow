import { useEffect, useRef } from 'react';

import { INITIAL_DROP_SPEED } from '@/app/constants/tetris';

interface GameLoopConfig {
  onTick: () => void;
  isRunning: boolean;
  speed?: number;
}

export function useGameLoop({ onTick, isRunning, speed = INITIAL_DROP_SPEED }: GameLoopConfig) {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        onTick();
      }, speed);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, speed, onTick]);
}
