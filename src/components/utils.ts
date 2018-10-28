import { detect } from 'detect-browser'

const browser = detect()

export function combineClass(from, ...classes: string[]) {
  const combined = {
    ...from,
    class: [from.className || from.class, ...classes].filter(k => k).join(' '),
  }

  delete combined.className
  return combined
}

export function isChrome() {
  return browser && browser.name === 'chrome'
}
