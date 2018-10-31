const funcs = [
  'elementOpen',
  'elementOpenStart',
  'attr',
  'elementOpenEnd',
  'elementClose',
  'elementVoid',
  'text',
]

export type IncrementalDOMProxyBuffer = [number, any[]][]

export function patch(
  incrementalDOM: any,
  node: Element,
  buffer: IncrementalDOMProxyBuffer
) {
  incrementalDOM.patch(node, convert(incrementalDOM, buffer))
}

export function convert(
  incrementalDOM: any,
  buffer: IncrementalDOMProxyBuffer
) {
  return () => {
    for (const [funcIdx, args] of buffer)
      if (funcs[funcIdx]) incrementalDOM[funcs[funcIdx]](...args)
  }
}

export default class IncrementalDOMProxy {
  private buffer: IncrementalDOMProxyBuffer

  constructor() {
    this.buffer = []

    funcs.forEach((func, idx) => {
      this[func] = (...args) => this.buffer.push([idx, args])
    })
  }

  use(func: Function) {
    this.buffer = []
    func()

    return this.buffer
  }
}
