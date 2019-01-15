import { h, render } from 'preact'
import { Provider } from 'unistore/preact'
import bufferActions, {
  BufferActions,
} from '../../../src/components/actions/buffer'
import { store } from '../../../src/components/app'

jest.mock('unissist')
jest.useFakeTimers()

afterEach(() => {
  jest.clearAllTimers()
  jest.restoreAllMocks()
})

describe('Actions for buffer', () => {
  const actions = (baseStore = store()) => {
    const child = jest.fn()
    const ConnectedChild = bufferActions()(child)

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

        const base = store({ buffer: 'c', bufferChanged: true, fileName: 'f' })

        actions(base).newCommand()
        expect(confirm).toBeCalledTimes(1)
        expect(base.getState().buffer).toBe('')
        expect(base.getState().fileName).toBe('')
      })

      it('does not clear buffer store when confirm was canceled', () => {
        const confirm = jest
          .spyOn(window, 'confirm')
          .mockImplementation(() => false)

        const base = store({ buffer: 'c', bufferChanged: true, fileName: 'f' })

        actions(base).newCommand()
        expect(confirm).toBeCalledTimes(1)
        expect(base.getState().buffer).toBe('c')
      })
    })
  })

  describe('#openCommand', () => {
    let open: jest.SpyInstance<HTMLInputElement['click']>
    beforeEach(() => (open = jest.spyOn(HTMLInputElement.prototype, 'click')))

    it('updates buffer store to passed value', done => {
      const spy = jest.spyOn(document, 'createElement')
      const base = store({ bufferChanged: false })

      actions(base).openCommand()
      expect(spy).toBeCalledWith('input')
      expect(open).toBeCalledTimes(1)

      const input: HTMLInputElement = spy.mock.results[0].value

      jest
        .spyOn(input, 'files', 'get')
        .mockImplementation(() => [new File(['TEXT CONTENT'], 'test.md')])

      const setState = jest.spyOn(base, 'setState').mockImplementation(() => {
        expect(setState).toBeCalledWith({
          buffer: 'TEXT CONTENT',
          bufferChanged: false,
          fileName: 'test.md',
        })
        done()
      })

      input.dispatchEvent(new Event('change'))
    })

    context('when bufferChanged store is true', () => {
      it('opens confirm dialog and file dialog by agree', () => {
        const confirm = jest
          .spyOn(window, 'confirm')
          .mockImplementation(() => true)

        actions(store({ bufferChanged: true })).openCommand()
        expect(confirm).toBeCalledTimes(1)
        expect(open).toBeCalledTimes(1)
      })

      it('does not open file dialog when confirm was canceled', () => {
        const confirm = jest
          .spyOn(window, 'confirm')
          .mockImplementation(() => false)

        actions(store({ bufferChanged: true })).openCommand()
        expect(confirm).toBeCalledTimes(1)
        expect(open).not.toBeCalled()
      })
    })
  })

  describe('#saveCommand', () => {
    let click: jest.SpyInstance<any>

    beforeEach(() => {
      click = jest.spyOn(HTMLAnchorElement.prototype, 'click')
      URL.createObjectURL = jest.fn(() => 'about:blank')
      URL.revokeObjectURL = jest.fn()
    })

    it('downloads blob created from buffer with current filename', () => {
      const base = store({
        buffer: 'content',
        bufferChanged: true,
        fileName: 'file.md',
      })

      actions(base).saveCommand()

      expect(click).toBeCalledTimes(1)
      expect(URL.createObjectURL).toBeCalledTimes(1)

      const blob: Blob = (URL.createObjectURL as jest.Mock).mock.calls[0][0]
      expect(blob.size).toBe(7) // 'content'
      expect(blob.type).toBe('text/markdown')

      const link: HTMLAnchorElement = click.mock.instances[0]
      expect(link.href).toBe('about:blank')
      expect(link.download).toBe('file.md')

      // Update changed state after save
      expect(base.getState().bufferChanged).toBe(false)

      // Clean-up created URL (Requires lazy execution to support Safari)
      jest.runOnlyPendingTimers()
      expect(URL.revokeObjectURL).toBeCalledWith('about:blank')
    })

    context('when fileName store is empty', () => {
      const base = store({ fileName: '' })

      it('downloads with named as untitled.md', () => {
        actions(base).saveCommand()

        expect(click.mock.instances[0].download).toBe('untitled.md')
        expect(base.getState().fileName).toBe('untitled.md')
      })
    })
  })

  describe('#updateBuffer', () => {
    it('updates buffer store and bufferChanged store', () => {
      const base = store()
      actions(base).updateBuffer('updated')

      expect(base.getState().buffer).toBe('updated')
      expect(base.getState().bufferChanged).toBe(true)
    })
  })
})
