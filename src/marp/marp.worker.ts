import Marp, { MarpOptions } from '@marp-team/marp-core'
import MarkdownItIncrementalDOM from 'markdown-it-incremental-dom'
import IncrementalDOMProxy from './incremental-dom-proxy'

const ctx: Worker = <any>self

export class MarpWorker {
  readonly instances: Map<string, Marp> = new Map()

  registerWorker() {
    addEventListener('message', e => {
      const func = this[`__worker__${e.data[0]}`]
      if (typeof func === 'function') func.apply(this, e.data.slice(1))
    })
  }

  private createMarp(opts: MarpOptions): Marp {
    const marp = new Marp({
      ...opts,
      container: { tag: 'div', class: 'marp__core' },
    })
    const proxy = new IncrementalDOMProxy()

    // Incremental DOM
    marp.markdown.use(MarkdownItIncrementalDOM, proxy, {
      incrementalizeDefaultRules: false,
    })
    ;(<any>marp).renderMarkdown = md =>
      proxy.use(() => {
        marp.markdown.renderToIncrementalDOM(md)()
      })

    // Override renderer
    const { renderer } = marp.markdown
    const { image } = renderer.rules
    const linkOpen =
      renderer.rules.link_open ||
      ((tokens, i, opts, _, self) => self.renderToken(tokens, i, opts))

    const updateAttr = (token, attr, value) => {
      const attrIdx = token.attrIndex(attr)

      if (attrIdx < 0) token.attrPush([attr, value])
      else token.attrs[attrIdx][1] = value
    }

    renderer.rules.image = (tokens, idx, ...args) => {
      updateAttr(tokens[idx], 'referrerpolicy', 'no-referrer')
      return image(tokens, idx, ...args)
    }

    renderer.rules.link_open = (tokens, idx, ...args) => {
      updateAttr(tokens[idx], 'target', '_blank')
      updateAttr(tokens[idx], 'rel', 'noopener noreferrer')
      updateAttr(tokens[idx], 'referrerpolicy', 'no-referrer')

      return linkOpen(tokens, idx, ...args)
    }

    return marp
  }

  private get(id: string) {
    const marp = this.instances.get(id)

    if (!marp)
      throw new Error(`Marp instance ${id} is not available in worker.`)

    return marp
  }

  // Worker command
  // tslint:disable:function-name
  private __worker__register(id: string, opts: MarpOptions) {
    this.instances.set(id, this.createMarp(opts))
  }

  private __worker__render(id: string, markdown: string) {
    const marp = this.get(id)
    ctx.postMessage(['rendered', id, marp.render(markdown)])
  }
}

new MarpWorker().registerWorker()
