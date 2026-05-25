import { reportError, reportWarning } from '../../core/runtime-errors.js';

const WIKI_ARTICLES_BASE_URL = new URL('./articles/', import.meta.url);

function isSafeSlug(slug = '') {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

export function resolveWikiResourceUrl(slug, fileName) {
  if (!isSafeSlug(slug)) {
    reportWarning('wiki.paths.resolveWikiResourceUrl', 'Invalid wiki slug for resource resolution', { slug, fileName });
    return null;
  }

  if (!fileName || fileName.includes('..') || fileName.includes('/')) {
    reportWarning('wiki.paths.resolveWikiResourceUrl', 'Invalid wiki resource file name', { slug, fileName });
    return null;
  }

  try {
    return new URL(`${slug}/${fileName}`, WIKI_ARTICLES_BASE_URL).href;
  } catch (error) {
    reportError('wiki.paths.resolveWikiResourceUrl', error, { slug, fileName });
    return null;
  }
}
