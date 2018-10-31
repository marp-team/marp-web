import * as preact from 'preact'
import style from './style/preview.module.scss'
import { MarpEditor } from './editor'
import { MarpPreview } from './marp'

const { Component, h } = preact

export interface PreviewProps {
  value?: string
}

export interface PreviewStates {
  value: string
}

export default class Preview extends Component<PreviewProps, PreviewStates> {
  static defaultProps = {
    value: '',
  }

  constructor(props) {
    super(props)

    this.state = { value: props.value }
    this.handleInput = this.handleInput.bind(this)
  }

  handleInput(e: any) {
    this.setState({ value: e.target.value })
  }

  render() {
    return (
      <div class={style.preview}>
        <MarpEditor value={this.state.value} onInput={this.handleInput} />
        <MarpPreview markdown={this.state.value} />
      </div>
    )
  }
}
