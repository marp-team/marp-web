import * as preact from 'preact'
import bufferActions from './actions/buffer'
import { HeaderButton } from './button'
import {
  Dropdown,
  DropdownMenu,
  DropdownItem,
  DropdownDivider,
} from './dropdown'
import { isChrome } from './utils'
import style from './style/header.module.scss'

const { h } = preact

const app = ({ props }) => <HeaderButton class={style.appButton} {...props} />
const lazy = (func: () => void): (() => void) => () => setTimeout(func, 16)
const print = lazy(() => window.print())

export const Header = ({ newCommand, openCommand }) => (
  <header class={style.header}>
    <Dropdown button={app}>
      <DropdownMenu>
        <DropdownItem onClick={lazy(newCommand)}>New</DropdownItem>
        <DropdownDivider />
        <DropdownItem onClick={lazy(openCommand)}>Open...</DropdownItem>
        <DropdownItem>Save</DropdownItem>
        <DropdownDivider />
        <DropdownItem onClick={print}>
          Print
          {isChrome() && ' / Export to PDF'}
          ...
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </header>
)

export default bufferActions(Header)
