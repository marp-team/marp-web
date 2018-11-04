import index, { registerServiceWorker } from '../src/index'

jest.mock('../src/marp/marp.worker')
jest.mock('../src/marp/worker-wrapper')

afterEach(() => jest.restoreAllMocks())

describe('#index', () => {
  beforeEach(() => (document.body.innerHTML = '<main id="marp"></main>'))

  it('renders <App /> Preact component to #marp', () => {
    const marp = document.getElementById('marp')!
    expect(marp.innerHTML).toBeFalsy()

    index()
    expect(marp.innerHTML).toBeTruthy()
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
