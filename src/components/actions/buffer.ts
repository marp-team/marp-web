import { connect } from 'unistore/preact'
import { GlobalStore } from '../app'

interface Actions {
  clearBuffer: () => void
  updateBuffer: (buffer: string) => void
}

export default connect<
  Pick<GlobalStore, 'buffer' | 'bufferChanged'>,
  any,
  GlobalStore,
  Actions
>(
  'buffer,bufferChanged',
  () => ({
    clearBuffer: () => ({ buffer: '', bufferChanged: false }),
    updateBuffer: (_, buffer: string) => ({ buffer, bufferChanged: true }),
  })
)
