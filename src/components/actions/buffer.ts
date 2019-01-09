import { connect } from 'unistore/preact'
import { GlobalStore } from '../app'

interface Actions {
  newCommand: () => void
  updateBuffer: (buffer: string) => void
}

export default connect<
  Partial<Pick<GlobalStore, 'buffer' | 'bufferChanged'>>,
  any,
  Partial<GlobalStore>,
  Actions
>(
  'buffer,bufferChanged',
  () => ({
    newCommand: ({ bufferChanged }) => {
      if (bufferChanged) {
        if (!window.confirm('Are you sure? Your changed buffer will be lost.'))
          return {}
      }
      return { buffer: '', bufferChanged: false }
    },
    updateBuffer: (_, buffer: string) => ({ buffer, bufferChanged: true }),
  })
)
