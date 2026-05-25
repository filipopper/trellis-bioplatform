import { reportError, reportWarning } from '../../core/runtime-errors.js';
import { wikiRegistry } from './registry.js';

const normalize = (value = '') => value.trim().toLowerCase();

const registryIndex = wikiRegistry.articles.reduce((acc, article) => {
  acc.bySlug[article.slug] = Object.freeze({ ...article });
  acc.byTitle[normalize(article.title)] = article.slug;
  for (const alias of article.aliases || []) acc.byTitle[normalize(alias)] = article.slug;
  return acc;
}, { bySlug: {}, byTitle: {} });

function parseInlineMarkdown(text = '') {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
}

export class WikiService {
  getDefaultSlug() { return wikiRegistry.defaultSlug; }
  getArticleMeta(slug) { return registryIndex.bySlug[slug] || null; }
  getExploreArticles(currentSlug, limit = 6) {
    const current = this.getArticleMeta(currentSlug);
    const related = (current?.related || []).map((slug) => this.getArticleMeta(slug)).filter(Boolean);
    const rest = wikiRegistry.articles.filter((item) => item.slug !== currentSlug && !related.some((r) => r.slug === item.slug));
    return [current, ...related, ...rest].filter(Boolean).slice(0, limit).map((item) => ({ ...item }));
  }

  resolveInternalReference(label) {
    const normalized = normalize(label);
    return registryIndex.bySlug[normalized]?.slug || registryIndex.byTitle[normalized] || null;
  }

  transformWikiLinks(markdown = '') {
    return markdown.replace(/\[\[([^\]]+)\]\]/g, (_m, rawLabel) => {
      const label = rawLabel.trim();
      const slug = this.resolveInternalReference(label);

      if (!slug) {
        reportWarning('wiki.service.transformWikiLinks', 'Unresolved internal wiki reference', { label });
        return `<span class="wiki-bad-link" title="Referencia no encontrada">${label}</span>`;
      }

      return `<a href="#/wiki/${slug}" data-wiki-link="${slug}">${label}</a>`;
    });
  }

  markdownToHtml(markdown = '') {
    const input = this.transformWikiLinks(markdown);
    const lines = input.split('\n');
    const blocks = [];
    let listOpen = false;

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) { if (listOpen) { blocks.push('</ul>'); listOpen = false; } continue; }
      if (/^##\s+/.test(trimmed)) {
        if (listOpen) { blocks.push('</ul>'); listOpen = false; }
        const [, title, id] = trimmed.match(/^##\s+(.+?)(?:\s+\{#(.+)\})?$/) || [];
        blocks.push(`<section class="wiki-sec"${id ? ` id="${id}"` : ''}><h2 class="wiki-sec-title">${parseInlineMarkdown(title || '')}</h2>`);
        continue;
      }
      if (/^###\s+/.test(trimmed)) { blocks.push(`<h3 class="wiki-subsec-title">${parseInlineMarkdown(trimmed.replace(/^###\s+/, ''))}</h3>`); continue; }
      if (/^>\s+/.test(trimmed)) { blocks.push(`<div class="wiki-pullquote"><p>${parseInlineMarkdown(trimmed.replace(/^>\s+/, ''))}</p></div>`); continue; }
      if (/^-\s+/.test(trimmed)) { if (!listOpen) { blocks.push('<ul class="wiki-list">'); listOpen = true; } blocks.push(`<li>${parseInlineMarkdown(trimmed.replace(/^-\s+/, ''))}</li>`); continue; }
      blocks.push(`<p>${parseInlineMarkdown(trimmed)}</p>`);
    }
    if (listOpen) blocks.push('</ul>');
    blocks.push('</section>');
    return blocks.join('');
  }

  async loadArticle(slug) {
    const normalizedSlug = slug || this.getDefaultSlug();
    const meta = this.getArticleMeta(normalizedSlug);
    if (!meta) return { kind: 'not_found', slug: normalizedSlug };
    try {
      const [articleRes, contentRes] = await Promise.all([fetch(meta.dataPath), fetch(meta.contentPath)]);
      if (!articleRes.ok || !contentRes.ok) {
        reportWarning('wiki.service.loadArticle', 'Article resource returned non-OK status', { slug: normalizedSlug, articleStatus: articleRes.status, contentStatus: contentRes.status });
        return { kind: 'error', slug: normalizedSlug, meta };
      }
      const articleData = await articleRes.json();
      const markdown = await contentRes.text();
      return { kind: 'ok', slug: normalizedSlug, meta, articleData, contentHtml: this.markdownToHtml(markdown) };
    } catch (error) {
      reportError('wiki.service.loadArticle', error, { slug: normalizedSlug });
      return { kind: 'error', slug: normalizedSlug, meta };
    }
  }
}
