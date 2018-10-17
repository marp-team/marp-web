import Marp, { MarpOptions } from '@marp-team/marp-core'
import MarkdownItIncrementalDOM from 'markdown-it-incremental-dom'
import IncrementalDOMProxy, {
  IncrementalDOMProxyBuffer,
} from './incremental-dom-proxy'

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
type Overwrite<T, U> = Omit<T, Extract<keyof T, keyof U>> & U

type ExtendedMarpRenderResult = Overwrite<
  ReturnType<Marp['render']>,
  {
    html: IncrementalDOMProxyBuffer
  }
>

export type ExtendedMarp = Overwrite<
  Marp,
  {
    render(markdown: string): ExtendedMarpRenderResult
  }
>

export default function createMarp(opts: MarpOptions = {}): ExtendedMarp {
  const marp: ExtendedMarp = <any>new Marp({
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
