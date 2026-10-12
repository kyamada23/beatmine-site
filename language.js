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
