/* eslint-disable */
/* global WebImporter */
/**
 * Parser for tabs-testimonial. Base: tabs (container).
 * Source: https://wknd-trendsetters.site/
 * Model (blocks/tabs-testimonial/_tabs-testimonial.json) child tabs-testimonial-item:
 *   title (text)            -> cell 1 (tab label)  -> field:title
 *   content_heading (text)  -> cell 2 (grouped)    -> field:content_heading
 *   content_headingType     -> collapsed (Type suffix), no hint/cell
 *   content_image (ref)     -> cell 2 (grouped)    -> field:content_image
 *   content_richtext        -> cell 2 (grouped)    -> field:content_richtext
 * Library convention: each tab = one row, 2 columns (label, content).
 */
export default function parse(element, { document }) {
  const panes = Array.from(element.querySelectorAll('.tabs-content > .tab-pane'));
  const labels = Array.from(element.querySelectorAll('.tab-menu .tab-menu-link, .tab-menu [role="tab"]'));

  // Empty-block guard
  if (panes.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];
  panes.forEach((pane, i) => {
    // Cell 1: tab label (title). Prefer the menu button's text content for this tab.
    const labelCell = document.createDocumentFragment();
    labelCell.appendChild(document.createComment(' field:title '));
    const labelSource = labels[i];
    if (labelSource) {
      // Use the primary name (first <strong>) as the tab title
      const nameEl = labelSource.querySelector('strong');
      labelCell.appendChild(document.createTextNode(nameEl ? nameEl.textContent.trim() : labelSource.textContent.trim()));
    } else {
      labelCell.appendChild(document.createTextNode(`Tab ${i + 1}`));
    }

    // Cell 2: grouped content (heading, image, richtext)
    const contentCell = document.createDocumentFragment();

    // content_heading: person's name from the pane
    const heading = pane.querySelector('.paragraph-xl strong, strong');
    if (heading) {
      contentCell.appendChild(document.createComment(' field:content_heading '));
      const h = document.createElement('h3');
      h.textContent = heading.textContent.trim();
      contentCell.appendChild(h);
    }

    // content_image
    const img = pane.querySelector('img');
    if (img) {
      contentCell.appendChild(document.createComment(' field:content_image '));
      contentCell.appendChild(img);
    }

    // content_richtext: role + quote (everything textual after the heading)
    const richParts = [];
    // role line (the div sibling after the name)
    const roleWrap = pane.querySelector('.paragraph-xl.utility-margin-bottom-0, .paragraph-xl strong');
    // Collect role divs and the quote paragraph
    const quote = pane.querySelector('p');
    // role: the div directly following the name div
    if (roleWrap) {
      const container = roleWrap.closest('div');
      const role = container && container.nextElementSibling;
      if (role && role.tagName === 'DIV' && !role.querySelector('img')) {
        richParts.push(role);
      }
    }
    if (quote) richParts.push(quote);

    if (richParts.length) {
      contentCell.appendChild(document.createComment(' field:content_richtext '));
      richParts.forEach((n) => contentCell.appendChild(n));
    }

    cells.push([labelCell, contentCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs-testimonial', cells });
  element.replaceWith(block);
}
