const isInsideElement = (element: Element | null, container: Element) =>
  !!(
    element &&
    (element === container || isInsideElement(element.parentElement, container))
  )

export interface DropdownItem {
  command?: () => void
  label: string
}

type DropdownItems = (DropdownItem | undefined)[]

export class Dropdown {
  readonly button: HTMLButtonElement
  readonly container: HTMLElement

  constructor(container: HTMLElement, items: DropdownItems) {
    this.container = container

    // Initialize button
    const btn = this.container.querySelector('button')
    if (!btn)
      throw new Error('Cannot find button element from dropdown container.')

    this.button = btn

    this.initializeMenu(items)
    this.createMenu(items)
  }

  open() {
    this.container.classList.add('marp__dropdown--open')
    this.container.focus()
  }

  close() {
    this.container.classList.remove('marp__dropdown--open')
  }

  toggle() {
    if (this.container.classList.toggle('marp__dropdown--open')) {
      this.container.focus()
    }
  }

  private createMenu(items: DropdownItems) {
    const list = document.createElement('ul')
    list.classList.add('marp__dropdown__list')

    for (const item of items) {
      const listItem = document.createElement('li')
      listItem.classList.add('marp__dropdown__list__item')

      if (item) {
        const btn = document.createElement('button')
        btn.classList.add('marp__dropdown__list__item__button')
        btn.textContent = item.label

        listItem.appendChild(btn)
      } else {
        listItem.classList.add('marp__dropdown__list__item--divider')
      }

      list.appendChild(listItem)
    }

    return list
  }

  private initializeMenu(items: DropdownItems) {
    this.container.classList.add('marp__dropdown')
    this.container.setAttribute('tabindex', '0')

    this.container.addEventListener('blur', e => {
      if (!isInsideElement(<any>e.relatedTarget, this.container)) this.close()
    })

    this.button.classList.add('marp__dropdown__button')
    this.button.addEventListener('click', () => this.toggle())

    this.container.appendChild(this.createMenu(items))
  }
}
