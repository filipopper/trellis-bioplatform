export class WikiView {
  constructor({ service }) {
    this.service = service;
    this.content = document.getElementById('content');
  }

  async render({ slug }) {
    const resolvedSlug = slug || this.service.getDefaultSlug();

    const result = await this.service.loadArticle(resolvedSlug);

    if (result.kind === 'ok') {
      return this.renderArticle(result);
    }

    if (result.kind === 'not_found') {
      return this.renderNotFound(resolvedSlug);
    }

    return this.renderLoadError(resolvedSlug);
  }

  renderArticle({ meta, articleData, contentHtml }) {
    const relatedArticles = (meta.related || [])
      .map((slug) => this.service.getArticleMeta(slug))
      .filter(Boolean);

    this.content.innerHTML = `
      <div class="about-page slide-in">
        <div class="wiki-layout">

          <aside
            class="wiki-infobox"
            aria-label="Información del artículo"
          >
            <div class="wiki-infobox-title">
              <div class="wiki-infobox-avatar">
                ${
                  meta.thumbnail
                    ? `<img src="${meta.thumbnail}" alt="${articleData.title}" />`
                    : ''
                }
              </div>

              <h3>${articleData.title}</h3>

              <span class="wiki-subtitle">
                ${meta.subtitle || articleData.subtitle || ''}
              </span>
            </div>

            <div class="wiki-infobox-section">
              <div class="wiki-section-label">
                <i class="ri-article-line"></i>
                Relacionados
              </div>

              <ul class="wiki-list">
                ${
                  relatedArticles.length
                    ? relatedArticles.map((article) => `
                        <li>
                          <a
                            href="#/wiki/${article.slug}"
                            data-wiki-link="${article.slug}"
                          >
                            ${article.title}
                          </a>
                        </li>
                      `).join('')
                    : '<li>Sin relacionados</li>'
                }
              </ul>
            </div>
          </aside>

          <article class="wiki-article">
            <div class="wiki-eyebrow-row">
              <span class="wiki-eyebrow-chip">
                <i class="ri-verified-badge-line"></i>
                ${articleData.verifiedLabel || 'Artículo'}
              </span>

              <span class="wiki-eyebrow-chip wiki-chip-muted">
                ${articleData.updatedLabel || ''}
              </span>
            </div>

            <h1 class="wiki-article-title">
              ${articleData.title}
            </h1>

            <p class="wiki-article-lead">
              ${articleData.description || meta.description}
            </p>

            <nav
              class="wiki-toc"
              aria-label="Tabla de contenidos"
            >
              <div class="wiki-toc-head">
                <i class="ri-list-unordered"></i>
                Contenidos
              </div>

              <ol class="wiki-toc-list">
                ${(articleData.toc || [])
                  .map((item) => `
                    <li>
                      <a
                        href="javascript:void(0)"
                        data-scroll="${item.id}"
                      >
                        ${item.label}
                      </a>
                    </li>
                  `)
                  .join('')}
              </ol>
            </nav>

            ${contentHtml}
          </article>

        </div>
      </div>
    `;

    this.bindScrollLinks();
  }

  renderNotFound(slug) {
    this.content.innerHTML = `
      <div class="about-page slide-in">
        <article class="wiki-article">

          <h1 class="wiki-article-title">
            Artículo no encontrado
          </h1>

          <p class="wiki-article-lead">
            No existe un artículo con slug
            <strong>${slug}</strong>.
          </p>

          <a href="#/wiki/${this.service.getDefaultSlug()}">
            Ir al artículo principal
          </a>

        </article>
      </div>
    `;
  }

  renderLoadError(slug) {
    this.content.innerHTML = `
      <div class="about-page slide-in">
        <article class="wiki-article">

          <h1 class="wiki-article-title">
            Error al cargar
          </h1>

          <p class="wiki-article-lead">
            No se pudo cargar el artículo
            <strong>${slug}</strong>
            en este momento.
          </p>

          <a href="#/wiki/${this.service.getDefaultSlug()}">
            Ir al artículo principal
          </a>

        </article>
      </div>
    `;
  }

  bindScrollLinks() {
    this.content
      .querySelectorAll('.wiki-toc a[data-scroll]')
      .forEach((link) => {
        link.addEventListener('click', () => {
          const targetId = link.getAttribute('data-scroll');

          const target = this.content.querySelector(
            `#${targetId}`
          );

          target?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        });
      });
  }
}