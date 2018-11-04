import { h } from 'preact'
import { deep, FindWrapper } from 'preact-render-spy'
import { MarpEditor } from '../../src/components/editor'
import { MarpPreview } from '../../src/components/marp'
import Preview, { PreviewProps } from '../../src/components/preview'
import { MarpManager } from '../../src/marp/manager'

jest.mock('../../src/marp/marp.worker')
jest.mock('../../src/marp/worker-wrapper')

afterEach(() => jest.restoreAllMocks())

describe('<Preview />', () => {
  const preview = (props: PreviewProps = {}) => deep(<Preview {...props} />)

  it('renders <MarpEditor>', () =>
    expect(preview().find(<MarpEditor />)).toHaveLength(1))

  it('renders <MarpPreview>', () =>
    expect(preview().find(<MarpPreview />)).toHaveLength(1))

  context('with value prop', () => {
    it('renders <MarpEditor> with passed value', () =>
      expect(
        preview({ value: 'Hello!' }).find(<MarpEditor value="Hello!" />)
      ).toHaveLength(1))
  })

  context('when text has inputed to textarea', () => {
    const component = () => preview({ value: '' })

    const textarea = (
      previewComponent: FindWrapper<any, any> = component()
    ): FindWrapper<any, any> =>
      previewComponent.find(<MarpEditor />).find('textarea')

    it('updates value state', () => {
      const previewCmp = component()
      textarea(previewCmp).simulate('input', { target: { value: 'updated' } })

      expect(previewCmp.state('value')).toBe('updated')
      expect(textarea(previewCmp).attr('value')).toBe('updated')
    })

    it('renders updated value through MarpManager', () => {
      const renderSpy = jest.spyOn(MarpManager.prototype, 'render')
      const previewCmp = component()

      textarea(previewCmp).simulate('input', { target: { value: 'updated' } })
      previewCmp.rerender()

      expect(renderSpy).toBeCalledWith('updated')
    })
  })
})
