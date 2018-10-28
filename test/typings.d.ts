declare module '*.module.scss' {
  const cssModule: {
    [className: string]: string
  }
  export default cssModule
}
