import { Board, cloneBoard } from './engine/solver'
import { Difficulty } from './engine/difficulty'

export interface CellState {
  value: number | null
  notes: Set<number>
  isGiven: boolean
  isError: boolean
}

export interface GameState {
  difficulty: Difficulty
  puzzle: Board
  solution: Board
  cells: CellState[][]
  selected: [number, number] | null
  noteMode: boolean
  elapsed: number
  completed: boolean
  showErrors: boolean
  showSolution: boolean
}

const STORAGE_KEY = 'sudoku_save'

export function initCells(puzzle: Board, solution: Board): CellState[][] {
  return puzzle.map((row, r) =>
    row.map((val, c) => ({
      value: val,
      notes: new Set(),
      isGiven: val !== null,
      isError: false,
    }))
  )
}

export function createState(difficulty: Difficulty, puzzle: Board, solution: Board): GameState {
  return {
    difficulty,
    puzzle,
    solution,
    cells: initCells(puzzle, solution),
    selected: null,
    noteMode: false,
    elapsed: 0,
    completed: false,
    showErrors: true,
    showSolution: false,
  }
}

export function saveState(state: GameState): void {
  const serializable = {
    ...state,
    cells: state.cells.map(row =>
      row.map(cell => ({
        ...cell,
        notes: Array.from(cell.notes),
      }))
    ),
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(serializable))
}

export function loadState(): GameState | null {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw)
    parsed.cells = parsed.cells.map((row: any[]) =>
      row.map((cell: any) => ({
        ...cell,
        notes: new Set(cell.notes),
      }))
    )
    parsed.selected = null
    parsed.showErrors ??= true
    parsed.showSolution ??= false
    return parsed as GameState
  } catch {
    return null
  }
}

export function clearSave(): void {
  localStorage.removeItem(STORAGE_KEY)
}
