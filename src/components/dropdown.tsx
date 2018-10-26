import * as preact from 'preact'
import style from './dropdown.module.scss'
import { combineClass } from './utils'

const { Component, h } = preact

export class Dropdown extends Component<any, { open: boolean }> {
  private container?: HTMLDivElement
  private mouseDownButton?: Element

  constructor(props) {
    super(props)
    this.state = { open: false }
  }

  getChildContext() {
    return { dropdown: this, dropdownOpen: this.state.open }
  }

  close() {
    this.setState({ open: false })
  }

  open() {
    this.setState({ open: true })
  }

  toggle(from = this.state.open) {
    this.setState({ open: !from })
  }

  handleButtonClick(e) {
    this.toggle()

    // Keep focus to button after clicking in macOS Firefox and Safari
    // See: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#Clicking_and_focus
    e.target.focus()
  }

  handleButtonMouseDown(e) {
    this.mouseDownButton = e.target
    setTimeout(() => (this.mouseDownButton = undefined), 0)
  }

  private handleFocusOut(e) {
    if (!this.mouseDownButton)
      this.setState({
        open: this.container ? this.container.contains(e.relatedTarget) : false,
      })
  }

  render(props) {
    return (
      <div
        {...props}
        class={style.dropdown}
        ref={div => (this.container = div)}
        onFocusOut={e => this.handleFocusOut(e)}
      />
    )
  }
}

export function DropdownMenu(this, props: { children: any }) {
  return (
    this.context.dropdownOpen && (
      <ul
        role="menu"
        tabIndex={-1}
        {...props}
        class={combineClass(props, style.menu)}
      />
    )
  )
}

export function DropdownItem(
  this,
  props: { children: any; onClick?: () => any }
) {
  const { onClick } = props
  const handleClick = () => {
    this.context.dropdown.close()

    if (typeof onClick === 'function') {
      if ((window as any).requestIdleCallback) {
        ;(window as any).requestIdleCallback(() => onClick())
      } else {
        setTimeout(() => onClick(), 0)
      }
    }
  }

  return (
    <li role="menuitem" class={style.item}>
      <button
        {...props}
        class={combineClass(props, style.itemButton)}
        onClick={handleClick}
      />
    </li>
  )
}

export const DropdownDivider = () => (
  <li role="separator" class={style.divider} />
)
