import { Store } from 'unistore'

export type ConnectedActions<S, A> = (
  store: Store<S>
) => {
  [P in keyof A]: A[P] extends (...args: infer R) => any
    ? (store: S, ...args: R) => Partial<S> | void
    : never
}
