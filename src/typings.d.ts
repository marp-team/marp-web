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
