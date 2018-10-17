import createMarp from '../../src/marp/marp'
import { MarpWorker } from '../../src/marp/marp.worker'
import WorkerWrapper from '../../src/marp/worker-wrapper'

const mockMarp = { render: jest.fn() }

jest.mock('../../src/marp/marp', () => jest.fn(() => mockMarp))
jest.mock('../../src/marp/marp.worker')
jest.mock('../../src/marp/worker-wrapper')

beforeEach(() => jest.clearAllMocks())
afterEach(() => jest.restoreAllMocks())

describe('Marp worker', () => {
  const worker = <jest.Mocked<Worker>>WorkerWrapper()

  describe('#registerWorker', () => {
    it("registers listener to worker's onMessage event", () => {
      const instance: any = new MarpWorker()
      instance.registerWorker()

      expect(WorkerWrapper).toBeCalled()
      expect(worker.addEventListener).toBeCalledWith(
        'message',
        expect.any(Function)
      )

      // Callback function is triggered instance's #onMessage (private)
      const [, func] = worker.addEventListener.mock.calls[0]
      const messageSpy = jest.spyOn(instance, 'onMessage').mockImplementation()

      func({ data: ['abc'] })
      expect(messageSpy).toBeCalledWith({ data: ['abc'] })
    })
  })

  describe('#onMessage (private)', () => {
    const post = (instance, ...args) => instance.onMessage({ data: args })

    context('with "register" command', () => {
      it('creates and stores Marp instance to map of instances', () => {
        const mw = new MarpWorker()
        post(mw, 'register', 'test-id', { html: true })

        expect(createMarp).toBeCalledWith({ html: true })
        expect(mw.instances.get('test-id')).toBe(mockMarp)
      })
    })

    context('with "render" command', () => {
      it('renders markdown and posts rendered result', () => {
        const mw = new MarpWorker()
        post(mw, 'register', 'test', {})

        const marp = mw.instances.get('test')
        const marpRender = jest
          .spyOn(marp!, 'render')
          .mockImplementation(() => 'ret')

        post(mw, 'render', 'test', '# Markdown')
        expect(marpRender).toBeCalledWith('# Markdown')
        expect(worker.postMessage).toBeCalledWith(['rendered', 'test', 'ret'])
      })

      context('when passed id is not registered', () => {
        it('throws error', () => {
          const mw = new MarpWorker()
          post(mw, 'register', 'test', {})

          expect(() =>
            post(mw, 'render', 'not-registered', '# Markdown')
          ).toThrowError()
        })
      })
    })

    context('with undefined command', () => {
      it('ignores passed command', () => {
        const mw: any = new MarpWorker()
        const method = jest.spyOn(mw, '__worker__register')

        post(mw, '__worker__register', 'test', {})
        expect(method).not.toBeCalled()
      })
    })
  })
})
