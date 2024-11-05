// 添加一个回到聊天列表顶部的侧边栏按钮 - v1.3
// @run-at main

// 更新日志：
// v1.3：实现 #4，确保按钮始终置顶
// v1.2: 实现 #2，支持更多列表的回顶部
// v1.1: 修复 #1、添加实时响应支持

;(function () {
  const topArrowSvg = `<svg
  viewBox="0 0 16 16"
  xmlns="http://www.w3.org/2000/svg">
  <path
    stoke-width="1.5"
    stroke-linecap="round"
    stroke-linejoin="round"
    fill="none"
    stroke="currentColor"
    d="m 4,10 4,-4 4,4"
  />
</svg>`

  const contactListSelector = '.q-scroll-view'
  const lowerSidebarSelector = '.sidebar__lower .sidebar__menu'
  const barItemSelector = `${lowerSidebarSelector} .func-menu__item_wrap`
  const toTopClassName = 'to-top-item'

  /** @type {string} */
  const selfPath = document.currentScript.getAttribute('data-scriptio-script')

  let currentEnabled = false

  /**
   * @param {HTMLElement} elem
   * @returns {boolean}
   */
  function elemVisible(elem) {
    return !!(elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length)
  }

  /**
   * @param {string} iconHtml
   * @param {string} label
   * @param {string} className
   * @returns {HTMLDivElement}
   */
  function createLeftBarItem(iconHtml, label, className) {
    /** @type {HTMLDivElement} */
    const templateLeftBarElem = document.querySelector(barItemSelector).cloneNode(true)
    templateLeftBarElem.querySelector('i.q-icon').innerHTML = iconHtml
    /** @type {HTMLDivElement} */
    const itemChildElem = templateLeftBarElem.firstElementChild.firstElementChild
    itemChildElem.classList.value = `${className} func-menu__item vue-component`
    templateLeftBarElem
      .querySelector('div[aria-label]')
      .setAttribute('aria-label', label)
    return templateLeftBarElem
  }

  function toContactListTop() {
    for (const elem of document.querySelectorAll(contactListSelector)) {
      if (elemVisible(elem)) {
        elem.scrollTo({ top: 0, behavior: 'smooth' })
        break
      }
    }
  }

  const toTopElem = createLeftBarItem(topArrowSvg, '回顶部', toTopClassName)
  toTopElem.addEventListener('click', toContactListTop)
  /** @type {HTMLDivElement} */
  const sidebarLowerElem = document.querySelector(lowerSidebarSelector)

  function insertButton() {
    sidebarLowerElem.insertBefore(toTopElem, sidebarLowerElem.firstChild)
  }

  function removeButton() {
    toTopElem.remove()
  }

  const sidebarObserver = new MutationObserver(() => {
    // if (!toTopElem.parentElement) return;
    insertButton()
    removeButton()
  })
  function startObserve() {
    sidebarObserver.observe(sidebarLowerElem, { childList: true })
  }

  /**
   * @param {boolean} state
   */
  function toggle(state) {
    const enable = () => {
      insertButton()
      startObserve()
    }

    const disable = () => {
      removeButton()
      sidebarObserver.disconnect()
    }

    if (state && !currentEnabled) enable()
    else if (!state && currentEnabled) disable()
    currentEnabled = state
  }

  /**
   * @param {CustomEvent<{path: string, enabled: bool}>} event
   */
  const toggleListener = (event) => {
    const { path, enabled } = event.detail
    if (path === selfPath) toggle(enabled)
  }
  window.addEventListener('scriptio-toggle', toggleListener)
  toggle(true)
  globalThis.toContactListTop = toContactListTop
})()
