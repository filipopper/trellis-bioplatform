import { reportError, reportWarning } from '../../core/runtime-errors.js';
import { wikiRegistry } from './registry.js';

const ARTICLE_META_BY_SLUG = Object.freeze(
  wikiRegistry.articles.reduce((acc, item) => {
    acc[item.slug] = Object.freeze({ ...item });
    return acc;
  }, {})
);

function parseInlineMarkdown(text = '') {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
}

function markdownToHtml(markdown = '') {
  const lines = markdown.split('\n');
  const blocks = [];
  let listOpen = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      if (listOpen) { blocks.push('</ul>'); listOpen = false; }
      continue;
    }

    if (/^##\s+/.test(trimmed)) {
      if (listOpen) { blocks.push('</ul>'); listOpen = false; }
      const [, title, id] = trimmed.match(/^##\s+(.+?)(?:\s+\{#(.+)\})?$/) || [];
      blocks.push(`<section class="wiki-sec"${id ? ` id="${id}"` : ''}><h2 class="wiki-sec-title">${parseInlineMarkdown(title || '')}</h2>`);
      continue;
    }

    if (/^###\s+/.test(trimmed)) {
      const title = trimmed.replace(/^###\s+/, '');
      blocks.push(`<h3 class="wiki-subsec-title">${parseInlineMarkdown(title)}</h3>`);
      continue;
    }

    if (/^>\s+/.test(trimmed)) {
      blocks.push(`<div class="wiki-pullquote"><p>${parseInlineMarkdown(trimmed.replace(/^>\s+/, ''))}</p></div>`);
      continue;
    }

    if (/^-\s+/.test(trimmed)) {
      if (!listOpen) { blocks.push('<ul class="wiki-list">'); listOpen = true; }
      blocks.push(`<li>${parseInlineMarkdown(trimmed.replace(/^-\s+/, ''))}</li>`);
      continue;
    }

    blocks.push(`<p>${parseInlineMarkdown(trimmed)}</p>`);
  }

  if (listOpen) blocks.push('</ul>');
  blocks.push('</section>');
  return blocks.join('');
}

export class WikiService {
  getArticleList() {
    return wikiRegistry.articles.map((item) => ({ ...item }));
  }

  getArticleMeta(slug) {
    return ARTICLE_META_BY_SLUG[slug] || null;
  }

  async loadArticle(slug) {
    const meta = this.getArticleMeta(slug);
    if (!meta) return { kind: 'not_found', slug };

    try {
      const [articleRes, contentRes] = await Promise.all([
        fetch(meta.dataPath),
        fetch(meta.contentPath),
      ]);

      if (!articleRes.ok || !contentRes.ok) {
        reportWarning('wiki.service.loadArticle', 'Article resource returned non-OK status', { slug, articleStatus: articleRes.status, contentStatus: contentRes.status });
        return { kind: 'error', slug, meta };
      }

      const articleData = await articleRes.json();
      const markdown = await contentRes.text();
      return { kind: 'ok', slug, meta, articleData, contentHtml: markdownToHtml(markdown) };
    } catch (error) {
      reportError('wiki.service.loadArticle', error, { slug });
      return { kind: 'error', slug, meta };
    }
  }
}
