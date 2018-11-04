import * as preact from 'preact'
import App from './components/app'

const { h, render } = preact

export default function index() {
  render(<App />, document.getElementById('marp')!)
}

export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () =>
      navigator.serviceWorker.register('/service-worker.js')
    )
  }
}
