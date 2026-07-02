/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-overlay. Base: hero.
 * Source: https://wknd-trendsetters.site/
 * Model (blocks/hero-overlay/_hero-overlay.json):
 *   image (reference) + imageAlt (collapsed) -> row 2 -> field:image
 *   text (richtext)                          -> row 3 -> field:text (heading, subheading, CTA)
 * Library convention: 1 column, 3 rows (name row, image row, text row).
 */
export default function parse(element, { document }) {
  // Background image (overlay cover image)
  const bgImage = element.querySelector('img.utility-overlay, img.cover-image, img');

  // Text content within the overlay card body
  const heading = element.querySelector('h1, h2, [class*="heading"]');
  const subheading = element.querySelector('p.subheading, p[class*="subheading"], p');
  const ctaLinks = Array.from(element.querySelectorAll('a.button, .button-group a, a[class*="button"]'));

  // Empty-block guard
  if (!heading && !subheading && !bgImage) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  // Row 2: image cell (field: image)
  const imageCell = document.createDocumentFragment();
  if (bgImage) {
    imageCell.appendChild(document.createComment(' field:image '));
    imageCell.appendChild(bgImage);
  }
  cells.push([imageCell]);

  // Row 3: text cell (field: text) - heading, subheading, CTAs
  const textCell = document.createDocumentFragment();
  const textContent = [];
  if (heading) textContent.push(heading);
  if (subheading && subheading !== heading) textContent.push(subheading);
  textContent.push(...ctaLinks);
  if (textContent.length) {
    textCell.appendChild(document.createComment(' field:text '));
    textContent.forEach((node) => textCell.appendChild(node));
  }
  cells.push([textCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-overlay', cells });
  element.replaceWith(block);
}
