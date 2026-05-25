import { reportError, reportWarning } from '../../core/runtime-errors.js';
import { wikiRegistry } from './registry.js';
import { resolveWikiResourceUrl } from './wiki-paths.js';

const normalize = (value = '') => value.trim().toLowerCase();

const ARTICLE_META_BY_SLUG = Object.freeze(
  wikiRegistry.articles.reduce((acc, article) => {
    acc[article.slug] = Object.freeze({ ...article });
    return acc;
  }, {})
);

const ARTICLE_TITLE_INDEX = Object.freeze(
  wikiRegistry.articles.reduce((acc, article) => {
    acc[normalize(article.title)] = article.slug;

    for (const alias of article.aliases || []) {
      acc[normalize(alias)] = article.slug;
    }

    return acc;
  }, {})
);

function parseInlineMarkdown(text = '') {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(
      /\[(.+?)\]\((.+?)\)/g,
      '<a href="$2" target="_blank" rel="noopener">$1</a>'
    );
}

function transformWikiLinks(markdown = '') {
  return markdown.replace(/\[\[([^\]]+)\]\]/g, (_match, rawLabel) => {
    const label = rawLabel.trim();
    const normalizedLabel = normalize(label);

    const slug =
      ARTICLE_META_BY_SLUG[normalizedLabel]?.slug
      || ARTICLE_TITLE_INDEX[normalizedLabel]
      || null;

    if (!slug) {
      reportWarning(
        'wiki.service.transformWikiLinks',
        'Unresolved internal wiki reference',
        { label }
      );

      return `
        <span
          class="wiki-bad-link"
          title="Referencia no encontrada"
        >
          ${label}
        </span>
      `;
    }

    return `
      <a
        href="#/wiki/${slug}"
        data-wiki-link="${slug}"
      >
        ${label}
      </a>
    `;
  });
}

function markdownToHtml(markdown = '') {
  const transformedMarkdown = transformWikiLinks(markdown);

  const lines = transformedMarkdown.split('\n');
  const blocks = [];

  let listOpen = false;

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed) {
      if (listOpen) {
        blocks.push('</ul>');
        listOpen = false;
      }

      continue;
    }

    if (/^##\s+/.test(trimmed)) {
      if (listOpen) {
        blocks.push('</ul>');
        listOpen = false;
      }

      const [, title, id] =
        trimmed.match(/^##\s+(.+?)(?:\s+\{#(.+)\})?$/) || [];

      blocks.push(
        `<section class="wiki-sec"${id ? ` id="${id}"` : ''}>`
        + `<h2 class="wiki-sec-title">${
          parseInlineMarkdown(title || '')
        }</h2>`
      );

      continue;
    }

    if (/^###\s+/.test(trimmed)) {
      const title = trimmed.replace(/^###\s+/, '');

      blocks.push(
        `<h3 class="wiki-subsec-title">${
          parseInlineMarkdown(title)
        }</h3>`
      );

      continue;
    }

    if (/^>\s+/.test(trimmed)) {
      blocks.push(
        `<div class="wiki-pullquote"><p>${
          parseInlineMarkdown(trimmed.replace(/^>\s+/, ''))
        }</p></div>`
      );

      continue;
    }

    if (/^-\s+/.test(trimmed)) {
      if (!listOpen) {
        blocks.push('<ul class="wiki-list">');
        listOpen = true;
      }

      blocks.push(
        `<li>${
          parseInlineMarkdown(trimmed.replace(/^-\s+/, ''))
        }</li>`
      );

      continue;
    }

    blocks.push(`<p>${parseInlineMarkdown(trimmed)}</p>`);
  }

  if (listOpen) {
    blocks.push('</ul>');
  }

  blocks.push('</section>');

  return blocks.join('');
}

export class WikiService {
  getDefaultSlug() {
    return wikiRegistry.defaultSlug;
  }

  getArticleList() {
    return wikiRegistry.articles.map((article) => ({ ...article }));
  }

  getArticleMeta(slug) {
    return ARTICLE_META_BY_SLUG[slug] || null;
  }

  getExploreArticles(currentSlug, limit = 6) {
    const current = this.getArticleMeta(currentSlug);

    const related = (current?.related || [])
      .map((slug) => this.getArticleMeta(slug))
      .filter(Boolean);

    const remaining = wikiRegistry.articles.filter(
      (article) =>
        article.slug !== currentSlug
        && !related.some(
          (relatedItem) => relatedItem.slug === article.slug
        )
    );

    return [
      current,
      ...related,
      ...remaining,
    ]
      .filter(Boolean)
      .slice(0, limit)
      .map((article) => ({ ...article }));
  }

  resolveInternalReference(label) {
    const normalizedLabel = normalize(label);

    return (
      ARTICLE_META_BY_SLUG[normalizedLabel]?.slug
      || ARTICLE_TITLE_INDEX[normalizedLabel]
      || null
    );
  }

  markdownToHtml(markdown = '') {
    return markdownToHtml(markdown);
  }

  buildArticleResourceUrls(slug) {
    const articleUrl = resolveWikiResourceUrl(
      slug,
      'article.json'
    );

    const contentUrl = resolveWikiResourceUrl(
      slug,
      'content.md'
    );

    return {
      articleUrl,
      contentUrl,
    };
  }

  async loadArticle(slug) {
    const normalizedSlug = slug || this.getDefaultSlug();

    const meta = this.getArticleMeta(normalizedSlug);

    if (!meta) {
      return {
        kind: 'not_found',
        slug: normalizedSlug,
      };
    }

    const {
      articleUrl,
      contentUrl,
    } = this.buildArticleResourceUrls(normalizedSlug);

    if (!articleUrl || !contentUrl) {
      reportWarning(
        'wiki.service.loadArticle',
        'Wiki resource URL resolution failed',
        {
          slug: normalizedSlug,
          articleUrl,
          contentUrl,
        }
      );

      return {
        kind: 'error',
        slug: normalizedSlug,
        meta,
      };
    }

    try {
      const [articleRes, contentRes] = await Promise.all([
        fetch(articleUrl),
        fetch(contentUrl),
      ]);

      if (!articleRes.ok || !contentRes.ok) {
        reportWarning(
          'wiki.service.loadArticle',
          'Article resource returned non-OK status',
          {
            slug: normalizedSlug,
            articleStatus: articleRes.status,
            contentStatus: contentRes.status,
            articleUrl,
            contentUrl,
          }
        );

        return {
          kind: 'error',
          slug: normalizedSlug,
          meta,
        };
      }

      let articleData;

      try {
        articleData = await articleRes.json();
      } catch (error) {
        reportError(
          'wiki.service.loadArticle.parseArticleJson',
          error,
          {
            slug: normalizedSlug,
            articleUrl,
          }
        );

        return {
          kind: 'error',
          slug: normalizedSlug,
          meta,
        };
      }

      let markdown;

      try {
        markdown = await contentRes.text();
      } catch (error) {
        reportError(
          'wiki.service.loadArticle.readContentMarkdown',
          error,
          {
            slug: normalizedSlug,
            contentUrl,
          }
        );

        return {
          kind: 'error',
          slug: normalizedSlug,
          meta,
        };
      }

      return {
        kind: 'ok',
        slug: normalizedSlug,
        meta,
        articleData,
        contentHtml: this.markdownToHtml(markdown),
      };
    } catch (error) {
      reportError(
        'wiki.service.loadArticle.fetchResources',
        error,
        {
          slug: normalizedSlug,
          articleUrl,
          contentUrl,
        }
      );

      return {
        kind: 'error',
        slug: normalizedSlug,
        meta,
      };
    }
  }
}