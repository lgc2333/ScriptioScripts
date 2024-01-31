// 添加一个回到聊天列表顶部的侧边栏按钮 - v1.1
// @run-at main

// 更新日志：
// v1.1: 修复 #1、添加实时响应支持

(function () {
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
</svg>`;

  const contactListSelector = '.q-scroll-view.recent-contact-list';
  const lowerSidebarSelector = '.sidebar__lower .sidebar__menu';
  const barItemSelector = `${lowerSidebarSelector} .func-menu__item_wrap`;
  const toTopClassName = 'to-top-item';

  /** @type {string} */
  const selfPath = document.currentScript.getAttribute('data-scriptio-script');

  let currentEnabled = false;

  /**
   * @param {string} iconHtml
   * @param {string} label
   * @returns {Node}
   */
  function createLeftBarItem(iconHtml, label, className) {
    const templateLeftBarElem = document
      .querySelector(barItemSelector)
      .cloneNode(true);
    templateLeftBarElem.querySelector('i.q-icon').innerHTML = iconHtml;
    /** @type {HTMLDivElement} */
    const itemChildElem =
      templateLeftBarElem.firstElementChild.firstElementChild;
    itemChildElem.classList.value = `${className} func-menu__item vue-component`;
    templateLeftBarElem
      .querySelector('div[aria-label]')
      .setAttribute('aria-label', label);
    return templateLeftBarElem;
  }

  function toContactListTop() {
    const contactListElem = document.querySelector(contactListSelector);
    contactListElem.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const toTopElem = createLeftBarItem(topArrowSvg, '回顶部', toTopClassName);
  toTopElem.addEventListener('click', toContactListTop);
  const sidebarLowerElem = document.querySelector(lowerSidebarSelector);

  /**
   * @param {boolean} state
   */
  function toggle(state) {
    const enable = () => {
      sidebarLowerElem.insertBefore(toTopElem, sidebarLowerElem.firstChild);
    };

    const disable = () => {
      toTopElem.remove();
    };

    if (state && !currentEnabled) enable();
    else if (!state && currentEnabled) disable();
    currentEnabled = state;
  }

  /**
   * @param {CustomEvent<{path: string, enabled: bool}>} event
   */
  const toggleListener = (event) => {
    const { path, enabled } = event.detail;
    if (path === selfPath) toggle(enabled);
  };
  window.addEventListener('scriptio-toggle', toggleListener);
  toggle(true);
  globalThis.toContactListTop = toContactListTop;
})();
