import { connect } from 'unistore/preact'
import { GlobalStore } from '../app'
import { ConnectedActions } from './utils'

export interface BufferActions {
  newCommand: () => void
  openCommand: () => void
  updateBuffer: (buffer: string) => void
}

const confirmBuffer = (bufferChanged?: boolean) =>
  bufferChanged
    ? window.confirm('Are you sure? Your changed buffer will be lost.')
    : true

const actions: ConnectedActions<GlobalStore, BufferActions> = store => ({
  newCommand: ({ bufferChanged }) => {
    if (!confirmBuffer(bufferChanged)) return
    return { buffer: '', bufferChanged: false }
  },
  openCommand: ({ bufferChanged }) => {
    if (!confirmBuffer(bufferChanged)) return

    const input = document.createElement('input')
    input.setAttribute('type', 'file')
    input.setAttribute(
      'accept',
      '.md,.mdown,.markdown,.markdn,text/markdown,text/x-markdown,text/plain'
    )
    input.addEventListener('change', () => {
      const file = input.files![0]
      const reader = new FileReader()

      reader.onload = () =>
        store.setState({
          buffer: <string>reader.result,
          bufferChanged: false,
        })

      reader.readAsText(file)
    })
    input.click()
  },
  updateBuffer: (_, buffer) => ({ buffer, bufferChanged: true }),
})

export default connect<
  Partial<Pick<GlobalStore, 'buffer'>>,
  any,
  GlobalStore,
  BufferActions
>(
  'buffer',
  actions
)
