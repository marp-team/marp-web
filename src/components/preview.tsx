import * as preact from 'preact'
import { connect } from 'unistore/preact'
import style from './style/preview.module.scss'
import { MarpEditor } from './editor'
import { MarpPreview } from './marp'

const { h } = preact

export const Preview: preact.FunctionalComponent<{
  buffer: string
  handleInput: JSX.EventHandler<Event>
}> = ({ buffer, handleInput }) => (
  <div class={style.preview}>
    <MarpEditor value={buffer} onInput={handleInput} />
    <MarpPreview class={style.previewPane} markdown={buffer} />
  </div>
)

export default connect<any, {}, any, any>(
  'buffer',
  () => ({
    handleInput: (_, e) => ({ buffer: e.target.value, bufferChanged: true }),
  })
)(Preview)
