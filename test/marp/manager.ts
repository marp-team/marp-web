import MarpManager from '../../src/marp/manager'

jest.mock('../../src/marp/marp.worker')
jest.mock('../../src/marp/worker-wrapper')

beforeEach(() => jest.clearAllMocks())
afterEach(() => jest.restoreAllMocks())

describe('MarpManager', () => {
  const worker = (): jest.Mocked<Worker> => (<any>MarpManager).worker
  const { onMessage } = <any>MarpManager
  const post = (...data) => onMessage({ data })

  describe('constructor', () => {
    it('registers instance to initialized Marp Worker', () => {
      ;(<any>MarpManager).worker = undefined

      const manager = new MarpManager({ html: true })

      expect(worker()).not.toBeUndefined()
      expect(worker().addEventListener).toBeCalledWith('message', onMessage)
      expect(worker().postMessage).toBeCalledWith([
        'register',
        manager.id,
        { html: true },
      ])

      // Prevent double-listening on initialized another manager
      new MarpManager()
      expect(worker().addEventListener).toBeCalledTimes(1)
      expect(worker().postMessage).toBeCalledTimes(2)
    })
  })

  describe('#render', () => {
    it('posts render command with instance id and content', () => {
      const manager = new MarpManager()
      manager.render('md')

      expect(worker().postMessage).toBeCalledWith(['render', manager.id, 'md'])
      const lastPostCalls = worker().postMessage.mock.calls.length

      // For performance, the render request will queue while a latest markdown
      // is rendering.
      manager.render('queue')
      manager.render('Only render last')
      expect(worker().postMessage).toBeCalledTimes(lastPostCalls)

      // Trigger only the lastest queue after rendering
      worker().postMessage.mockClear()
      post('rendered', manager.id)

      expect(worker().postMessage).toBeCalledWith([
        'render',
        manager.id,
        'Only render last',
      ])
    })
  })

  describe('.onMessage (private)', () => {
    let manager: MarpManager

    beforeEach(() => {
      manager = new MarpManager()
      manager.onRendered = jest.fn()
    })

    it('recieves command with instance id and execute command', () => {
      post('rendered', manager.id, { html: 'html', css: 'css' })
      expect(manager.onRendered).toBeCalledWith({ html: 'html', css: 'css' })
    })

    it('ignores when passed invalid command', () => {
      post('__worker__rendered', manager.id) // exact function name
      expect(manager.onRendered).not.toBeCalled()
    })
  })
})
