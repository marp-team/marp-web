import { h } from 'preact'
import { deep, FindWrapper } from 'preact-render-spy'
import { MarpEditor } from '../../src/components/editor'
import { MarpPreview } from '../../src/components/marp'
import { Preview } from '../../src/components/preview'

jest.mock('../../src/marp/marp.worker')
jest.mock('../../src/marp/worker-wrapper')

afterEach(() => jest.restoreAllMocks())

describe('<Preview />', () => {
  const preview = (props: any = {}) => deep(<Preview buffer="" {...props} />)

  it('renders <MarpEditor>', () =>
    expect(preview().find(<MarpEditor value="" />)).toHaveLength(1))

  it('renders <MarpPreview>', () =>
    expect(preview().find(<MarpPreview />)).toHaveLength(1))

  context('with buffer prop', () => {
    it('renders <MarpEditor> with passed buffer', () =>
      expect(
        preview({ buffer: 'Hello!' }).find(<MarpEditor value="Hello!" />)
      ).toHaveLength(1))
  })

  context('when text has inputed to textarea', () => {
    const textarea = (cmp: FindWrapper<any, any>): FindWrapper<any, any> =>
      cmp.find(<MarpEditor value="" />).find('textarea')

    it('calls updateBuffer action', () => {
      const updateBuffer = jest.fn()
      const component = preview({ updateBuffer })
      const event = { target: { value: 'updated' } }

      textarea(component).simulate('input', event)
      expect(updateBuffer).toBeCalledWith('updated')
    })
  })
})
