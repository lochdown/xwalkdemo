/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/hero-gallery.js
  function parse(element, { document }) {
    const heading = element.querySelector('h1, h2, [class*="heading"]');
    const subheading = element.querySelector('p.subheading, p[class*="subheading"], p');
    const ctaLinks = Array.from(element.querySelectorAll('a.button, .button-group a, a[class*="button"]'));
    const images = Array.from(element.querySelectorAll("img"));
    if (!heading && !subheading && images.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    const textCell = document.createDocumentFragment();
    const textContent = [];
    if (heading) textContent.push(heading);
    if (subheading && subheading !== heading) textContent.push(subheading);
    textContent.push(...ctaLinks);
    textCell.appendChild(document.createComment(" field:text "));
    textContent.forEach((node) => textCell.appendChild(node));
    cells.push([textCell]);
    [0, 1, 2].forEach((i) => {
      const imageCell = document.createDocumentFragment();
      imageCell.appendChild(document.createComment(` field:image${i + 1} `));
      if (images[i]) imageCell.appendChild(images[i]);
      cells.push([imageCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-gallery", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-feature.js
  function parse2(element, { document }) {
    const grid = element.querySelector(".grid-layout") || element.querySelector(".container") || element;
    let columns = Array.from(grid.querySelectorAll(":scope > div"));
    if (columns.length < 2) {
      columns = Array.from(element.querySelectorAll(":scope .container > .grid-layout > div"));
    }
    if (columns.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    cells.push(columns.map((col) => col));
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-feature", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-gallery.js
  function parse3(element, { document }) {
    let cards = Array.from(element.querySelectorAll(":scope > div"));
    if (cards.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    cards.forEach((card) => {
      const img = card.querySelector("img");
      const imageCell = document.createDocumentFragment();
      if (img) {
        imageCell.appendChild(document.createComment(" field:image "));
        imageCell.appendChild(img);
      }
      const textNodes = Array.from(card.querySelectorAll("h1, h2, h3, h4, h5, h6, p, a"));
      const textCell = document.createDocumentFragment();
      if (textNodes.length) {
        textCell.appendChild(document.createComment(" field:text "));
        textNodes.forEach((n) => textCell.appendChild(n));
      }
      cells.push([imageCell, textCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-gallery", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/tabs-testimonial.js
  function parse4(element, { document }) {
    const panes = Array.from(element.querySelectorAll(".tabs-content > .tab-pane"));
    const labels = Array.from(element.querySelectorAll('.tab-menu .tab-menu-link, .tab-menu [role="tab"]'));
    if (panes.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    panes.forEach((pane, i) => {
      const labelCell = document.createDocumentFragment();
      labelCell.appendChild(document.createComment(" field:title "));
      const labelSource = labels[i];
      if (labelSource) {
        const nameEl = labelSource.querySelector("strong");
        labelCell.appendChild(document.createTextNode(nameEl ? nameEl.textContent.trim() : labelSource.textContent.trim()));
      } else {
        labelCell.appendChild(document.createTextNode(`Tab ${i + 1}`));
      }
      const contentCell = document.createDocumentFragment();
      const heading = pane.querySelector(".paragraph-xl strong, strong");
      if (heading) {
        contentCell.appendChild(document.createComment(" field:content_heading "));
        const h = document.createElement("h3");
        h.textContent = heading.textContent.trim();
        contentCell.appendChild(h);
      }
      const img = pane.querySelector("img");
      if (img) {
        contentCell.appendChild(document.createComment(" field:content_image "));
        contentCell.appendChild(img);
      }
      const richParts = [];
      const roleWrap = pane.querySelector(".paragraph-xl.utility-margin-bottom-0, .paragraph-xl strong");
      const quote = pane.querySelector("p");
      if (roleWrap) {
        const container = roleWrap.closest("div");
        const role = container && container.nextElementSibling;
        if (role && role.tagName === "DIV" && !role.querySelector("img")) {
          richParts.push(role);
        }
      }
      if (quote) richParts.push(quote);
      if (richParts.length) {
        contentCell.appendChild(document.createComment(" field:content_richtext "));
        richParts.forEach((n) => contentCell.appendChild(n));
      }
      cells.push([labelCell, contentCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "tabs-testimonial", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-article.js
  function parse5(element, { document }) {
    let cards = Array.from(element.querySelectorAll(":scope > a.article-card, :scope > a.card-link"));
    if (cards.length === 0) {
      cards = Array.from(element.querySelectorAll(":scope > a"));
    }
    if (cards.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    cards.forEach((card) => {
      const href = card.getAttribute("href");
      const img = card.querySelector("img");
      const imageCell = document.createDocumentFragment();
      if (img) {
        imageCell.appendChild(document.createComment(" field:image "));
        imageCell.appendChild(img);
      }
      const textCell = document.createDocumentFragment();
      textCell.appendChild(document.createComment(" field:text "));
      const meta = card.querySelector(".article-card-meta");
      if (meta) textCell.appendChild(meta);
      const heading = card.querySelector("h1, h2, h3, h4, h5, h6");
      if (heading) {
        const wrap = document.createElement(heading.tagName.toLowerCase());
        if (href) {
          const link = document.createElement("a");
          link.setAttribute("href", href);
          link.textContent = heading.textContent.trim();
          wrap.appendChild(link);
        } else {
          wrap.textContent = heading.textContent.trim();
        }
        textCell.appendChild(wrap);
      }
      cells.push([imageCell, textCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-article", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/accordion-faq.js
  function parse6(element, { document }) {
    const items = Array.from(element.querySelectorAll(":scope > details.faq-item, :scope > details, :scope > .faq-item"));
    if (items.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    items.forEach((item) => {
      const summaryCell = document.createDocumentFragment();
      const summary = item.querySelector("summary, .faq-question");
      summaryCell.appendChild(document.createComment(" field:summary "));
      if (summary) {
        summaryCell.appendChild(document.createTextNode(summary.textContent.trim()));
      }
      const textCell = document.createDocumentFragment();
      const answer = item.querySelector(".faq-answer");
      textCell.appendChild(document.createComment(" field:text "));
      if (answer) {
        Array.from(answer.childNodes).forEach((n) => textCell.appendChild(n));
      }
      cells.push([summaryCell, textCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "accordion-faq", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/hero-overlay.js
  function parse7(element, { document }) {
    const bgImage = element.querySelector("img.utility-overlay, img.cover-image, img");
    const heading = element.querySelector('h1, h2, [class*="heading"]');
    const subheading = element.querySelector('p.subheading, p[class*="subheading"], p');
    const ctaLinks = Array.from(element.querySelectorAll('a.button, .button-group a, a[class*="button"]'));
    if (!heading && !subheading && !bgImage) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    const imageCell = document.createDocumentFragment();
    if (bgImage) {
      imageCell.appendChild(document.createComment(" field:image "));
      imageCell.appendChild(bgImage);
    }
    cells.push([imageCell]);
    const textCell = document.createDocumentFragment();
    const textContent = [];
    if (heading) textContent.push(heading);
    if (subheading && subheading !== heading) textContent.push(subheading);
    textContent.push(...ctaLinks);
    if (textContent.length) {
      textCell.appendChild(document.createComment(" field:text "));
      textContent.forEach((node) => textCell.appendChild(node));
    }
    cells.push([textCell]);
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-overlay", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/wknd-trendsetters-cleanup.js
  var TransformHook = {
    beforeTransform: "beforeTransform",
    afterTransform: "afterTransform"
  };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      element.querySelectorAll('img[src^="data:image/svg+xml"]').forEach((img) => img.remove());
      WebImporter.DOMUtils.remove(element, [".breadcrumbs"]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        ".skip-link",
        // <a href="#main-content" class="skip-link">
        ".navbar",
        // top-level nav container (logo, nav-menu, mega-menu, mobile toggle)
        "footer.footer"
        // <footer class="footer inverse-footer"> site footer
      ]);
      element.querySelectorAll("*").forEach((el) => {
        [...el.attributes].forEach((attr) => {
          if (attr.name.startsWith("data-astro-cid")) {
            el.removeAttribute(attr.name);
          }
        });
        el.removeAttribute("style");
      });
    }
  }

  // tools/importer/import-homepage.js
  var parsers = {
    "hero-gallery": parse,
    "columns-feature": parse2,
    "cards-gallery": parse3,
    "tabs-testimonial": parse4,
    "cards-article": parse5,
    "accordion-faq": parse6,
    "hero-overlay": parse7
  };
  var transformers = [
    transform
  ];
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "Fashion blog homepage with hero, featured story, image gallery, testimonials tabs, latest articles cards, FAQ accordion, and CTA banner",
    urls: [
      "https://wknd-trendsetters.site/"
    ],
    blocks: [
      {
        name: "hero-gallery",
        instances: ["#main-content > header.section.secondary-section"]
      },
      {
        name: "columns-feature",
        instances: ["#main-content > section.section:nth-of-type(1)"]
      },
      {
        name: "cards-gallery",
        instances: ["#main-content > section.section.secondary-section:nth-of-type(2) div.grid-layout.desktop-4-column.tablet-2-column-1.mobile-portrait-1-column.grid-gap-sm"]
      },
      {
        name: "tabs-testimonial",
        instances: ["#main-content > section.section:nth-of-type(3) div.tabs-wrapper"]
      },
      {
        name: "cards-article",
        instances: ["#main-content > section.section.secondary-section:nth-of-type(4) div.grid-layout.desktop-4-column.tablet-2-column-1.mobile-portrait-1-column.grid-gap-md"]
      },
      {
        name: "accordion-faq",
        instances: ["#main-content > section.section:nth-of-type(5) div.faq-list"]
      },
      {
        name: "hero-overlay",
        instances: ["#main-content > section.section.inverse-section"]
      }
    ]
  };
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document.querySelectorAll(selector);
        if (elements.length === 0) {
          console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
        }
        elements.forEach((element) => {
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element,
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_homepage_default = {
    transform: (payload) => {
      const {
        document,
        url,
        html,
        params
      } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        if (!block.element.parentNode) return;
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        } else {
          console.warn(`No parser found for block: ${block.name}`);
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const rawPath = new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "");
      const path = WebImporter.FileUtils.sanitizePath(rawPath || "/index");
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_homepage_exports);
})();
