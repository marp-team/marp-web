import Marp from '@marp-team/marp-core'
import IncrementalDOM from 'incremental-dom'
import markdownItIncrementalDOM from 'markdown-it-incremental-dom'

export const ready = Marp.ready

export default function() {
  const marp = new Marp({
    container: { tag: 'div', class: 'marp__core' },
  })

  // markdown-it-incremental-dom
  marp.markdown.use(markdownItIncrementalDOM, IncrementalDOM, {
    incrementalizeDefaultRules: false,
  })
  ;(<any>marp).renderMarkdown = (md: string) =>
    marp.markdown.renderToIncrementalDOM(md)

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
