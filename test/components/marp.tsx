import { h } from 'preact'
import { deep } from 'preact-render-spy'
import AnimationFrame from '../../src/animation-frame'
import { MarpCore } from '../../src/components/marp'
import { MarpManager } from '../../src/marp/manager'
import Marp from '../../src/marp/marp'

jest.mock('../../src/animation-frame')
jest.mock('../../src/marp/marp.worker')
jest.mock('../../src/marp/worker-wrapper')

beforeEach(() =>
  (AnimationFrame.push as jest.Mock).mockImplementation(fn => fn())
)

afterEach(() => jest.restoreAllMocks())

describe('<MarpCore />', () => {
  const core = (props = {}) => deep(<MarpCore markdown="" {...props} />)

  context('when markdown is rendered in worker', () => {
    it('renders HTML and style to container', () => {
      const instance = core().component()
      const marp: MarpManager = instance.marp
      const container: HTMLElement = instance.container

      const rendered = Marp().render('# Hello')
      marp.onRendered!(rendered)

      expect(container.querySelector('h1')!.textContent).toBe('Hello')
      expect(container.querySelector('style')!.textContent).toBe(rendered.css)
    })
  })
})
