import { GameState, CellState, saveState } from '../state'

export function renderBoard(state: GameState, container: HTMLElement, onChange: () => void) {
  container.innerHTML = ''

  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const cell = document.createElement('div')
      cell.className = 'cell'
      cell.dataset.row = String(r)
      cell.dataset.col = String(c)

      const cs = state.cells[r][c]
      applyClasses(cell, cs, state.selected, r, c)

      if (cs.value !== null) {
        cell.textContent = String(cs.value)
      } else if (cs.notes.size > 0) {
        cell.appendChild(renderNotes(cs.notes))
      }

      cell.addEventListener('click', () => {
        state.selected = [r, c]
        onChange()
      })

      container.appendChild(cell)
    }
  }
}

function applyClasses(
  cell: HTMLElement,
  cs: CellState,
  selected: [number, number] | null,
  r: number,
  c: number
) {
  cell.classList.toggle('given', cs.isGiven)
  cell.classList.toggle('error', cs.isError)
  cell.classList.toggle('selected', selected !== null && selected[0] === r && selected[1] === c)

  if (selected) {
    const [sr, sc] = selected
    const sameBox =
      Math.floor(sr / 3) === Math.floor(r / 3) && Math.floor(sc / 3) === Math.floor(c / 3)
    cell.classList.toggle('highlight', sr === r || sc === c || sameBox)

    const selState = null // we can't access state here easily, handled outside
    // Highlight same number
  }
}

function renderNotes(notes: Set<number>): HTMLElement {
  const grid = document.createElement('div')
  grid.className = 'notes-grid'
  for (let n = 1; n <= 9; n++) {
    const span = document.createElement('span')
    span.textContent = notes.has(n) ? String(n) : ''
    grid.appendChild(span)
  }
  return grid
}

export function handleKeyInput(state: GameState, key: string): boolean {
  if (!state.selected || state.completed) return false
  const [r, c] = state.selected

  // Arrow navigation
  const moves: Record<string, [number, number]> = {
    ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1],
  }
  if (moves[key]) {
    const [dr, dc] = moves[key]
    state.selected = [
      Math.max(0, Math.min(8, r + dr)),
      Math.max(0, Math.min(8, c + dc)),
    ]
    return true
  }

  const cs = state.cells[r][c]
  if (cs.isGiven) return false

  if (key === 'Backspace' || key === 'Delete' || key === '0') {
    cs.value = null
    cs.notes.clear()
    cs.isError = false
    return true
  }

  const num = parseInt(key)
  if (num >= 1 && num <= 9) {
    if (state.noteMode) {
      if (cs.value === null) {
        cs.notes.has(num) ? cs.notes.delete(num) : cs.notes.add(num)
      }
    } else {
      cs.value = num
      cs.notes.clear()
      cs.isError = state.showErrors && state.solution[r][c] !== num
    }
    return true
  }

  return false
}

export function checkCompletion(state: GameState): boolean {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (state.cells[r][c].value !== state.solution[r][c]) return false
    }
  }
  return true
}
