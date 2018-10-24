import * as preact from 'preact'
import style from './header.module.scss'

const { h } = preact

export default () => (
  <header class={style.header}>
    <a href="https://marp.app/" target="_blank" rel="noopener">
      <img
        class={style.logo}
        src="/marp.svg"
        alt="Marp"
        width="30"
        height="30"
      />
    </a>
  </header>
)
