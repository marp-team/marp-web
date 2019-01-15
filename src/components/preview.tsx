import * as preact from 'preact'
import connectBufferActions, { ConnectableChild } from './actions/buffer'
import style from './style/preview.module.scss'
import { MarpEditor } from './editor'
import { MarpPreview } from './marp'

const { h } = preact

export const Preview: ConnectableChild<'buffer'> = ({
  buffer,
  updateBuffer,
}) => {
  const handleInput = e => updateBuffer(e.target.value)

  return (
    <div class={style.preview}>
      <MarpEditor value={buffer} onInput={handleInput} />
      <MarpPreview class={style.previewPane} markdown={buffer} />
    </div>
  )
}

export default connectBufferActions('buffer')(Preview)
