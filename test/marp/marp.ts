import Marp from '@marp-team/marp-core'
import IncrementalDOM, { patch } from 'incremental-dom'
import createMarp from '../../src/marp/marp'
import { convert } from '../../src/marp/incremental-dom-proxy'

describe('Marp instance', () => {
  let container: HTMLElement

  beforeEach(() => {
    document.body.innerHTML = '<div id="container"></div>'
    container = document.getElementById('container')!
  })

  it('creates Marp instance with passed option', () => {
    const marp = createMarp({ html: true })

    expect(marp).toBeInstanceOf(Marp)
    expect(marp.options).toEqual(expect.objectContaining({ html: true }))
  })

  describe('Incremental DOM', () => {
    it('returns proxied buffer array of Incremental DOM when rendered', () => {
      const marp = createMarp()
      const { html } = marp.render('# markdown')
      expect(Array.isArray(html)).toBe(true)

      // Patchable with Incremental DOM proxy
      patch(container, convert(IncrementalDOM, html))
      const heading = container.querySelector('h1')

      expect(heading).toBeTruthy()
      expect(heading!.textContent).toBe('markdown')
    })
  })

  describe('Image syntax', () => {
    it('has referrerpolicy attribute with specified no-referrer', () => {
      const marp = createMarp()
      patch(
        container,
        convert(IncrementalDOM, marp.render('![image](img.png)').html)
      )

      expect(
        container.querySelector(
          'img[src="img.png"][alt="image"][referrerpolicy="no-referrer"]'
        )
      ).toBeTruthy()
    })
  })

  describe('Hyperlink', () => {
    it('has target, rel, and referrerpolicy attributes', () => {
      const marp = createMarp()

      patch(
        container,
        convert(
          IncrementalDOM,
          marp.render('[link](https://example.com/)').html
        )
      )

      expect(
        container.querySelector(
          'a[target="_blank"][rel~="noopener"][rel~="noreferrer"][referrerpolicy="no-referrer"]'
        )
      ).toBeTruthy()
    })
  })
})
