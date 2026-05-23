export class WikiView {
  constructor({ service }) {
    this.service = service;
    this.content = document.getElementById('content');
  }

  async render({ slug }) {
    if (!slug) {
      this.renderList();
      return;
    }

    const result = await this.service.loadArticle(slug);
    if (result.kind === 'ok') return this.renderArticle(result);
    if (result.kind === 'not_found') return this.renderNotFound(slug);
    return this.renderLoadError(slug);
  }

  renderList() {
    const articles = this.service.getArticleList();
    this.content.innerHTML = `<div class="about-page slide-in"><div class="wiki-layout"><article class="wiki-article"><h1 class="wiki-article-title">Wiki</h1><p class="wiki-article-lead">Artículos disponibles.</p><ul class="wiki-list">${articles.map((a) => `<li><a href="#/wiki/${a.slug}">${a.title}</a> — ${a.description}</li>`).join('')}</ul></article></div></div>`;
  }

  renderArticle({ meta, articleData, contentHtml }) {
    this.content.innerHTML = `<div class="about-page slide-in"><div class="wiki-layout"><aside class="wiki-infobox"><div class="wiki-infobox-title"><div class="wiki-infobox-avatar">${meta.thumbnail ? `<img src="${meta.thumbnail}" alt="${articleData.title}" />` : ''}</div><h3>${articleData.title}</h3><span class="wiki-subtitle">${articleData.subtitle || ''}</span></div><div class="wiki-infobox-section"><div class="wiki-section-label"><i class="ri-article-line"></i> Navegación</div><ul class="wiki-list"><li><a href="#/wiki">Ver todos los artículos</a></li></ul></div></aside><article class="wiki-article"><div class="wiki-eyebrow-row"><span class="wiki-eyebrow-chip"><i class="ri-verified-badge-line"></i> ${articleData.verifiedLabel || ''}</span><span class="wiki-eyebrow-chip wiki-chip-muted">${articleData.updatedLabel || ''}</span></div><h1 class="wiki-article-title">${articleData.title}</h1><p class="wiki-article-lead">${articleData.description || meta.description}</p><nav class="wiki-toc" aria-label="Tabla de contenidos"><div class="wiki-toc-head"><i class="ri-list-unordered"></i> Contenidos</div><ol class="wiki-toc-list">${(articleData.toc || []).map((x) => `<li><a href="javascript:void(0)" data-scroll="${x.id}">${x.label}</a></li>`).join('')}</ol></nav>${contentHtml}</article></div></div>`;
    this.bindScrollLinks();
  }

  renderNotFound(slug) { this.content.innerHTML = `<div class="about-page slide-in"><article class="wiki-article"><h1 class="wiki-article-title">Artículo no encontrado</h1><p class="wiki-article-lead">No existe un artículo con slug <strong>${slug}</strong>.</p><a href="#/wiki">Volver al índice wiki</a></article></div>`; }
  renderLoadError(slug) { this.content.innerHTML = `<div class="about-page slide-in"><article class="wiki-article"><h1 class="wiki-article-title">Error al cargar</h1><p class="wiki-article-lead">No se pudo cargar el artículo <strong>${slug}</strong> en este momento.</p><a href="#/wiki">Volver al índice wiki</a></article></div>`; }

  bindScrollLinks() {
    this.content.querySelectorAll('.wiki-toc a[data-scroll]').forEach((a) => {
      a.addEventListener('click', () => {
        const id = a.getAttribute('data-scroll');
        const target = this.content.querySelector(`#${id}`);
        target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }
}
