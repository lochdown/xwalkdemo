/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-gallery. Base: hero.
 * Source: https://wknd-trendsetters.site/
 * Model (blocks/hero-gallery/_hero-gallery.json):
 *   text (richtext)                              -> field:text (heading, subheading, CTAs)
 *   image1 (reference) + image1Alt (collapsed)   -> field:image1
 *   image2 (reference) + image2Alt (collapsed)   -> field:image2
 *   image3 (reference) + image3Alt (collapsed)   -> field:image3
 * Library convention: 1 column; name row + one row per model field.
 */
export default function parse(element, { document }) {
  // Extract text content: heading, subheading, CTA buttons
  const heading = element.querySelector('h1, h2, [class*="heading"]');
  const subheading = element.querySelector('p.subheading, p[class*="subheading"], p');
  const ctaLinks = Array.from(element.querySelectorAll('a.button, .button-group a, a[class*="button"]'));

  // Extract gallery images (up to 3)
  const images = Array.from(element.querySelectorAll('img'));

  // Empty-block guard
  if (!heading && !subheading && images.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  // Row: text cell (field: text) - heading, subheading, CTAs
  const textCell = document.createDocumentFragment();
  const textContent = [];
  if (heading) textContent.push(heading);
  if (subheading && subheading !== heading) textContent.push(subheading);
  textContent.push(...ctaLinks);
  textCell.appendChild(document.createComment(' field:text '));
  textContent.forEach((node) => textCell.appendChild(node));
  cells.push([textCell]);

  // One row per gallery image (field: image1..image3). Alt collapses into the img.
  [0, 1, 2].forEach((i) => {
    const imageCell = document.createDocumentFragment();
    imageCell.appendChild(document.createComment(` field:image${i + 1} `));
    if (images[i]) imageCell.appendChild(images[i]);
    cells.push([imageCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-gallery', cells });
  element.replaceWith(block);
}
