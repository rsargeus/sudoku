import { generatePuzzle, Difficulty } from './engine/difficulty'
import { createState, saveState, loadState, clearSave, GameState } from './state'
import { renderBoard, checkCompletion } from './ui/board'
import { setupControls } from './ui/controls'
import { Timer } from './ui/timer'

let state: GameState
let timer: Timer

function startGame(difficulty: Difficulty) {
  timer?.stop()
  clearSave()

  const { puzzle, solution } = generatePuzzle(difficulty)
  state = createState(difficulty, puzzle, solution)

  const diffSelect = document.getElementById('difficulty-select') as HTMLSelectElement
  diffSelect.value = difficulty

  init()
}

function init() {
  const board = document.getElementById('board')!
  const timerEl = document.getElementById('timer')!

  timer = new Timer(timerEl)

  function render() {
    renderBoard(state, board, render)
    highlightSameNumber()

    if (!state.completed && checkCompletion(state)) {
      state.completed = true
      timer.stop()
      setTimeout(() => alert('Grattis! Puzzlet är löst! 🎉'), 50)
    }

    saveState(state)
  }

  setupControls(state, render, (diff) => startGame(diff as Difficulty))

  if (!state.completed) {
    timer.start(state.elapsed, (t) => {
      state.elapsed = t
    })
  } else {
    timer.render(state.elapsed)
  }

  render()
}

function highlightSameNumber() {
  if (!state.selected) return
  const [sr, sc] = state.selected
  const selVal = state.cells[sr][sc].value

  document.querySelectorAll<HTMLElement>('.cell').forEach(cell => {
    const r = parseInt(cell.dataset.row!)
    const c = parseInt(cell.dataset.col!)
    cell.classList.toggle('same-number', selVal !== null && state.cells[r][c].value === selVal)
  })
}

// Bootstrap
const saved = loadState()
if (saved) {
  state = saved
  init()
} else {
  startGame('easy')
}
