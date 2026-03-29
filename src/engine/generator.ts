import { Board, isValid, cloneBoard } from './solver'

function shuffle<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

function fillBoard(board: Board): boolean {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === null) {
        const nums = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9])
        for (const num of nums) {
          if (isValid(board, row, col, num)) {
            board[row][col] = num
            if (fillBoard(board)) return true
            board[row][col] = null
          }
        }
        return false
      }
    }
  }
  return true
}

export function generateSolvedBoard(): Board {
  const board: Board = Array.from({ length: 9 }, () => Array(9).fill(null))
  fillBoard(board)
  return board
}

export function cloneAsNullable(board: Board): Board {
  return board.map(row => row.map(v => v))
}

export { cloneBoard }
