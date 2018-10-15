import MarpBrowser from '@marp-team/marp-core/lib/browser.cjs'

export class AnimationFrame {
  private animationEvents: (() => void)[] = []
  private dispatchedInternal = false
  private requestId?: number

  get dispatched() {
    return this.dispatchedInternal
  }

  push(func: () => void) {
    return this.animationEvents.push(func)
  }

  start() {
    if (!this.dispatchedInternal) {
      this.dispatchedInternal = true
      this.requestAnimationFrame()
    }
  }

  stop() {
    if (this.requestId) window.cancelAnimationFrame(this.requestId)
    this.dispatchedInternal = false
  }

  private loop() {
    // At first, clear the event queue for adding funcs to execute in next frame
    const events = this.animationEvents
    this.animationEvents = []

    // Execute registered events
    for (const func of events) func()

    // Finally trigger marp-core's fitting
    MarpBrowser(false)

    if (this.dispatchedInternal) this.requestId = this.requestAnimationFrame()
  }

  private requestAnimationFrame() {
    return window.requestAnimationFrame(() => this.loop())
  }
}

export default new AnimationFrame()
