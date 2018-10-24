import * as preact from 'preact'
import Header from './components/header'
import Preview from './preview'

const { h, render } = preact

export default function index() {
  new Preview({
    editor: document.getElementById('editor') as HTMLTextAreaElement,
    container: document.getElementById('preview') as HTMLDivElement,
    style: document.getElementById('preview-css') as HTMLStyleElement,
  })

  render(<Header />, document.getElementById('header')!)
}

export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () =>
      navigator.serviceWorker.register('/service-worker.js')
    )
  }
}
