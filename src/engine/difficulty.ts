import { Board, cloneBoard, countSolutions } from './solver'
import { generateSolvedBoard } from './generator'

export type Difficulty = 'beginner' | 'easy' | 'medium' | 'hard' | 'expert'

const GIVEN_CELLS: Record<Difficulty, [number, number]> = {
  beginner: [50, 55],
  easy:     [40, 49],
  medium:   [32, 39],
  hard:     [26, 31],
  expert:   [22, 25],
}

function shuffle<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

export function generatePuzzle(difficulty: Difficulty): { puzzle: Board; solution: Board } {
  const solution = generateSolvedBoard()
  const puzzle = cloneBoard(solution)

  const [minGiven, maxGiven] = GIVEN_CELLS[difficulty]
  const targetGiven = minGiven + Math.floor(Math.random() * (maxGiven - minGiven + 1))
  const targetRemove = 81 - targetGiven

  const positions = shuffle(
    Array.from({ length: 81 }, (_, i) => [Math.floor(i / 9), i % 9] as [number, number])
  )

  let removed = 0
  for (const [row, col] of positions) {
    if (removed >= targetRemove) break

    const backup = puzzle[row][col]
    puzzle[row][col] = null

    const copy = cloneBoard(puzzle)
    if (countSolutions(copy) === 1) {
      removed++
    } else {
      puzzle[row][col] = backup
    }
  }

  return { puzzle, solution }
}
