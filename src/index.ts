import { Dropdown } from './components/dropdown'
import Preview from './preview'

export default function index() {
  // Intialize preview
  new Preview({
    editor: <HTMLTextAreaElement>document.getElementById('editor'),
    container: <HTMLDivElement>document.getElementById('preview'),
    style: <HTMLStyleElement>document.getElementById('preview-css'),
  })

  // Main menu
  new Dropdown(document.getElementById('menu')!, [
    { label: 'New' },
    undefined,
    { label: 'Open...' },
    { label: 'Save as local file' },
    undefined,
    { label: 'Print / Export to PDF' },
  ])
}

export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () =>
      navigator.serviceWorker.register('/service-worker.js')
    )
  }
}
