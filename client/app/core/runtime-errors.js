import { logger } from './logger.js';

export function reportError(
  scope,
  error,
  context = {}
) {
  const payload = {
    scope,
    message: error?.message || String(error),
    context,
  };

  logger.error(
    scope,
    payload.message,
    payload
  );
}

export function reportWarning(
  scope,
  message,
  context = {}
) {
  logger.warn(
    scope,
    message,
    context
  );
}

export async function safeAsync(
  scope,
  fn,
  fallback = null,
  context = {}
) {
  try {
    return await fn();
  } catch (error) {
    reportError(
      scope,
      error,
      context
    );

    return fallback;
  }
}

export function assertFunction(
  value,
  label
) {
  if (typeof value === 'function') {
    return value;
  }

  reportWarning(
    'contracts.assertFunction',
    `Missing function contract: ${label}`
  );

  return null;
}