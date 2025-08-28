// ==UserScript==
// @name         To Contact List Top
// @description  添加一个回到聊天列表顶部的侧边栏按钮
// @version      2.1
// @author       LgCookie
// @license      MIT
// @homepageURL  https://github.com/lgc2333/ScriptioScripts/tree/main/to-contact-list-top
// @run-at       main
// @reactive     true
// ==/UserScript==

// 更新日志：
// v2.1：添加工具提示
// v2.0：适配新版 Scriptio，有点笨地修复了 #5
// v1.3：实现 #4，确保按钮始终置顶
// v1.2: 实现 #2，支持更多列表的回顶部
// v1.1: 修复 #1、添加实时响应支持

;(() => {
  const toTopLabel = '回顶部'
  const toTopClassName = 'to-top-item'
  const toolTipId = `${toTopClassName}-tooltip`

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
  const toolTipHtml = `<div
  id="${toolTipId}"
  class="sidebar-tooltips__content"
  style="left: 55px"
>
  ${toTopLabel}
</div>`

  const contactListSelector = '.q-scroll-view'
  const lowerSidebarSelector = '.sidebar__lower .sidebar__menu'
  const barItemSelector = `${lowerSidebarSelector} .func-menu__item_wrap`

  let currentEnabled = false

  /**
   * @param {HTMLElement} elem
   * @returns {boolean}
   */
  function elemVisible(elem) {
    return !!(elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length)
  }

  function toContactListTop() {
    const nodeList = document.querySelectorAll(contactListSelector)
    for (let i = 0; i < nodeList.length; i++) {
      const elem = /** @type {HTMLElement} */ (nodeList[i])
      if (elemVisible(elem)) {
        elem.scrollTo({ top: 0, behavior: 'smooth' })
        break
      }
    }
  }

  /**
   * @param {HTMLDivElement} leftBarEl
   * @param {HTMLDivElement} toolTipEl
   */
  function setupToolTip(leftBarEl, toolTipEl) {
    /** @param {boolean} state */
    const toggleToolTip = (state) => {
      if (state) {
        const btnPos = leftBarEl.getBoundingClientRect()
        toolTipEl.style.top = `${btnPos.y}px`
      }
      toolTipEl.style.display = state ? 'block' : 'none'
    }
    leftBarEl.addEventListener('mouseenter', () => toggleToolTip(true))
    leftBarEl.addEventListener('mouseleave', () => toggleToolTip(false))
    toggleToolTip(false)
  }

  /**
   * @param {string} iconHtml
   * @param {string} label
   * @param {string} className
   * @returns {[HTMLDivElement, HTMLDivElement] | null}
   */
  function createLeftBarItem(iconHtml, label, className) {
    const barItemEl = /** @type {HTMLElement | null} */ (
      document.querySelector(barItemSelector)
    )
    if (!barItemEl) return null
    const templateLeftBarElem = /** @type {HTMLDivElement} */ (
      barItemEl.cloneNode(true)
    )
    const iconEl = /** @type {HTMLElement} */ (
      templateLeftBarElem.querySelector('i.q-icon')
    )
    iconEl.innerHTML = iconHtml
    const itemChildElem = /** @type {HTMLDivElement} */ (
      templateLeftBarElem.firstElementChild?.firstElementChild
    )
    itemChildElem.classList.value = `${className} func-menu__item vue-component`
    templateLeftBarElem
      .querySelector('div[aria-label]')
      ?.setAttribute('aria-label', label)
    templateLeftBarElem.addEventListener('click', toContactListTop)

    document.body.insertAdjacentHTML('beforeend', toolTipHtml)
    const toolTipElem = /** @type {HTMLDivElement} */ (
      document.getElementById(toolTipId)
    )
    setupToolTip(templateLeftBarElem, toolTipElem)

    return [templateLeftBarElem, toolTipElem]
  }

  /** @type {[HTMLDivElement, HTMLDivElement] | null} */
  let $toTopElemCache = null
  function getToTopElem() {
    if (!$toTopElemCache) {
      $toTopElemCache = createLeftBarItem(topArrowSvg, '回顶部', toTopClassName)
    }
    return $toTopElemCache
  }

  const sidebarObserver = new MutationObserver(() => {
    // if (!toTopElem.parentElement) return;
    disable()
    enable()
  })

  /** @type {number | null} */
  let enableRetryTimeout = null

  function clearEnableRetryTimeout() {
    if (enableRetryTimeout) clearTimeout(enableRetryTimeout)
    enableRetryTimeout = null
  }

  function disable() {
    // console.log('disable')
    clearEnableRetryTimeout()
    sidebarObserver.disconnect()
    if ($toTopElemCache) $toTopElemCache[0].remove()
  }

  function enable() {
    // console.log('enable')
    clearEnableRetryTimeout()
    if (!currentEnabled) {
      // console.log('not enabled, return')
      return
    }
    const toTopElem = getToTopElem()
    if (!toTopElem) {
      // console.log('el not found, schedule retry')
      enableRetryTimeout = setTimeout(enable, 100)
      return
    }
    const sidebarLowerElem = /** @type {HTMLElement} */ (
      document.querySelector(lowerSidebarSelector)
    )
    sidebarLowerElem.insertBefore(toTopElem[0], sidebarLowerElem.firstChild)
    sidebarObserver.takeRecords()
    sidebarObserver.observe(sidebarLowerElem, { childList: true })
  }

  /**
   * @param {boolean} state
   */
  function toggle(state) {
    // console.log('toggle', state)
    if (currentEnabled === state) {
      // console.log('same state, return')
      return
    }
    currentEnabled = state
    if (state) enable()
    else disable()
  }

  scriptio.listen(toggle, true)

  // globalThis.toContactListTop = toContactListTop
})()
