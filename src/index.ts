import IncrementalDOM from 'incremental-dom'
import Marp, { ready } from './marp'

export default function index() {
  ready()

  const marp = Marp()
  const editor = <HTMLTextAreaElement>document.getElementById('editor')
  const preview = <HTMLDivElement>document.getElementById('preview')
  const previewCSS = <HTMLStyleElement>document.getElementById('preview-css')

  const render = markdown => {
    const { html, css } = marp.render(markdown || '')

    if (previewCSS.textContent !== css) previewCSS.textContent = css
    IncrementalDOM.patch(preview, html)
  }

  editor.addEventListener('input', () => render(editor.value))
  render(editor.value)
}
