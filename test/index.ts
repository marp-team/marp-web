import animationFrame from '../src/animation-frame'
import index, { registerServiceWorker } from '../src/index'
import MarpManager from '../src/marp/manager'
import createMarp from '../src/marp/marp'

jest.mock('../src/animation-frame')
jest.mock('../src/marp/marp.worker')
jest.mock('../src/marp/worker-wrapper')

afterEach(() => jest.restoreAllMocks())

describe('#index', () => {
  const markdown = '# test'

  beforeEach(() => {
    document.body.innerHTML = `
      <textarea id="editor">${markdown}</textarea>
      <style id="preview-css"></style>
      <div id="preview"></div>
    `
  })

  it('starts animation frame loops', () => {
    index()
    expect(animationFrame.start).toHaveBeenCalled()
  })

  describe('Rendering live preview', () => {
    it('triggers initial render by MarpManager#render', () => {
      const renderSpy = jest.spyOn(MarpManager.prototype, 'render')

      index()
      expect(renderSpy).toHaveBeenCalledWith(markdown)

      // Push DOM update func to animation frame when triggered onRendered event
      const manager: any = renderSpy.mock.instances[0]
      const rendered = createMarp().render(markdown)
      const { css } = rendered

      manager.onRendered(rendered)
      expect(animationFrame.push).toHaveBeenCalled()

      const [updateFunc] = (<jest.Mock>animationFrame.push).mock.calls[0]
      updateFunc()
      expect(document.getElementById('preview-css')!.textContent).toBe(css)
      expect(document.querySelector('#preview > .marp__core h1')).toBeTruthy()
    })

    it('triggers render when text was inputted to editor', () => {
      index()

      const renderSpy = jest.spyOn(MarpManager.prototype, 'render')
      const editor = <HTMLTextAreaElement>document.getElementById('editor')

      editor.value = 'changed'
      editor.dispatchEvent(new Event('input'))

      expect(renderSpy).toHaveBeenCalledWith('changed')

      // Run DOM update func in next idle callback when supported
      const reqIdle = jest.fn()
      ;(<any>window).requestIdleCallback = reqIdle

      const manager: any = renderSpy.mock.instances[0]
      manager.onRendered(createMarp().render(editor.value))
      expect(reqIdle).toBeCalledWith(expect.any(Function))

      const pushMock: jest.Mock = <any>animationFrame.push
      pushMock.mockClear()

      reqIdle.mock.calls[0][0]()
      pushMock.mock.calls[0][0]()
      expect(document.querySelector('#preview')!.textContent).toBe('changed')
    })
  })
})

describe('#registerServiceWorker', () => {
  const browserNavigator: any = navigator

  afterEach(() => {
    delete browserNavigator.serviceWorker
  })

  context('when browser is not supported service worker', () => {
    it('does not register service worker', () => {
      delete browserNavigator.serviceWorker

      const eventListenerSpy = jest.spyOn(window, 'addEventListener')
      registerServiceWorker()

      window.dispatchEvent(new Event('load'))
      expect(eventListenerSpy).not.toHaveBeenCalled()
    })
  })

  context('when browser is supported service worker', () => {
    it('registers service worker', () => {
      browserNavigator.serviceWorker = { register: jest.fn() }
      registerServiceWorker()

      window.dispatchEvent(new Event('load'))
      expect(browserNavigator.serviceWorker.register).toHaveBeenCalledWith(
        '/service-worker.js'
      )
    })
  })
})
