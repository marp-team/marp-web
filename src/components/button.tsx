// tslint:disable:variable-name
import * as preact from 'preact'
import style from './button.module.scss'

const { h } = preact

export const Button = props => (
  <button class={`${props.class || props.className} ${style.button}`}>
    {props.children}
  </button>
)

export const withClass = (klass: string, Target = Button) => props => (
  <Target class={`${props.class || props.className} ${style[klass]}`}>
    {props.children}
  </Target>
)

export const HeaderButton = withClass('header')
