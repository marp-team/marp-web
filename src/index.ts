import IncrementalDOM from 'incremental-dom'
import animationFrame from './animation-frame'
import { patch } from './marp/incremental-dom-proxy'
import MarpManager from './marp/manager'

export default function index() {
  const marpMg = new MarpManager()
  const editor = <HTMLTextAreaElement>document.getElementById('editor')
  const preview = <HTMLDivElement>document.getElementById('preview')
  const previewCSS = <HTMLStyleElement>document.getElementById('preview-css')

  const render = markdown => marpMg.render(markdown || '')

  marpMg.onRendered = rendered => {
    const { html, css } = rendered

    const renderDOM = () =>
      animationFrame.push(() => {
        if (previewCSS.textContent !== css) previewCSS.textContent = css
        patch(IncrementalDOM, preview, html)
      })

    if ((<any>window).requestIdleCallback) {
      ;(<any>window).requestIdleCallback(renderDOM)
    } else {
      renderDOM()
    }
  }

  editor.addEventListener('input', () => render(editor.value))
  render(editor.value)

  animationFrame.start()
}

export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () =>
      navigator.serviceWorker.register('/service-worker.js')
    )
  }
}
