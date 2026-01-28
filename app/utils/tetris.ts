import {
  BOARD_WIDTH,
  BOARD_HEIGHT,
  TETROMINO_SHAPES,
  TETROMINO_COLORS,
  POINTS_PER_LINE,
} from '@/app/constants/tetris';

import type { Board, Tetromino, TetrominoType, Position } from '@/app/types/tetris';

export function createEmptyBoard(): Board {
  return Array.from({ length: BOARD_HEIGHT }, () =>
    Array.from({ length: BOARD_WIDTH }, () => null)
  );
}

export function createRandomTetromino(): Tetromino {
  const types: TetrominoType[] = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];
  const type = types[Math.floor(Math.random() * types.length)];
  const shape = TETROMINO_SHAPES[type];
  const color = TETROMINO_COLORS[type];

  return {
    type,
    shape,
    color,
    position: {
      x: Math.floor((BOARD_WIDTH - shape[0].length) / 2),
      y: 0,
    },
  };
}

export function rotateTetromino(tetromino: Tetromino): Tetromino {
  const rotated = tetromino.shape[0].map((_, index) =>
    tetromino.shape.map(row => row[index]).reverse()
  );

  return {
    ...tetromino,
    shape: rotated,
  };
}

export function isValidMove(
  board: Board,
  tetromino: Tetromino,
  newPosition: Position
): boolean {
  for (let y = 0; y < tetromino.shape.length; y++) {
    for (let x = 0; x < tetromino.shape[y].length; x++) {
      if (tetromino.shape[y][x]) {
        const newX = newPosition.x + x;
        const newY = newPosition.y + y;

        // Check boundaries
        if (
          newX < 0 ||
          newX >= BOARD_WIDTH ||
          newY >= BOARD_HEIGHT
        ) {
          return false;
        }

        // Check collision with existing blocks (only if not above board)
        if (newY >= 0 && board[newY][newX]) {
          return false;
        }
      }
    }
  }

  return true;
}

export function mergePieceToBoard(board: Board, tetromino: Tetromino): Board {
  const newBoard = board.map(row => [...row]);

  for (let y = 0; y < tetromino.shape.length; y++) {
    for (let x = 0; x < tetromino.shape[y].length; x++) {
      if (tetromino.shape[y][x]) {
        const boardY = tetromino.position.y + y;
        const boardX = tetromino.position.x + x;

        if (boardY >= 0 && boardY < BOARD_HEIGHT) {
          newBoard[boardY][boardX] = tetromino.color;
        }
      }
    }
  }

  return newBoard;
}

export function clearLines(board: Board): { newBoard: Board; linesCleared: number } {
  const newBoard = board.filter(row => row.some(cell => cell === null));
  const linesCleared = BOARD_HEIGHT - newBoard.length;

  // Add empty rows at the top
  while (newBoard.length < BOARD_HEIGHT) {
    newBoard.unshift(Array.from({ length: BOARD_WIDTH }, () => null));
  }

  return { newBoard, linesCleared };
}

export function calculateScore(linesCleared: number, currentScore: number): number {
  if (linesCleared === 0) return currentScore;

  // Award bonus points for clearing multiple lines at once
  const multiplier = linesCleared === 4 ? 3 : linesCleared === 3 ? 2 : 1;
  return currentScore + POINTS_PER_LINE * linesCleared * multiplier;
}

export function isGameOver(board: Board, tetromino: Tetromino): boolean {
  return !isValidMove(board, tetromino, tetromino.position);
}
