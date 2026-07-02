/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-feature. Base: columns.
 * Source: https://wknd-trendsetters.site/
 * Columns block (core/franklin/components/columns): NO field hints.
 * Library convention: name row + 1 content row with N columns.
 * Source layout: 2 columns - left image, right breadcrumbs/heading/meta.
 */
export default function parse(element, { document }) {
  // The columns live in the inner grid layout; pull its direct child columns
  const grid = element.querySelector('.grid-layout') || element.querySelector('.container') || element;
  let columns = Array.from(grid.querySelectorAll(':scope > div'));

  // Fallback: if the grid wasn't found, use direct div children of element
  if (columns.length < 2) {
    columns = Array.from(element.querySelectorAll(':scope .container > .grid-layout > div'));
  }

  // Empty-block guard
  if (columns.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];
  // One content row, each source column becomes a cell (no field hints for columns block)
  cells.push(columns.map((col) => col));

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-feature', cells });
  element.replaceWith(block);
}
