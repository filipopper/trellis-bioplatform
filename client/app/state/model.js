export class Model {
  constructor(postsDir = "./posts") {
    this.postsDir = postsDir.endsWith("/") ? postsDir.slice(0, -1) : postsDir;
  }

  async loadJsonFile(filePath) {
    try {
      const r = await fetch(filePath);
      if (!r.ok) throw new Error(`${r.status}`);
      return await r.json();
    } catch (e) {
      console.error("JSON load error:", filePath, e);
      return null;
    }
  }

  async loadTextFile(filePath) {
    try {
      const r = await fetch(filePath);
      if (!r.ok) throw new Error(`${r.status}`);
      return await r.text();
    } catch (e) {
      console.error("Text load error:", filePath, e);
      return "";
    }
  }

  async _getIndex() {
    const raw = await this.loadJsonFile(`${this.postsDir}/index.json`);
    if (!raw) return { posts: [], urgencyBanner: null };
    // Support both old format (array) and new format (object)
    if (Array.isArray(raw)) return { posts: raw, urgencyBanner: null };
    return {
      posts: raw.posts || [],
      urgencyBanner: raw.urgencyBanner || null,
    };
  }

  async getNews() {
    const { posts } = await this._getIndex();
    const news = [];

    for (const post of posts) {
      try {
        const article   = await this.loadJsonFile(`${this.postsDir}/${post}/article.json`);
        const content   = await this.loadTextFile(`${this.postsDir}/${post}/content.md`);
        const thumbnail = `${this.postsDir}/${post}/thumbnail.jpg`;
        if (!article?.title || !article?.description) continue;
        news.push({ ...article, content, thumbnail, id: post, tags: article.tags || [] });
      } catch (e) {
        console.error(`Error loading post ${post}:`, e);
      }
    }

    return news.sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  async getNewsById(id) {
    try {
      const article   = await this.loadJsonFile(`${this.postsDir}/${id}/article.json`);
      const content   = await this.loadTextFile(`${this.postsDir}/${id}/content.md`);
      const thumbnail = `${this.postsDir}/${id}/thumbnail.jpg`;
      if (!article?.title) return null;
      return { ...article, content, thumbnail, id, tags: article.tags || [] };
    } catch (e) {
      console.error(`Error loading post ${id}:`, e);
      return null;
    }
  }

  async getUrgencyBanner() {
    const { urgencyBanner } = await this._getIndex();
    if (!urgencyBanner?.active) return null;
    // Check expiry
    if (urgencyBanner.expiresAt) {
      // Parse as end of day in local time to avoid UTC midnight issues
      const [y, m, d] = urgencyBanner.expiresAt.split("-").map(Number);
      const expires = new Date(y, m - 1, d, 23, 59, 59);
      if (expires < new Date()) return null;
    }
    return urgencyBanner;
  }
}
