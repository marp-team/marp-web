import IncrementalDOM from 'incremental-dom'
import IncrementalDOMProxy from './marp/incremental-dom-proxy'
import MarpManager, { ready } from './marp/manager'

export default function index() {
  ready()

  const marpMg = new MarpManager()
  const editor = <HTMLTextAreaElement>document.getElementById('editor')
  const preview = <HTMLDivElement>document.getElementById('preview')
  const previewCSS = <HTMLStyleElement>document.getElementById('preview-css')

  const render = markdown => marpMg.render(markdown || '')

  marpMg.onRendered = rendered => {
    const { html, css } = rendered

    window.requestAnimationFrame(() => {
      if (previewCSS.textContent !== css) previewCSS.textContent = css
      IncrementalDOMProxy.patch(IncrementalDOM, preview, html)
    })
  }

  editor.addEventListener('input', () => render(editor.value))
  render(editor.value)
}
