import { h } from 'preact'
import { deep, RenderContext, FindWrapper } from 'preact-render-spy'
import {
  Dropdown,
  DropdownItem,
  DropdownItemProps,
  DropdownMenu,
} from '../../src/components/dropdown'
import style from '../../src/components/style/dropdown.module.scss'

jest.useFakeTimers()

beforeEach(() => jest.spyOn(console, 'warn').mockImplementation())
afterEach(() => jest.restoreAllMocks())

describe('Dropdown components', () => {
  const dropdown = (props = {}, itemProps = {}) => {
    const renderDummyButton = () => <span />

    return deep(
      <Dropdown button={renderDummyButton} {...props}>
        <DropdownMenu>
          <DropdownItem {...itemProps}>test</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    )
  }

  describe('<Dropdown />', () => {
    it('renders <div> with dropdown class', () => {
      expect(dropdown().find(<div class={style.dropdown} />)).toHaveLength(1)
    })

    context('with rest props', () => {
      // React compatible className
      const component = dropdown({ className: 'test', title: 'test' })

      it('keeps passed rest props', () => {
        const div: FindWrapper<any, any> = component.find(<div title="test" />)

        expect(div).toHaveLength(1)
        expect(div.attr('class')).toContain('test')
        expect(div.attr('class')).toContain(style.dropdown)
      })
    })

    context('with button prop', () => {
      const component = (rests = {}) =>
        dropdown({
          ...rests,
          button: ({ props }) => <button id="btn-test" {...props} />,
        })

      it('renders button by passed function', () =>
        expect(component().find(<button id="btn-test" />)).toHaveLength(1))

      it('can attach mouse events passed by props', () => {
        const btn: FindWrapper<any, any> = component().find('button')

        expect(btn.attr('onClick')).toBeInstanceOf(Function)
        expect(btn.attr('onMouseDown')).toBeInstanceOf(Function)
      })

      context('when event attached button is clicked', () => {
        it('toggles dropdown and focuses to button', () => {
          const baseDropdown = component()
          const btn: any = () => baseDropdown.find(<button id="btn-test" />)
          const focus = jest.fn()

          btn().simulate('click', { target: { focus } })
          expect(baseDropdown.state('open')).toBe(true)
          expect(focus).toBeCalledTimes(1)

          btn().simulate('click', { target: { focus } })
          expect(baseDropdown.state('open')).toBe(false)
          expect(focus).toBeCalledTimes(2)
        })
      })

      context('when mouse button downs on event attached button', () => {
        it('disables onFocusOut event a moment (to normalize click behavior for cross-browser)', () => {
          const baseDropdown = component({ id: 'container' })
          baseDropdown.setState({ open: true })

          const container: any = () => baseDropdown.find(<div id="container" />)

          baseDropdown
            .find(<button id="btn-test" />)
            .simulate('mouseDown', { target: 'test' })

          container().simulate('focusOut', { relatedTarget: null })
          expect(baseDropdown.state('open')).toBe(true)

          // Works onFocusOut event immidiately (0ms)
          jest.advanceTimersByTime(0)
          container().simulate('focusOut', { relatedTarget: null })
          expect(baseDropdown.state('open')).toBe(false)
        })
      })
    })

    context('when onFocusOut is triggered by children of dropdown', () => {
      let component: RenderContext<any, any>

      beforeEach(() => (component = dropdown({ id: 'test-children' })))

      const onFocusOut = (relatedTarget: Element | null) =>
        component
          .find(<div id="test-children" />)
          .simulate('focusOut', { relatedTarget })

      it('closes dropdown with focused to <body>', () => {
        component.setState({ open: true })
        onFocusOut(document.body)

        expect(component.state('open')).toBe(false)
      })

      it('opens dropdown with focused to dropdown menu', () => {
        component.setState({ open: true })
        const container = component.component().container

        // The container of menu item
        onFocusOut(container.querySelector('ul[role="menu"]'))
        expect(component.state('open')).toBe(true)

        // Menu item
        onFocusOut(container.querySelector('li'))
        expect(component.state('open')).toBe(true)
      })

      it('closes dropdown when the focused element is null', () => {
        component.setState({ open: true })
        onFocusOut(null)

        expect(component.state('open')).toBe(false)
      })
    })

    describe('Instance methods', () => {
      const component = dropdown()
      const instance: Dropdown = component.component()

      it('opens and closes dropdown menu by #open and #close', () => {
        const findMenu = () => component.find(<ul role="menu" />)
        expect(findMenu()).toHaveLength(0)

        instance.open()
        component.rerender()
        expect(findMenu()).toHaveLength(1)

        instance.close()
        component.rerender()
        expect(findMenu()).toHaveLength(0)
      })
    })
  })

  describe('DropdownItem', () => {
    const item = (
      props: DropdownItemProps = {}
    ): {
      dropdownParent: FindWrapper<any, any>
      dropdownItem: FindWrapper<any, any>
    } => {
      const dropdownParent = dropdown({}, props)
      dropdownParent.setState({ open: true })

      return {
        dropdownParent,
        dropdownItem: dropdownParent.find(<DropdownItem>test</DropdownItem>),
      }
    }

    it('renders <button /> with passed rest props', () => {
      const { dropdownItem } = item({ title: 'button' })
      const button: FindWrapper<any, any> = dropdownItem.find('button')

      expect(button).toHaveLength(1)
      expect(button.attr('title')).toBe('button')
    })

    context('with clicked button', () => {
      it('closes dropdown menu', () => {
        const { dropdownParent, dropdownItem } = item()
        dropdownItem.find('button').simulate('click')

        expect(dropdownParent.state('open')).toBe(false)
      })

      context('when autoClose prop is false', () => {
        it('does not close dropdown menu', () => {
          const { dropdownParent, dropdownItem } = item({ autoClose: false })
          dropdownItem.find('button').simulate('click')

          expect(dropdownParent.state('open')).toBe(true)
        })
      })

      context('when onClick event is attached', () => {
        it('triggers attached event with delayed by timer', () => {
          const onClick = jest.fn()
          const { dropdownItem } = item({ onClick })

          dropdownItem.find('button').simulate('click')
          expect(onClick).toBeCalled()
        })
      })
    })
  })
})
