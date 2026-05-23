import { Model } from '../state/model.js';
import { viewRegistry } from './router/view-registry.js';
import { urgencyBannerConfig } from '../features/urgency-banner/config.js';
import { UrgencyBannerManager } from '../features/urgency-banner/component.js';
import { HashRouter } from './router/hash-router.js';
import {
  reportError,
  reportWarning,
  safeAsync,
  assertFunction
} from './runtime-errors.js';
import { logger } from './logger.js';

export class AppShell {
  constructor({
    registry = viewRegistry,
    modelFactory = () => new Model()
  } = {}) {
    this.registry = registry;
    this.modelFactory = modelFactory;

    this.abortController = new AbortController();

    this.router = new HashRouter({
      defaultView: 'home',
      onRouteChange: (route) => this.renderRoute(route),
    });
  }

  init() {
    document.body.classList.add('loaded');

    new UrgencyBannerManager(
      urgencyBannerConfig
    ).init();

    document.addEventListener(
      'click',
      this.handleNavigationClick,
      { signal: this.abortController.signal }
    );

    this.router.init();

    this.updateActiveNav();

    logger.info(
      'app-shell.init',
      'Application initialized'
    );
  }

  dispose() {
    this.abortController.abort();
    this.router.dispose();
  }

  handleNavigationClick = (e) => {
    const a = e.target.closest('a[data-view]');

    if (!a) return;

    e.preventDefault();

    const view = a.getAttribute('data-view');

    if (!view) {
      return reportWarning(
        'app-shell.nav',
        'Navigation element without data-view'
      );
    }

    this.router.navigate(view);
  };

  async renderRoute({ viewId, postId }) {
    const content = document.getElementById('content');

    if (!content) return;

    const t0 = performance.now();

    this.prepareTransition(content);

    await this.waitForScrollSettle();

    this.resetTransition(content);

    const fallbackView = this.registry.defaultView || 'home';

    let resolved = null;

    try {
      resolved = await this.registry.resolve(viewId);
    } catch (error) {
      reportError('app-shell.resolveRoute', error, { viewId, fallbackView });
      resolved = await this.registry.resolve(fallbackView);
    }

    const resolvedViewId = resolved?.resolvedViewId || fallbackView;
    const ControllerClass = resolved?.ControllerClass;

    if (typeof ControllerClass !== 'function') {
      reportError('app-shell.renderRoute', new Error('Missing resolved controller class'), { viewId, resolvedViewId });
      return;
    }

    const model = this.modelFactory();

    const controller = new ControllerClass(model);

    const init = assertFunction(
      controller?.init,
      'controller.init'
    );

    if (!init) {
      reportError(
        'app-shell.renderRoute',
        new Error('Controller without init()'),
        { viewId: resolvedViewId }
      );

      return;
    }

    if (resolvedViewId === 'news' && postId) {
      const item = await safeAsync(
        'model.getNewsById',
        () => model.getNewsById(postId),
        null,
        { postId }
      );

      if (item && controller?.view?.render) {
        controller.view.render(item);
      } else {
        await safeAsync(
          'controller.init',
          () => init.call(controller),
          null,
          { viewId: resolvedViewId }
        );
      }
    } else {
      await safeAsync(
        'controller.init',
        () => init.call(controller),
        null,
        { viewId: resolvedViewId }
      );
    }

    this.updateActiveNav();

    logger.debug(
      'app-shell.renderRoute',
      'Route rendered',
      {
        viewId: resolvedViewId,
        ms: Math.round(
          performance.now() - t0
        ),
      }
    );

    requestAnimationFrame(() => {
      document.body.style.overflow = '';
    });
  }

  prepareTransition(content) {
    document.body.style.overflow = 'hidden';

    content.style.transition =
      'opacity 0.15s ease';

    content.style.opacity = '0';

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  async waitForScrollSettle() {
    await new Promise((resolve) => {
      const start = performance.now();

      const check = () => {
        const elapsed =
          performance.now() - start;

        if (
          window.scrollY < 2 ||
          elapsed > 300
        ) {
          return resolve();
        }

        requestAnimationFrame(check);
      };

      requestAnimationFrame(check);
    });
  }

  resetTransition(content) {
    content.style.transition = '';
    content.style.opacity = '';

    content.classList.remove(
      'slide-in',
      'fade-in'
    );

    void content.offsetWidth;

    content.classList.add('slide-in');
  }

  updateActiveNav() {
    const view =
      this.router.parse().viewId ||
      'home';

    document
      .querySelectorAll(
        '#nav-links a[data-view]'
      )
      .forEach((a) =>
        a.classList.toggle(
          'active',
          a.getAttribute('data-view') === view
        )
      );
  }
}