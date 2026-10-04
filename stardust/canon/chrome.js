// stardust canon chrome.js — the two chrome interactions motion-observe recorded on the live site
// (stardust/replica/motion/home.json, home-360.json + capture/chrome-open-{1440,360}.json), as the SAME
// class / aria / inline-style state machine the live Vue component drives. Inert at t=0 for the gate.
(function () {
  // USTA SITES dropdown (1440): click toggles aria-expanded on the label button; the live CSS rule
  // `.drop-down__label-wrapper[aria-expanded="true"] + .drop-down__select-list { display: block }` shows the list.
  const dd = document.querySelector('.drop-down__label-wrapper');
  const close = document.querySelector('.drop-down__close');
  if (dd) {
    const set = (open) => dd.setAttribute('aria-expanded', open ? 'true' : 'false');
    dd.addEventListener('click', () => set(dd.getAttribute('aria-expanded') !== 'true'));
    if (close) close.addEventListener('click', () => set(false));
  }
  // Hamburger (≤1369px): live moves the nav menu into the top bar at mobile widths; the click toggles
  // aria-expanded, adds `top-navigation__top-bar--opened top-to-bottom` on #top-navigation-bar
  // (transition top .3s), sets inline display:block on the menu and swaps the two icons by inline style.
  const burger = document.querySelector('.top-navigation__logo-hamburger');
  const topBar = document.getElementById('top-navigation-bar');
  const menu = document.querySelector('.top-navigation__navigation-menu');
  const mainBar = document.querySelector('.top-navigation__main-bar');
  if (burger && topBar && menu && mainBar) {
    const place = () => {
      const mobile = window.matchMedia('(max-width: 1369px)').matches;
      if (mobile && menu.parentElement !== topBar) topBar.appendChild(menu);
      if (!mobile && menu.parentElement !== mainBar) { mainBar.appendChild(menu); menu.style.display = ''; }
    };
    place(); window.addEventListener('resize', place);
    const icon = (cls) => burger.querySelector('.top-navigation__logo-hamburger--' + cls);
    burger.addEventListener('click', () => {
      const open = burger.getAttribute('aria-expanded') !== 'true';
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      topBar.classList.toggle('top-navigation__top-bar--opened', open);
      topBar.classList.toggle('top-to-bottom', open);
      menu.style.display = open ? 'block' : '';
      if (icon('menu')) icon('menu').style.display = open ? 'none' : '';
      if (icon('cancel')) icon('cancel').style.display = open ? 'inline' : '';
    });
  }
})();
