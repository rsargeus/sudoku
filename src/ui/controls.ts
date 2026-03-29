import { GameState } from '../state'
import { handleKeyInput, checkCompletion } from './board'

export function setupControls(
  state: GameState,
  onInput: () => void,
  onNewGame: (difficulty: string) => void
) {
  // Number pad
  document.querySelectorAll<HTMLButtonElement>('.num-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (handleKeyInput(state, btn.dataset.num!)) onInput()
    })
  })

  // Erase button
  document.getElementById('btn-erase')?.addEventListener('click', () => {
    if (handleKeyInput(state, 'Backspace')) onInput()
  })

  // Note toggle
  const noteBtn = document.getElementById('btn-notes')!
  noteBtn?.addEventListener('click', () => {
    state.noteMode = !state.noteMode
    noteBtn.classList.toggle('active', state.noteMode)
  })

  // Error toggle
  const errBtn = document.getElementById('btn-errors')!
  errBtn?.addEventListener('click', () => {
    state.showErrors = !state.showErrors
    errBtn.classList.toggle('active', state.showErrors)
    errBtn.textContent = state.showErrors ? 'Fel: På' : 'Fel: Av'
  })

  // New game
  const diffSelect = document.getElementById('difficulty-select') as HTMLSelectElement
  document.getElementById('btn-new')?.addEventListener('click', () => {
    onNewGame(diffSelect.value)
  })

  // Give up
  document.getElementById('btn-giveup')?.addEventListener('click', () => {
    if (!confirm('Visa lösningen?')) return
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        const cs = state.cells[r][c]
        cs.value = state.solution[r][c]
        cs.notes.clear()
        cs.isError = false
      }
    }
    state.completed = true
    onInput()
  })

  // Keyboard
  document.addEventListener('keydown', e => {
    if (handleKeyInput(state, e.key)) {
      e.preventDefault()
      onInput()
    }
  })
}
