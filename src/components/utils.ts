export function combineClass(from, ...classes: string[]) {
  return [from.class || from.className, ...classes].filter(k => k).join(' ')
}
