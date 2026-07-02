// keep track globally of the number of tab blocks on the page
let tabBlockCnt = 0;

export default async function decorate(block) {
  // build tablist
  const tablist = document.createElement('div');
  tablist.className = 'tabs-testimonial-list';
  tablist.setAttribute('role', 'tablist');
  tablist.id = `tablist-${tabBlockCnt += 1}`;

  // the first cell of each row is the title of the tab
  const tabHeadings = [...block.children]
    .filter((child) => child.firstElementChild && child.firstElementChild.children.length > 0)
    .map((child) => child.firstElementChild);

  tabHeadings.forEach((tab, i) => {
    const id = `tabpanel-${tabBlockCnt}-tab-${i + 1}`;

    // decorate tabpanel
    const tabpanel = block.children[i];
    tabpanel.className = 'tabs-testimonial-panel';
    tabpanel.id = id;
    tabpanel.setAttribute('aria-hidden', !!i);
    tabpanel.setAttribute('aria-labelledby', `tab-${id}`);
    tabpanel.setAttribute('role', 'tabpanel');

    // build tab button
    const button = document.createElement('button');
    button.className = 'tabs-testimonial-tab';
    button.id = `tab-${id}`;

    // build the tab button content: avatar + name + role (mirrors source design)
    const nameText = tab.textContent.trim();

    // derive avatar image and role text from the panel's content cell
    // (skip the title cell `tab` so we don't pick up the tab name again)
    const contentCell = tab.nextElementSibling || tabpanel;
    const panelImg = contentCell.querySelector('picture, img');
    const panelParagraphs = [...contentCell.querySelectorAll('p')]
      .filter((p) => !p.querySelector('picture, img'));
    const roleText = panelParagraphs.length ? panelParagraphs[0].textContent.trim() : '';

    const avatar = document.createElement('span');
    avatar.className = 'tabs-testimonial-avatar';
    if (panelImg) {
      const clone = panelImg.cloneNode(true);
      clone.querySelectorAll('img').forEach((img) => {
        img.setAttribute('loading', 'lazy');
        img.removeAttribute('width');
        img.removeAttribute('height');
      });
      avatar.append(clone);
    }

    const info = document.createElement('span');
    info.className = 'tabs-testimonial-tab-info';
    const nameEl = document.createElement('span');
    nameEl.className = 'tabs-testimonial-tab-name';
    nameEl.textContent = nameText;
    info.append(nameEl);
    if (roleText) {
      const roleEl = document.createElement('span');
      roleEl.className = 'tabs-testimonial-tab-role';
      roleEl.textContent = roleText;
      info.append(roleEl);
    }

    button.append(avatar, info);

    button.setAttribute('aria-controls', id);
    button.setAttribute('aria-selected', !i);
    button.setAttribute('role', 'tab');
    button.setAttribute('type', 'button');

    button.addEventListener('click', () => {
      block.querySelectorAll('[role=tabpanel]').forEach((panel) => {
        panel.setAttribute('aria-hidden', true);
      });
      tablist.querySelectorAll('button').forEach((btn) => {
        btn.setAttribute('aria-selected', false);
      });
      tabpanel.setAttribute('aria-hidden', false);
      button.setAttribute('aria-selected', true);
    });

    // add the new tab list button, to the tablist
    tablist.append(button);

    // remove the tab heading from the dom, which also removes it from the UE tree
    tab.remove();
  });

  block.prepend(tablist);
}
