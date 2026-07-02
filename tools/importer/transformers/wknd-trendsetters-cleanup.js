/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: WKND Trendsetters site-wide cleanup.
 *
 * Removes non-authorable site chrome (navbar/mega-menu, footer, skip link,
 * in-article breadcrumbs) and cleans up astro-generated artifacts (inline SVG
 * icon <img> tags encoded as data:image/svg+xml, data-astro-cid-* attributes,
 * and leftover inline style attributes).
 *
 * All selectors were verified against migration-work/cleaned.html:
 *   - <a href="#main-content" class="skip-link">                (skip link)
 *   - <div class="navbar"> ... </div>                          (nav + mega menu, before <main>)
 *   - <footer class="footer inverse-footer"> ... </footer>     (site footer, after <main>)
 *   - <div class="breadcrumbs"> ... </div>                     (in featured-story section)
 *   - <img src="data:image/svg+xml;base64,...">                (decorative SVG icons throughout)
 *   - data-astro-cid-rbygaycu attributes                       (on FAQ icon SVGs)
 */

const TransformHook = {
  beforeTransform: 'beforeTransform',
  afterTransform: 'afterTransform',
};

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove decorative inline SVG icons (nav carets, mega-menu icons, FAQ +/-
    // icons, breadcrumb chevron, footer social icons). These are encoded as
    // data:image/svg+xml <img> tags and are not authorable content. Removing
    // them before block parsing prevents parsers from pulling them into cells.
    // Verified in cleaned.html: <img src="data:image/svg+xml;base64,...">
    element.querySelectorAll('img[src^="data:image/svg+xml"]').forEach((img) => img.remove());

    // Remove the in-article breadcrumb trail from the featured-story section.
    // Verified in cleaned.html: <div class="breadcrumbs"> Home > Case studies </div>
    WebImporter.DOMUtils.remove(element, ['.breadcrumbs']);
  }

  if (hookName === TransformHook.afterTransform) {
    // Remove non-authorable site chrome. Selectors verified in cleaned.html.
    // NOTE: do NOT remove <header> — the hero-gallery block lives in
    // <header class="section secondary-section"> (mapped in page-templates.json),
    // so it is authorable content, not site chrome.
    WebImporter.DOMUtils.remove(element, [
      '.skip-link', // <a href="#main-content" class="skip-link">
      '.navbar', // top-level nav container (logo, nav-menu, mega-menu, mobile toggle)
      'footer.footer', // <footer class="footer inverse-footer"> site footer
    ]);

    // Strip astro-generated attributes and leftover inline styles from all
    // remaining elements. Verified in cleaned.html: data-astro-cid-* and
    // style attributes on astro markup.
    element.querySelectorAll('*').forEach((el) => {
      [...el.attributes].forEach((attr) => {
        if (attr.name.startsWith('data-astro-cid')) {
          el.removeAttribute(attr.name);
        }
      });
      el.removeAttribute('style');
    });
  }
}
