import { detect } from 'detect-browser'
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

const detected = detect()
const isChrome = detected && detected.name === 'chrome'

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
            {isChrome && ' / Export to PDF'}
            ...
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </header>
  )
}
