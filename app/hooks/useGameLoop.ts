/**
 * ゲームループフック（自動落下）
 */

'use client';

import { useEffect } from 'react';

interface GameLoopOptions {
  isActive: boolean;
  interval: number;
  callback: () => void;
}

export function useGameLoop({ isActive, interval, callback }: GameLoopOptions) {
  useEffect(() => {
    if (!isActive) {
      return;
    }

    const timer = setInterval(() => {
      callback();
    }, interval);

    return () => {
      clearInterval(timer);
    };
  }, [isActive, interval, callback]);
}
