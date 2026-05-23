import { reportError, reportWarning } from '../runtime-errors.js';

const FEATURE_MODULES = Object.freeze({
  home: '../../features/home/controller.js',
  news: '../../features/news/controller.js',
  about: '../../features/about/controller.js',
  contact: '../../features/contact/controller.js',
  store: '../../features/store/controller.js',
  proposals: '../../features/proposals/controller.js',
  join: '../../features/join/controller.js',
  poll: '../../features/polls/controller.js',
});

const FEATURE_EXPORTS = Object.freeze({
  home: 'HomeController',
  news: 'NewsController',
  about: 'AboutController',
  contact: 'ContactController',
  store: 'StoreController',
  proposals: 'ProposalsController',
  join: 'JoinController',
  poll: 'PollController',
});

function resolveFeaturePath(viewId) {
  const target = FEATURE_MODULES[viewId];

  if (!target) {
    reportWarning('feature-resolver.resolveFeaturePath', 'Unknown feature requested. Falling back to home.', { viewId });
    return FEATURE_MODULES.home;
  }

  return target;
}

export function validateFeatureMap() {
  const errors = [];

  for (const [viewId, importPath] of Object.entries(FEATURE_MODULES)) {
    if (importPath.includes('/core/features/')) {
      errors.push({ viewId, importPath, reason: 'stale core/features path detected' });
    }

    if (!importPath.startsWith('../../features/')) {
      errors.push({ viewId, importPath, reason: 'feature path must stay inside client/app/features' });
    }

    if (!FEATURE_EXPORTS[viewId]) {
      errors.push({ viewId, importPath, reason: 'missing controller export mapping' });
    }
  }

  if (errors.length) {
    const err = new Error('Invalid feature map configuration');
    reportError('feature-resolver.validateFeatureMap', err, { errors });
    throw err;
  }
}

export async function loadFeatureController(viewId) {
  const resolvedViewId = FEATURE_MODULES[viewId] ? viewId : 'home';
  const importPath = resolveFeaturePath(viewId);
  const exportName = FEATURE_EXPORTS[resolvedViewId];

  try {
    const mod = await import(importPath);
    const ControllerClass = mod?.[exportName];

    if (typeof ControllerClass !== 'function') {
      throw new Error(`Controller export \"${exportName}\" was not found in ${importPath}`);
    }

    return { ControllerClass, resolvedViewId, importPath };
  } catch (error) {
    reportError('feature-resolver.loadFeatureController', error, {
      requestedViewId: viewId,
      resolvedViewId,
      importPath,
      exportName,
    });

    throw new Error(`Feature module load failed for view \"${resolvedViewId}\" at \"${importPath}\"`);
  }
}

export const featureResolutionConfig = Object.freeze({
  modules: FEATURE_MODULES,
  exports: FEATURE_EXPORTS,
});
