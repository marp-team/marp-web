import * as preact from 'preact'
import style from './style/button.module.scss'
import { combineClass } from './utils'

const { h } = preact

export const Button = props => <button {...combineClass(props, style.button)} />

export const withClass = (klass: string, Target = Button) => props => (
  <Target {...combineClass(props, style[klass])} />
)

export const HeaderButton = withClass('header')
