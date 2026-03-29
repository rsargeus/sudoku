export type Board = (number | null)[][]

export function isValid(board: Board, row: number, col: number, num: number): boolean {
  // Check row
  for (let c = 0; c < 9; c++) {
    if (board[row][c] === num) return false
  }
  // Check column
  for (let r = 0; r < 9; r++) {
    if (board[r][col] === num) return false
  }
  // Check 3x3 box
  const boxRow = Math.floor(row / 3) * 3
  const boxCol = Math.floor(col / 3) * 3
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      if (board[boxRow + r][boxCol + c] === num) return false
    }
  }
  return true
}

/** Solves in-place. Returns number of solutions found (stops at 2 to detect non-unique). */
export function countSolutions(board: Board, limit = 2): number {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === null) {
        let count = 0
        for (let num = 1; num <= 9; num++) {
          if (isValid(board, row, col, num)) {
            board[row][col] = num
            count += countSolutions(board, limit - count)
            board[row][col] = null
            if (count >= limit) return count
          }
        }
        return count
      }
    }
  }
  return 1 // No empty cells — solved
}

export function solve(board: Board): boolean {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === null) {
        for (let num = 1; num <= 9; num++) {
          if (isValid(board, row, col, num)) {
            board[row][col] = num
            if (solve(board)) return true
            board[row][col] = null
          }
        }
        return false
      }
    }
  }
  return true
}

export function cloneBoard(board: Board): Board {
  return board.map(row => [...row])
}
