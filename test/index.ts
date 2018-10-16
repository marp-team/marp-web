import animationFrame from '../src/animation-frame'
import index, { registerServiceWorker } from '../src/index'
import MarpManager from '../src/marp/manager'

jest.mock('../src/animation-frame')
jest.mock('../src/marp/marp.worker')
jest.mock('../src/marp/worker-wrapper')

afterEach(() => jest.restoreAllMocks())

describe('#index', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <textarea id="editor"># test</textarea>
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
      expect(renderSpy).toHaveBeenCalledWith('# test')
    })

    it('triggers render when text was inputted to editor', () => {
      index()

      const renderSpy = jest.spyOn(MarpManager.prototype, 'render')
      const editor = <HTMLTextAreaElement>document.getElementById('editor')

      editor.value = 'changed'
      editor.dispatchEvent(new Event('input'))

      expect(renderSpy).toHaveBeenCalledWith('changed')
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
