/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-article. Base: cards (container).
 * Source: https://wknd-trendsetters.site/
 * Model (blocks/cards-article/_cards-article.json) child cards-article-card:
 *   image (reference) + imageAlt (collapsed) -> cell 1  -> field:image
 *   text (richtext)                          -> cell 2  -> field:text
 * Library convention: each card = one row with 2 cells (image, text).
 * Source: each card is an <a.article-card> wrapping image + body (tag, date, heading).
 */
export default function parse(element, { document }) {
  // Each card is an anchor with class article-card / card-link
  let cards = Array.from(element.querySelectorAll(':scope > a.article-card, :scope > a.card-link'));
  if (cards.length === 0) {
    cards = Array.from(element.querySelectorAll(':scope > a'));
  }

  // Empty-block guard
  if (cards.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];
  cards.forEach((card) => {
    const href = card.getAttribute('href');

    // Cell 1: image
    const img = card.querySelector('img');
    const imageCell = document.createDocumentFragment();
    if (img) {
      imageCell.appendChild(document.createComment(' field:image '));
      imageCell.appendChild(img);
    }

    // Cell 2: text content (tag, date, heading linked to the article)
    const textCell = document.createDocumentFragment();
    textCell.appendChild(document.createComment(' field:text '));

    // Meta: tag + date
    const meta = card.querySelector('.article-card-meta');
    if (meta) textCell.appendChild(meta);

    // Heading text, wrapped in a link to the article (single heading level)
    const heading = card.querySelector('h1, h2, h3, h4, h5, h6');
    if (heading) {
      const wrap = document.createElement(heading.tagName.toLowerCase());
      if (href) {
        const link = document.createElement('a');
        link.setAttribute('href', href);
        link.textContent = heading.textContent.trim();
        wrap.appendChild(link);
      } else {
        wrap.textContent = heading.textContent.trim();
      }
      textCell.appendChild(wrap);
    }

    cells.push([imageCell, textCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-article', cells });
  element.replaceWith(block);
}
