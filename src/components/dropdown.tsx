import * as preact from 'preact'
import style from './dropdown.module.scss'
import { combineClass } from './utils'

const { Component, h } = preact

export interface DropdownProps {
  children: any[]
}

export interface DropdownStates {
  open: boolean
}

export class Dropdown extends Component<DropdownProps, DropdownStates> {
  private readonly contents: any[]
  private readonly menu: any

  constructor(props: DropdownProps) {
    super(props)

    this.state = { open: false }
    this.contents = [...props.children]

    // Extract DropdownMenu from children
    const menuIdx = this.contents.findIndex(
      elm => typeof elm === 'object' && elm.nodeName === DropdownMenu
    )
    this.menu = menuIdx === -1 ? undefined : this.contents.splice(menuIdx, 1)[0]
  }

  getChildContext() {
    return { dropdown: this }
  }

  close() {
    this.setState({ open: false })
  }

  open() {
    this.setState({ open: true })
  }

  toggle() {
    this.setState({ open: !this.state.open })
  }

  render(_, state: DropdownStates) {
    const { open } = state

    return (
      <span class={style.dropdown}>
        <span class={style.dropdownHit} onClick={() => this.toggle()}>
          {this.contents}
        </span>
        {open && this.menu}
      </span>
    )
  }
}

export class DropdownMenu extends Component<{}, {}> {
  render(props) {
    return <ul role="menu" {...props} class={combineClass(props, style.menu)} />
  }
}

export function DropdownItem(this: any, props) {
  const { onClick } = props

  return (
    <li role="menuitem" class={style.item}>
      <button
        {...props}
        class={combineClass(props, style.itemButton)}
        onClick={(...args) => {
          this.context.dropdown.close()

          if (typeof onClick === 'function') {
            const callback = () => onClick(...args)

            if ((window as any).requestIdleCallback) {
              ;(window as any).requestIdleCallback(callback)
            } else {
              setTimeout(callback, 0)
            }
          }
        }}
      />
    </li>
  )
}

export const DropdownDivider = () => (
  <li role="separator" class={style.divider} />
)
