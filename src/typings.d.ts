declare module '*.worker.ts' {
  class WorkerLoaderWorker extends Worker {
    constructor()
  }
  export default WorkerLoaderWorker
}

declare module '*.module.scss' {
  const cssModule: {
    [className: string]: string
  }
  export default cssModule
}

declare type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
declare type Overwrite<T, U> = Omit<T, Extract<keyof T, keyof U>> & U
