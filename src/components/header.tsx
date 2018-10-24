import * as preact from 'preact'

const { h } = preact

export default () => (
  <header class="marp__header">
    <a href="https://marp.app/" target="_blank" rel="noopener">
      <img class="marp__header__logo" src="/marp.svg" alt="Marp" width="30" height="30" />
    </a>
  </header>
)
