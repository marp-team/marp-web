import * as preact from 'preact'
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

export default () => {
  let mainMenu: Dropdown

  return (
    <header class={style.header}>
      <Dropdown ref={elm => (mainMenu = elm)}>
        <HeaderButton
          class={style.appButton}
          onClick={e => mainMenu.handleButtonClick(e)}
          onMouseDown={e => mainMenu.handleButtonMouseDown(e)}
        />
        <DropdownMenu>
          <DropdownItem>New</DropdownItem>
          <DropdownDivider />
          <DropdownItem>Open...</DropdownItem>
          <DropdownItem>Save</DropdownItem>
          <DropdownDivider />
          <DropdownItem onClick={() => window.print()}>
            Print
            {isChrome() && ' / Export to PDF'}
            ...
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </header>
  )
}
