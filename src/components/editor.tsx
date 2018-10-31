import * as preact from 'preact'
import style from './style/editor.module.scss'
import { combineClass } from './utils'

const { Component, h } = preact

export interface EditorProps {
  onInput?: JSX.DOMAttributes['onInput']
  value?: string
  [key: string]: any
}

export interface EditorStates {
  value: string
}

export default class Editor extends Component<EditorProps, EditorStates> {
  static defaultProps = {
    value: '',
  }

  constructor(props) {
    super(props)

    this.state = { value: props.value }
    this.handleInput = this.handleInput.bind(this)
  }

  handleInput(e: any) {
    const { onInput } = this.props
    this.setState({ value: e.target.value }, () => onInput && onInput(e))
  }

  render() {
    return (
      <textarea
        {...combineClass(this.props, style.editor)}
        onInput={this.handleInput}
        value={this.state.value}
      />
    )
  }
}

export const MarpEditor = props => (
  <div class={style.marpEditorContainer}>
    <Editor {...combineClass(props, style.marpEditor)} />
  </div>
)
