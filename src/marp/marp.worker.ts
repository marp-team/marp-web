import { MarpOptions } from '@marp-team/marp-core'
import createMarp, { ExtendedMarp } from './marp'
import WorkerWrapper from './worker-wrapper'

export class MarpWorker {
  readonly instances: Map<string, ExtendedMarp> = new Map()

  registerWorker() {
    WorkerWrapper(self).addEventListener('message', e => this.onMessage(e))
  }

  private get(id: string) {
    const marp = this.instances.get(id)

    if (!marp)
      throw new Error(`Marp instance ${id} is not available in worker.`)

    return marp
  }

  private onMessage(e: MessageEvent) {
    const func = this[`__worker__${e.data[0]}`]
    if (typeof func === 'function') func.apply(this, e.data.slice(1))
  }

  // Worker command
  // tslint:disable:function-name
  private __worker__register(id: string, opts: MarpOptions) {
    this.instances.set(id, createMarp(opts))
  }

  private __worker__render(id: string, markdown: string) {
    const marp = this.get(id)
    WorkerWrapper(self).postMessage(['rendered', id, marp.render(markdown)])
  }
}

new MarpWorker().registerWorker()
