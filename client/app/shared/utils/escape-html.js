const escapeCache = new Map();

export function escapeHTML(html, context = "html") {
  if (html == null) return "";

  if (typeof html !== "string") {
    throw new TypeError("Expected a string");
  }

  const cacheKey = `${context}:${html}`;
  if (escapeCache.has(cacheKey)) {
    return escapeCache.get(cacheKey);
  }

  const escapeMap = {
    html: {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    },
    attribute: {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    },
    javascript: {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
      "/": "&#x2F;",
    },
    css: {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    },
  };

  const map = escapeMap[context] || escapeMap.html;

  const escaped = html.replace(/[&<>"'/]/g, (match) => map[match]);
  escapeCache.set(cacheKey, escaped);
  return escaped;
}
