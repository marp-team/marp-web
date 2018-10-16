import MarpBrowser from '@marp-team/marp-core/lib/browser.cjs'
import { AnimationFrame } from '../src/animation-frame'

jest.mock('@marp-team/marp-core/lib/browser.cjs')

let mockRAF: jest.SpyInstance
let mockCAF: jest.SpyInstance

beforeEach(() => {
  mockRAF = jest
    .spyOn(window, 'requestAnimationFrame')
    .mockImplementation(() => 123456)

  mockCAF = jest.spyOn(window, 'cancelAnimationFrame').mockImplementation()
})

afterEach(() => jest.restoreAllMocks())

describe('AnimationFrame', () => {
  describe('get #dispatched', () => {
    it('returns dispatch state', () => {
      const instance = new AnimationFrame()
      expect(instance.dispatched).toBe(false)

      instance.start()
      expect(instance.dispatched).toBe(true)

      instance.stop()
      expect(instance.dispatched).toBe(false)
    })
  })

  describe('#start', () => {
    it('calls window.requestAnimationFrame to execute loop', () => {
      const instance = new AnimationFrame()

      instance.start()
      expect(mockRAF).toBeCalledWith(expect.any(Function))

      const [func] = mockRAF.mock.calls[0]
      const loopSpy = jest.spyOn(<any>instance, 'loop').mockImplementation()

      func()
      expect(loopSpy).toBeCalled()
    })

    it('does not call window.requestAnimationFrame when already dispatched', () => {
      const instance = new AnimationFrame()

      instance.start()
      expect(instance.dispatched).toBe(true)
      mockRAF.mockClear()

      instance.start()
      expect(mockRAF).not.toBeCalled()
    })
  })

  describe('#stop', () => {
    it('cancels queued loop for next frame', () => {
      const instance = new AnimationFrame()

      instance.stop()
      expect(mockCAF).not.toBeCalled()

      instance.start()
      instance.stop()
      expect(mockCAF).toBeCalledWith(123456)
    })
  })

  describe('#loop (private)', () => {
    it('runs queued functions', () => {
      const instance = new AnimationFrame()
      const { loop } = <any>instance
      const funcB = jest.fn()
      const funcA = jest.fn(() => instance.push(funcB))

      instance.push(funcA)
      loop.call(instance)
      expect(funcA).toBeCalledTimes(1)
      expect(funcB).toBeCalledTimes(0)

      // Confirm to reset event queue before calling queued functions
      loop.call(instance)
      expect(funcA).toBeCalledTimes(1)
      expect(funcB).toBeCalledTimes(1)
    })

    it('runs Marp browser observer after event queue', () => {
      const instance = new AnimationFrame()
      const { loop } = <any>instance
      const order: any[] = []
      const func = jest.fn(() => order.push(func))

      instance.push(func)
      MarpBrowser.mockImplementationOnce(() => order.push(MarpBrowser))
      loop.call(instance)

      expect(MarpBrowser).toBeCalledWith(false)
      expect(order).toStrictEqual([func, MarpBrowser])
    })

    it('requests loop again when dispatched', () => {
      const instance = new AnimationFrame()
      const { loop } = <any>instance

      instance.start()
      mockRAF.mockClear()

      loop.call(instance)
      expect(mockRAF).toBeCalledWith(expect.any(Function))

      const [func] = mockRAF.mock.calls[0]
      const loopSpy = jest.spyOn(<any>instance, 'loop').mockImplementation()

      func()
      expect(loopSpy).toBeCalled()
    })
  })
})
