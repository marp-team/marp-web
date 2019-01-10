import { connect } from 'unistore/preact'
import { GlobalStore } from '../app'
import { ConnectedActions } from './utils'

export interface BufferActions {
  newCommand: () => void
  updateBuffer: (buffer: string) => void
}

const actions: ConnectedActions<GlobalStore, BufferActions> = () => ({
  newCommand: ({ bufferChanged }) => {
    if (
      !bufferChanged ||
      window.confirm('Are you sure? Your changed buffer will be lost.')
    )
      return { buffer: '', bufferChanged: false }
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
