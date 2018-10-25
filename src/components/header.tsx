import * as preact from 'preact'
import { HeaderButton } from './button'
import {
  Dropdown,
  DropdownMenu,
  DropdownItem,
  DropdownDivider,
} from './dropdown'
import style from './header.module.scss'

const { h } = preact

export default () => (
  <header class={style.header}>
    <Dropdown>
      <HeaderButton class={style.menuButton} />
      <DropdownMenu>
        <DropdownItem>New</DropdownItem>
        <DropdownDivider />
        <DropdownItem>Open...</DropdownItem>
        <DropdownItem>Save</DropdownItem>
        <DropdownDivider />
        <DropdownItem>Print / Export to PDF</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </header>
)
