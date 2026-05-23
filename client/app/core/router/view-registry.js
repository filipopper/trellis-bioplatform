import {
  loadFeatureController,
  validateFeatureMap,
  featureResolutionConfig,
} from './feature-resolver.js';

validateFeatureMap();

export const viewRegistry = {
  defaultView: 'home',
  featureResolutionConfig,
  async resolve(viewId) {
    return loadFeatureController(viewId);
  },
};
