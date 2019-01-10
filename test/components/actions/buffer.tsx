import { h, render } from 'preact'
import { Provider } from 'unistore/preact'
import bufferActions, {
  BufferActions,
} from '../../../src/components/actions/buffer'
import { store } from '../../../src/components/app'

afterEach(() => jest.restoreAllMocks())

describe('Actions for buffer', () => {
  const actions = (baseStore = store()) => {
    const child = jest.fn()
    const ConnectedChild = bufferActions(child)

    render(
      <Provider store={baseStore}>
        <ConnectedChild />
      </Provider>,
      document.body
    )

    return child.mock.calls[0][0] as BufferActions
  }

  describe('#newCommand', () => {
    context('when bufferChanged store is false', () => {
      it('clears buffer store', () => {
        const base = store({ buffer: 'contents', bufferChanged: false })

        actions(base).newCommand()
        expect(base.getState().buffer).toBe('')
      })
    })

    context('when bufferChanged store is true', () => {
      it('opens confirm dialog and clears buffer store by agree', () => {
        const confirm = jest
          .spyOn(window, 'confirm')
          .mockImplementation(() => true)

        const base = store({ buffer: 'contents', bufferChanged: true })

        actions(base).newCommand()
        expect(confirm).toBeCalledTimes(1)
        expect(base.getState().buffer).toBe('')
      })

      it('does not clear buffer store when confirm was canceled', () => {
        const confirm = jest
          .spyOn(window, 'confirm')
          .mockImplementation(() => false)

        const base = store({ buffer: 'contents', bufferChanged: true })

        actions(base).newCommand()
        expect(confirm).toBeCalledTimes(1)
        expect(base.getState().buffer).toBe('contents')
      })
    })
  })

  describe('#updateBuffer', () => {
    it('updates buffer store to passed value', () => {
      const base = store()

      actions(base).updateBuffer('updated')
      expect(base.getState().buffer).toBe('updated')
    })

    it('updates bufferChanged store to true', () => {
      const base = store()

      actions(base).updateBuffer('test')
      expect(base.getState().bufferChanged).toBe(true)
    })
  })
})
