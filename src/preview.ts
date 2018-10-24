import animationFrame from './animation-frame'
import IncrementalDOM from 'incremental-dom'
import { patch } from './marp/incremental-dom-proxy'
import MarpManager from './marp/manager'

export default class Preview {
  readonly editor: HTMLTextAreaElement
  readonly container: HTMLElement
  readonly style: HTMLStyleElement

  private marp: MarpManager

  constructor(elements: {
    editor: HTMLTextAreaElement
    container: HTMLElement
    style: HTMLStyleElement
  }) {
    this.editor = elements.editor
    this.container = elements.container
    this.style = elements.style

    this.marp = new MarpManager()
    this.initialize()
  }

  private initialize() {
    this.marp.onRendered = rendered => {
      const { html, css } = rendered

      const renderDOM = () =>
        animationFrame.push(() => {
          if (this.style.textContent !== css) this.style.textContent = css
          patch(IncrementalDOM, this.container, html)
        })

      if ((<any>window).requestIdleCallback) {
        ;(<any>window).requestIdleCallback(renderDOM)
      } else {
        renderDOM()
      }
    }

    this.editor.addEventListener('input', () => this.render())
    this.render()

    animationFrame.start()
  }

  private render() {
    this.marp.render(this.editor.value || '')
  }
}
