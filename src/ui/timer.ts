export class Timer {
  private interval: number | null = null
  private el: HTMLElement

  constructor(el: HTMLElement) {
    this.el = el
  }

  start(initial = 0, onTick: (elapsed: number) => void) {
    let elapsed = initial
    this.render(elapsed)
    this.interval = window.setInterval(() => {
      elapsed++
      this.render(elapsed)
      onTick(elapsed)
    }, 1000)
  }

  stop() {
    if (this.interval !== null) {
      clearInterval(this.interval)
      this.interval = null
    }
  }

  render(seconds: number) {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0')
    const s = (seconds % 60).toString().padStart(2, '0')
    this.el.textContent = `${m}:${s}`
  }
}
