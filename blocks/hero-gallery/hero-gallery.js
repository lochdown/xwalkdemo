import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const rows = [...block.children];
  // Row 0 = text cell; rows 1..3 = one gallery image each.
  const [textRow, ...imageRows] = rows;

  const textCol = document.createElement('div');
  textCol.className = 'hero-gallery-text';
  if (textRow) {
    const cell = textRow.firstElementChild || textRow;
    moveInstrumentation(textRow, textCol);
    while (cell.firstChild) textCol.append(cell.firstChild);
  }

  const gallery = document.createElement('div');
  gallery.className = 'hero-gallery-images';
  imageRows.forEach((row) => {
    const cell = row.firstElementChild || row;
    const pic = cell.querySelector('picture');
    if (!pic) return;
    const figure = document.createElement('div');
    figure.className = 'hero-gallery-image';
    moveInstrumentation(row, figure);
    figure.append(pic);
    gallery.append(figure);
  });

  block.textContent = '';
  block.append(textCol, gallery);
}
