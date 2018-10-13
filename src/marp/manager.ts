import Marp, { MarpOptions } from '@marp-team/marp-core'
import uuid from 'uuid/v4'
import { IncrementalDOMProxyBuffer } from './incremental-dom-proxy'
import MarpWorker from './marp.worker.ts'

type PostCommand = (command: string, ...args: any) => void

export class MarpManager {
  static worker: MarpWorker
  private static instances: Map<string, MarpManager> = new Map()

  private static register(manager: MarpManager): PostCommand {
    if (!MarpManager.worker) {
      MarpManager.worker = new MarpWorker()
      MarpManager.worker.addEventListener('message', MarpManager.onMessage)
    }

    MarpManager.instances.set(manager.id, manager)
    MarpManager.worker.postMessage(['register', manager.id, manager.opts])

    // Return post function
    return (command, ...args) =>
      MarpManager.worker.postMessage([command, manager.id, ...args])
  }

  private static onMessage(e: MessageEvent) {
    const funcName = `__worker__${e.data[0]}`
    const manager = MarpManager.instances.get(e.data[1])

    if (
      manager instanceof MarpManager &&
      typeof manager[funcName] === 'function'
    )
      manager[funcName].apply(manager, e.data.slice(2))
  }

  readonly opts: MarpOptions
  readonly id: string

  onRendered?: (
    rendered: { html: IncrementalDOMProxyBuffer; css: string }
  ) => void

  private readonly post: PostCommand

  constructor(opts: MarpOptions = {}) {
    this.opts = opts
    this.id = uuid()
    this.post = MarpManager.register(this)
  }

  render(markdown: string) {
    this.post('render', markdown)
  }

  // Worker command
  // tslint:disable:function-name
  private __worker__rendered(rendered) {
    if (this.onRendered) this.onRendered(rendered)
  }
}

export const ready = Marp.ready

export default MarpManager
