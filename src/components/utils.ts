import { detect } from 'detect-browser'

const browser = detect()

export function combineClass(from, ...classes: string[]) {
  return [from.class || from.className, ...classes].filter(k => k).join(' ')
}

export function isChrome() {
  return browser && browser.name === 'chrome'
}
