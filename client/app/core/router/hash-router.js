import { reportError } from '../runtime-errors.js';

export class HashRouter {
  constructor({ defaultView = 'home', onRouteChange }) {
    this.defaultView = defaultView;
    this.onRouteChange = onRouteChange;
    this.lastNormalizedHash = '';
    this.isInitialized = false;
  }

  init() {
    if (this.isInitialized) return;
    this.isInitialized = true;
    this.lastNormalizedHash = this.normalizeHash();
    this.loadFromLocation();
    window.addEventListener('hashchange', this.handleHashChange);
  }

  dispose() {
    if (!this.isInitialized) return;
    this.isInitialized = false;
    window.removeEventListener('hashchange', this.handleHashChange);
  }

  navigate(viewId, postId = '') {
    location.hash = `#/${viewId}${postId ? `/${postId}` : ''}`;
  }

  normalizeHash(rawHash = location.hash) {
    return rawHash.endsWith('#pic') ? rawHash.slice(0, -4) : rawHash;
  }

  parse(hash = this.normalizeHash()) {
    let path = hash.replace(/^#\/?/, '');
    if (!path) path = this.defaultView;
    const [viewId, postId] = path.split('/');
    return { viewId, postId };
  }

  loadFromLocation() {
    try {
      this.onRouteChange?.(this.parse());
    } catch (error) {
      reportError('router.loadFromLocation', error);
    }
  }

  handleHashChange = () => {
    const currentNormalizedHash = this.normalizeHash();
    if (currentNormalizedHash !== this.lastNormalizedHash) {
      this.lastNormalizedHash = currentNormalizedHash;
      this.loadFromLocation();
    }
  };
}
