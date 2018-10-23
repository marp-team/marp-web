import IncrementalDOM from 'incremental-dom'
import animationFrame from './animation-frame'
import { patch } from './marp/incremental-dom-proxy'
import MarpManager from './marp/manager'

export default function index() {
  initializePreview(
    <HTMLTextAreaElement>document.getElementById('editor'),
    <HTMLDivElement>document.getElementById('preview'),
    <HTMLStyleElement>document.getElementById('preview-css')
  )
  initializeMenu()

  animationFrame.start()
}

function initializePreview(
  editor: HTMLTextAreaElement,
  preview: HTMLElement,
  style: HTMLStyleElement
) {
  const marpManager = new MarpManager()
  const render = markdown => marpManager.render(markdown || '')

  marpManager.onRendered = rendered => {
    const { html, css } = rendered

    const renderDOM = () =>
      animationFrame.push(() => {
        if (style.textContent !== css) style.textContent = css
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
