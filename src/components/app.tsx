import * as preact from 'preact'
import createStore, { Store } from 'unistore'
import devtools from 'unistore/devtools'
import { Provider } from 'unistore/preact'
import Header from './header'
import Preview from './preview'
import style from './style/app.module.scss'

const { h } = preact

export interface GlobalStore {
  buffer: string
}

// Global store
const store: Store<GlobalStore> = (() => {
  const initialStore: Store<GlobalStore> = createStore({
    buffer: '',
  })

  if (process.env.NODE_ENV === 'development') return devtools(initialStore)
  return initialStore
})()

export default () => {
  return (
    <Provider store={store}>
      <div class={style.app}>
        <Header />
        <Preview />
      </div>
    </Provider>
  )
}
