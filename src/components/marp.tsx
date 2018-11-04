import * as IncrementalDOM from 'incremental-dom'
import * as preact from 'preact'
import style from './style/marp.module.scss'
import { combineClass } from './utils'
import animationFrame from '../animation-frame'
import { convert } from '../marp/incremental-dom-proxy'
import MarpManager from '../marp/manager'

const { Component, h } = preact

type onRenderedCallback = NonNullable<MarpManager['onRendered']>

export class MarpCore extends Component<
  { markdown: string; [key: string]: any },
  {}
> {
  private container?: HTMLElement

  private readonly id: string
  private readonly marp: MarpManager

  constructor(props) {
    super(props)

    this.id = `marp-core-${Math.random()
      .toString(36)
      .slice(-8)}`

    this.marp = new MarpManager({
      container: { tag: 'div', id: this.id, class: style.coreContainer },
      slideContainer: { tag: 'div', class: style.coreSlideContainer },
    })
    this.marp.onRendered = (...args) => this.handleRendered(...args)
  }

  shouldComponentUpdate() {
    return false
  }

  componentWillReceiveProps({ markdown }) {
    if (this.props.markdown !== markdown) this.marp.render(markdown)
  }

  componentDidMount() {
    animationFrame.start()
    this.marp.render(this.props.markdown)
  }

  render() {
    return (
      <div
        {...combineClass(this.props, style.core)}
        markdown={undefined}
        ref={elm => (this.container = elm)}
      />
    )
  }

  private handleRendered: onRenderedCallback = rendered => {
    const { requestIdleCallback } = window as any
    const renderDOM = () => this.renderDOM(rendered)

    requestIdleCallback ? requestIdleCallback(renderDOM) : renderDOM()
  }

  private renderDOM: onRenderedCallback = ({ css, html }) => {
    animationFrame.push(() => {
      if (this.container)
        IncrementalDOM.patch(this.container, () => {
          IncrementalDOM.elementOpen('style')
          IncrementalDOM.text(css)
          IncrementalDOM.elementClose('style')

          convert(IncrementalDOM, html)()
        })
    })
  }
}

export const MarpPreview = props => (
  <MarpCore {...combineClass(props, style.preview)} />
)
