// tslint:disable:variable-name
import * as preact from 'preact'
import style from './button.module.scss'

const { h } = preact

export const Button = props => (
  <button
    {...props}
    class={`${props.class || props.className} ${style.button}`}
  />
)

export const withClass = (klass: string, Target = Button) => props => (
  <Target
    {...props}
    class={`${props.class || props.className} ${style[klass]}`}
  />
)

export const HeaderButton = withClass('header')
