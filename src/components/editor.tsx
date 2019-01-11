import * as preact from 'preact'
import style from './style/editor.module.scss'
import { combineClass } from './utils'

const { h } = preact

export interface EditorProps {
  value: string
  onInput?: JSX.EventHandler<Event>
  [key: string]: any
}

const Editor: preact.FunctionalComponent<EditorProps> = props => (
  <textarea
    {...combineClass(props, style.editor)}
    aria-label="Editor"
    onInput={props.onInput}
  >
    {props.value}
  </textarea>
)

export const MarpEditor: preact.FunctionalComponent<EditorProps> = props => (
  <div class={style.marpEditorContainer}>
    <Editor {...combineClass(props, style.marpEditor)} />
  </div>
)

export default Editor
