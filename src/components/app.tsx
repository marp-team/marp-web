import * as preact from 'preact'
import persistStore from 'unissist'
import localStorageAdapter from 'unissist/integrations/localStorageAdapter'
import createStore, { Store } from 'unistore'
import devtools from 'unistore/devtools'
import { Provider } from 'unistore/preact'
import Header from './header'
import Preview from './preview'
import style from './style/app.module.scss'

const { h } = preact

export interface GlobalStore {
  buffer: string
  bufferChanged: boolean
}

// Global store
export const store = (initialStore: Partial<GlobalStore> = {}) => {
  let store: Store<GlobalStore> = createStore({
    buffer: '',
    bufferChanged: false,
    ...initialStore,
  })

  persistStore(store, localStorageAdapter())

  if (process.env.NODE_ENV === 'development') store = devtools(store)
  return store
}

export default () => {
  return (
    <Provider store={store()}>
      <div class={style.app}>
        <Header />
        <Preview />
      </div>
    </Provider>
  )
}
