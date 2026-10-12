// Only the neutral entry selects a language automatically. Localized URLs stay fixed.
(() => {
  const key = 'beatmine.site.language';
  const current = new URL(location.href);
  if (document.documentElement.dataset.languageEntry === 'true') {
    const routes = JSON.parse(document.documentElement.dataset.languageRoutes);
    const supported = Object.keys(routes);
    let saved;
    try { saved = localStorage.getItem(key); } catch { /* Browser preferences still work. */ }
    const match = language => {
      const tag = language.toLowerCase();
      const base = tag.split('-')[0];
      if (base === 'zh') {
        if (tag.includes('-hans')) return null;
        return tag.includes('-hant') || /^zh-(tw|hk|mo)(-|$)/.test(tag) ? 'zh-Hant' : null;
      }
      return supported.find(code => code.toLowerCase() === base) || null;
    };
    const preferred = supported.includes(saved) ? saved
      : (navigator.languages || [navigator.language]).map(match).find(Boolean) || 'en';
    const target = new URL(routes[preferred], current);
    target.search = current.search;
    target.searchParams.delete('lang');
    target.hash = current.hash;
    location.replace(target.href);
    return;
  }
  for (const link of document.querySelectorAll('.language-panel a[hreflang], .footer-languages a[hreflang]')) {
    const target = new URL(link.href);
    target.search = current.search;
    target.searchParams.delete('lang');
    target.hash = current.hash;
    link.href = target.href;
    // Opening a shared URL never changes the recipient's saved preference.
    link.addEventListener('click', () => {
      try { localStorage.setItem(key, link.hreflang); } catch { /* Language-specific URLs need no storage. */ }
    });
  }
})();

// The panel is absolutely positioned; opening it never changes header layout.
for (const dropdown of document.querySelectorAll('.language-dropdown')) {
  const trigger = dropdown.querySelector('button');
  const panel = dropdown.querySelector('.language-panel');
  const links = [...panel.querySelectorAll('a')];
  const setOpen = open => {
    panel.hidden = !open;
    trigger.setAttribute('aria-expanded', String(open));
  };
  trigger.hidden = false;
  trigger.addEventListener('click', () => setOpen(panel.hidden));
  document.addEventListener('click', event => {
    if (!dropdown.contains(event.target)) setOpen(false);
  });
  dropdown.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !panel.hidden) {
      event.preventDefault();
      setOpen(false);
      trigger.focus();
    } else if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
      event.preventDefault();
      setOpen(true);
      const current = links.indexOf(document.activeElement);
      const index = event.key === 'Home' ? 0 : event.key === 'End' ? links.length - 1
        : event.key === 'ArrowDown' ? (current + 1) % links.length
        : (current < 0 ? links.length - 1 : (current - 1 + links.length) % links.length);
      links[index].focus();
    }
  });
  dropdown.addEventListener('focusout', event => {
    if (event.relatedTarget && !dropdown.contains(event.relatedTarget)) setOpen(false);
  });
}
