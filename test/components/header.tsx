import { h } from 'preact'
import { deep } from 'preact-render-spy'
import { HeaderButton } from '../../src/components/button'
import Header from '../../src/components/header'

describe('<Header />', () => {
  const header = (props = {}) => deep(<Header {...props} />)

  it('renders <header> element', () =>
    expect(header().find('header')).toHaveLength(1))

  describe('App button', () => {
    const appBtn = (component = header()) =>
      component.find(<HeaderButton class="appButton" />)

    it('renders a header button with appButton class', () =>
      expect(appBtn()).toHaveLength(1))

    context('when clicked', () => {
      it('toggles main menu and focuses to the clicked button', () => {
        const component = header()
        const findMenu = () => component.find(<ul role="menu" />)
        const target = { focus: jest.fn() }

        expect(findMenu()).toHaveLength(0)

        // Open
        appBtn(component).simulate('click', { target })
        expect(findMenu()).toHaveLength(1)
        expect(target.focus).toBeCalledTimes(1)

        // Close
        appBtn(component).simulate('click', { target })
        expect(findMenu()).toHaveLength(0)
        expect(target.focus).toBeCalledTimes(2)
      })
    })
  })
})
