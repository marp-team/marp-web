import Marp from '@marp-team/marp-core'
import index from '../src/index'

beforeEach(() => {
  document.body.innerHTML = `
    <textarea id="editor">[![](marp.png)](https://marp.app/)</textarea>
    <style id="preview-css"></style>
    <div id="preview"></div>
  `
})

afterAll(() => jest.restoreAllMocks())

describe('index', () => {
  it('calls Marp.ready()', () => {
    const marpReady = jest.spyOn(Marp, 'ready')

    index()
    expect(marpReady).toBeCalledTimes(1)
  })
})
