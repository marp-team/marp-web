import * as preact from 'preact'
import connectBufferActions, { ConnectableChild } from './actions/buffer'
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

const app = ({ props }) => (
  <HeaderButton aria-label="Main menu" class={style.appButton} {...props} />
)
const lazy = (func: () => void): VoidFunction => () => setTimeout(func, 16)

export const Header: ConnectableChild<'bufferChanged' | 'fileName'> = ({
  bufferChanged,
  fileName,
  newCommand,
  openCommand,
  saveCommand,
}) => (
  <header class={style.header}>
    <Dropdown button={app}>
      <DropdownMenu>
        <DropdownItem onClick={lazy(newCommand)}>New</DropdownItem>
        <DropdownDivider />
        <DropdownItem onClick={lazy(openCommand)}>Open...</DropdownItem>
        <DropdownItem onClick={lazy(saveCommand)}>Save</DropdownItem>
        <DropdownDivider />
        <DropdownItem onClick={lazy(() => window.print())}>
          Print
          {isChrome() && ' / Export to PDF'}
          ...
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
    <div
      class={[
        style.file,
        bufferChanged && style.fileChanged,
        fileName ? '' : style.fileUntitled,
      ]
        .filter(c => c)
        .join(' ')}
    >
      <span class={style.fileName}>{fileName || '(untitled)'}</span>
      <span class={style.fileIndicator}>*</span>
    </div>
  </header>
)

export default connectBufferActions('bufferChanged', 'fileName')(Header)
