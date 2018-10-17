import { MarpOptions } from '@marp-team/marp-core'
import uuid from 'uuid/v4'
import { ExtendedMarp } from './marp'
import MarpWorker from './marp.worker.ts'

type PostCommand = (command: string, ...args: any) => void

export class MarpManager {
  private static worker?: MarpWorker
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
      MarpManager.worker!.postMessage([command, manager.id, ...args])
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

  readonly id: string
  readonly opts: MarpOptions

  onRendered?: (rendered: ReturnType<ExtendedMarp['render']>) => void

  private readonly post: PostCommand
  private renderQueue: string[] = []

  constructor(opts: MarpOptions = {}) {
    this.opts = opts
    this.id = uuid()
    this.post = MarpManager.register(this)
  }

  render(markdown: string) {
    if (this.renderQueue.length > 0) {
      this.renderQueue = [this.renderQueue[0], markdown]
    } else {
      this.renderQueue.push(markdown)
      this.post('render', markdown)
    }
  }

  // Worker command
  // tslint:disable:function-name
  private __worker__rendered(rendered) {
    if (this.onRendered) this.onRendered(rendered)

    this.renderQueue.shift()
    if (this.renderQueue.length > 0) this.post('render', this.renderQueue[0])
  }
}

export default MarpManager
