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
  const appButton = ({ props }) => (
    <HeaderButton class={style.appButton} {...props} />
  )

  const print = () => setTimeout(() => window.print(), 16)

  return (
    <header class={style.header}>
      <Dropdown button={appButton}>
        <DropdownMenu>
          <DropdownItem>New</DropdownItem>
          <DropdownDivider />
          <DropdownItem>Open...</DropdownItem>
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
}
