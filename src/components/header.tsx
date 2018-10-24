// tslint:disable:variable-name
import * as preact from 'preact'
import { Button, HeaderButton } from './button'
import style from './header.module.scss'

const { h } = preact

export default () => (
  <header class={style.header}>
    <HeaderButton class={style.menuButton} />
  </header>
)
