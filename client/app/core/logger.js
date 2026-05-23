const isLocalhost = typeof location !== 'undefined' && /^(localhost|127\.0\.0\.1)$/.test(location.hostname);
const debugEnabled = isLocalhost || (typeof localStorage !== 'undefined' && localStorage.getItem('debug') === '1');

function emit(level, scope, message, meta) {
  const payload = meta ? [message, meta] : [message];
  // eslint-disable-next-line no-console
  console[level](`[${scope}]`, ...payload);
}

export const logger = {
  debug(scope, message, meta) {
    if (!debugEnabled) return;
    emit('debug', scope, message, meta);
  },
  info(scope, message, meta) {
    if (!debugEnabled) return;
    emit('info', scope, message, meta);
  },
  warn(scope, message, meta) {
    emit('warn', scope, message, meta);
  },
  error(scope, message, meta) {
    emit('error', scope, message, meta);
  },
};
