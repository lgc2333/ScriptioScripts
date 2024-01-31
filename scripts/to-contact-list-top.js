// * 添加一个回到聊天列表顶部的侧边栏按钮
// @run-at main

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
  const placeholderSelector = `${contactListSelector} .viewport-list__placeholder`;
  const lowerSidebarSelector = '.sidebar__lower .sidebar__menu';
  const barItemSelector = `${lowerSidebarSelector} .func-menu__item_wrap`;

  /**
   * @param {string} iconHtml
   * @param {string} label
   * @returns {Node}
   */
  function createLeftBarItem(iconHtml, label) {
    const templateLeftBarElem = document
      .querySelector(barItemSelector)
      .cloneNode(true);
    templateLeftBarElem.querySelector('i.q-icon').innerHTML = iconHtml;
    templateLeftBarElem
      .querySelector('div[aria-label]')
      .setAttribute('aria-label', label);
    return templateLeftBarElem;
  }

  function toContactListTop() {
    const topPlaceholderElem = document.querySelector(placeholderSelector);
    topPlaceholderElem.style.height = '0px';
    const contactListElem = document.querySelector(contactListSelector);
    contactListElem.scrollTo({ top: 0, behavior: 'smooth' });
    contactListElem.dispatchEvent(new Event('scroll'));
    contactListElem.dispatchEvent(new Event('scrollend'));
  }

  function main() {
    const toTopElem = createLeftBarItem(topArrowSvg, '回顶部');
    toTopElem.addEventListener('click', toContactListTop);
    const sidebarLowerElem = document.querySelector(lowerSidebarSelector);
    sidebarLowerElem.insertBefore(toTopElem, sidebarLowerElem.firstChild);
  }

  globalThis.toContactListTop = toContactListTop;
  setTimeout(main);
})();
