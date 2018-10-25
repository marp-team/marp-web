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

export default () => {
  let mainMenu: Dropdown

  return (
    <header class={style.header}>
      <Dropdown ref={elm => (mainMenu = elm)}>
        <HeaderButton
          class={style.menuButton}
          onClick={() => mainMenu.toggle()}
        />
        <DropdownMenu>
          <DropdownItem>New</DropdownItem>
          <DropdownDivider />
          <DropdownItem>Open...</DropdownItem>
          <DropdownItem>Save</DropdownItem>
          <DropdownDivider />
          <DropdownItem onClick={() => window.print()}>
            Print / Export to PDF
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </header>
  )
}
