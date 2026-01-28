/**
 * ゲームループフック（自動落下）
 */

'use client';

import { useEffect, useRef } from 'react';

interface GameLoopOptions {
  isActive: boolean;
  interval: number;
  callback: () => void;
}

export function useGameLoop({ isActive, interval, callback }: GameLoopOptions) {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    if (!isActive) {
      return;
    }

    const timer = setInterval(() => {
      callbackRef.current();
    }, interval);

    return () => {
      clearInterval(timer);
    };
  }, [isActive, interval]);
}
