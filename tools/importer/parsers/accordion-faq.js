/* eslint-disable */
/* global WebImporter */
/**
 * Parser for accordion-faq. Base: accordion (container).
 * Source: https://wknd-trendsetters.site/
 * Model (blocks/accordion-faq/_accordion-faq.json) child accordion-faq-item:
 *   summary (text)     -> cell 1 -> field:summary
 *   text (richtext)    -> cell 2 -> field:text
 * Library convention: each accordion item = one row, 2 columns (title, content).
 */
export default function parse(element, { document }) {
  const items = Array.from(element.querySelectorAll(':scope > details.faq-item, :scope > details, :scope > .faq-item'));

  // Empty-block guard
  if (items.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];
  items.forEach((item) => {
    // Cell 1: summary (question)
    const summaryCell = document.createDocumentFragment();
    const summary = item.querySelector('summary, .faq-question');
    summaryCell.appendChild(document.createComment(' field:summary '));
    if (summary) {
      summaryCell.appendChild(document.createTextNode(summary.textContent.trim()));
    }

    // Cell 2: text (answer content)
    const textCell = document.createDocumentFragment();
    const answer = item.querySelector('.faq-answer');
    textCell.appendChild(document.createComment(' field:text '));
    if (answer) {
      Array.from(answer.childNodes).forEach((n) => textCell.appendChild(n));
    }

    cells.push([summaryCell, textCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'accordion-faq', cells });
  element.replaceWith(block);
}
