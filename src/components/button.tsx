import * as preact from 'preact'
import style from './button.module.scss'
import { combineClass } from './utils'

const { h } = preact

export const Button = props => (
  <button {...props} class={combineClass(props, style.button)} />
)

export const withClass = (klass: string, Target = Button) => props => (
  <Target {...props} class={combineClass(props, style[klass])} />
)

export const HeaderButton = withClass('header')
