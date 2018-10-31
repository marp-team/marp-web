import * as preact from 'preact'
import Header from './header'
import Preview from './preview'
import style from './style/app.module.scss'

const { h } = preact

export default () => {
  return (
    <div class={style.app}>
      <Header />
      <Preview />
    </div>
  )
}
