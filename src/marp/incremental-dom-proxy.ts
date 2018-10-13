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

export default class IncrementalDOMProxy {
  static patch(
    incrementalDOM: any,
    node: Element,
    buffer: IncrementalDOMProxyBuffer
  ) {
    incrementalDOM.patch(node, () => {
      for (const [funcIdx, args] of buffer)
        if (funcs[funcIdx]) incrementalDOM[funcs[funcIdx]](...args)
    })
  }

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
