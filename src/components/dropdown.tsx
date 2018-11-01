import * as preact from 'preact'
import { createContext, Context } from 'preact-context'
import style from './style/dropdown.module.scss'
import { combineClass } from './utils'

const { Component, h } = preact

const dropdownContext: Context<any> = createContext(undefined)
const { Consumer, Provider } = dropdownContext

export interface DropdownButtonContext {
  dropdown: Dropdown
  props: {
    onClick: JSX.EventHandler<MouseEvent>
    onMouseDown: JSX.EventHandler<MouseEvent>
  }
}

export interface DropdownProps {
  button: (context: DropdownButtonContext) => JSX.Element
  children: JSX.Element
  open?: boolean
  [key: string]: any
}

export interface DropdownStates {
  open: boolean
}

export class Dropdown extends Component<DropdownProps, DropdownStates> {
  private container?: HTMLDivElement
  private mouseDownButton?: Element

  constructor(props) {
    super(props)
    this.state = { open: !!props.open }
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

  private assignContainer = element => (this.container = element)

  private handleButtonClick = e => {
    this.toggle()

    // Keep focus to button after clicking in macOS Firefox and Safari
    // See: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#Clicking_and_focus
    e.target.focus()
  }

  private handleButtonMouseDown = e => {
    this.mouseDownButton = e.target
    setTimeout(() => (this.mouseDownButton = undefined), 0)
  }

  private handleFocusOut = e => {
    if (!this.mouseDownButton)
      this.setState({
        open: this.container ? this.container.contains(e.relatedTarget) : false,
      })
  }

  render() {
    return (
      <div
        {...combineClass(this.props, style.dropdown)}
        ref={this.assignContainer}
        onFocusOut={this.handleFocusOut}
      >
        {this.props.button({
          dropdown: this,
          props: {
            onClick: this.handleButtonClick,
            onMouseDown: this.handleButtonMouseDown,
          },
        })}
        {this.state.open && (
          <Consumer>
            {parent => (
              <Provider value={parent || this}>{this.props.children}</Provider>
            )}
          </Consumer>
        )}
      </div>
    )
  }
}

export const DropdownMenu = (props: { children: any; [key: string]: any }) => (
  <ul role="menu" tabIndex={-1} {...combineClass(props, style.menu)} />
)

export function DropdownItem(
  this,
  props: { autoClose?: boolean; children: any; onClick?: (...args: any) => any }
) {
  const { autoClose, onClick } = props

  const renderButton = (dropdown: Dropdown | undefined) => {
    const handleClick = (...args) => {
      if (dropdown && (autoClose || autoClose === undefined)) dropdown.close()
      if (typeof onClick === 'function') setTimeout(() => onClick(...args), 16)
    }

    return (
      <button
        {...combineClass(props, style.itemButton)}
        onClick={handleClick}
      />
    )
  }

  return (
    <li role="menuitem" class={style.item}>
      <Consumer>{renderButton}</Consumer>
    </li>
  )
}

export const DropdownDivider = () => (
  <li role="separator" class={style.divider} />
)
