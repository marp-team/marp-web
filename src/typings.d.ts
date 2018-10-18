declare module '*.worker.ts' {
  class WorkerLoaderWorker extends Worker {
    constructor()
  }
  export default WorkerLoaderWorker
}
