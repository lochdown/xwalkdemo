/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-gallery. Base: cards (container).
 * Source: https://wknd-trendsetters.site/
 * Model (blocks/cards-gallery/_cards-gallery.json) child cards-gallery-card:
 *   image (reference) + imageAlt (collapsed) -> cell 1
 *   text (richtext) -> cell 2
 * Library convention: each card = one row with 2 cells (image, text).
 * Empty cells must exist but carry NO field hint.
 */
export default function parse(element, { document }) {
  // Each direct child div is a card
  let cards = Array.from(element.querySelectorAll(':scope > div'));

  // Empty-block guard
  if (cards.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];
  cards.forEach((card) => {
    // Cell 1: image
    const img = card.querySelector('img');
    const imageCell = document.createDocumentFragment();
    if (img) {
      imageCell.appendChild(document.createComment(' field:image '));
      imageCell.appendChild(img);
    }

    // Cell 2: text content (heading, description, CTA) - may be absent
    const textNodes = Array.from(card.querySelectorAll('h1, h2, h3, h4, h5, h6, p, a'));
    const textCell = document.createDocumentFragment();
    if (textNodes.length) {
      textCell.appendChild(document.createComment(' field:text '));
      textNodes.forEach((n) => textCell.appendChild(n));
    }

    cells.push([imageCell, textCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-gallery', cells });
  element.replaceWith(block);
}
