import Preview from './preview'

export default function index() {
  // Intialize preview
  new Preview({
    editor: <HTMLTextAreaElement>document.getElementById('editor'),
    container: <HTMLDivElement>document.getElementById('preview'),
    style: <HTMLStyleElement>document.getElementById('preview-css'),
  })

  initializeMenu()
}

function initializeMenu() {
  const menu = <HTMLButtonElement>document.getElementById('menu')

  menu.addEventListener('click', () => {
    menu.parentElement!.classList.toggle('marp__menu--open')
  })
}

export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () =>
      navigator.serviceWorker.register('/service-worker.js')
    )
  }
}
