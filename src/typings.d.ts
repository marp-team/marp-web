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

declare type Overwrite<T, U> = Omit<T, Extract<keyof T, keyof U>> & U
