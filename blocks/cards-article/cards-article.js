import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-article-card-image';
      else div.className = 'cards-article-card-body';
    });
    // Split the meta paragraph ("Category Month Day") into a category pill + date
    const body = li.querySelector('.cards-article-card-body');
    if (body) {
      const meta = body.querySelector('p');
      if (meta && !meta.querySelector('*')) {
        const parts = meta.textContent.trim().split(/\s+/);
        // date = last two tokens (Month + Day), category = the rest
        const date = parts.slice(-2).join(' ');
        const category = parts.slice(0, -2).join(' ');
        meta.textContent = '';
        meta.className = 'cards-article-card-meta';
        if (category) {
          const catEl = document.createElement('span');
          catEl.className = 'cards-article-card-tag';
          catEl.textContent = category;
          meta.append(catEl);
        }
        if (date) {
          const dateEl = document.createElement('span');
          dateEl.className = 'cards-article-card-date';
          dateEl.textContent = date;
          meta.append(dateEl);
        }
      }
    }
    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
  block.textContent = '';
  block.append(ul);
}
