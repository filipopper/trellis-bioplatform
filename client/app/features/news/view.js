import { View } from "../../foundation/view.js";

const TAG_COLORS = {
  actualidad: "tag-slate", // noticias recientes
  eventos: "tag-emerald", // actos, reuniones, iniciativas
  actos: "tag-teal", // actos formales o efemérides
  efemerides: "tag-amber", // fechas históricas o conmemorativas
  opinion: "tag-violet", // columnas, análisis o comentarios
  proyectos: "tag-crimson", // propuestas o planes del movimiento
  propuestas: "tag-crimson", // ideas específicas
  sociedad: "tag-teal", // impacto social o comunitario
  economía: "tag-amber", // economía y mercado
  desarrollo: "tag-emerald", // iniciativas de crecimiento o innovación
  cultura: "tag-amber", // actividades culturales, tradiciones
  tecnologia: "tag-emerald", // avances, digitalización, innovación técnica
};
const tc = (t) => TAG_COLORS[t.toLowerCase()] || "tag-slate";

export class NewsView extends View {
  constructor() {
    super();
    this._all = [];
  }

  render(data) {
    if (!data || typeof data !== "object") {
      this.content.innerHTML = "<p>Error.</p>";
      return;
    }
    Array.isArray(data) ? this._list(data) : this._single(data);
  }

  _list(list) {
    this._all = list;
    const ef = this._efemeride();

    this.content.innerHTML = `
      <!-- Métricas -->
      <div class="metrics-row stagger-item">
        <div class="metric-card accent-crimson">
          <div class="metric-label">Seguidores totales</div>
          <div class="metric-value c-crimson">47.2K</div>
          <div class="metric-delta"><i class="ri-arrow-up-line" aria-hidden="true"></i> +12% este mes</div>
        </div>
        <div class="metric-card accent-emerald">
          <div class="metric-label">Artículos publicados</div>
          <div class="metric-value c-emerald">${list.length}</div>
          <div class="metric-delta"><i class="ri-article-line" aria-hidden="true"></i> Contenido original</div>
        </div>
        <div class="metric-card accent-slate">
          <div class="metric-label">Período activo</div>
          <div class="metric-value">2025</div>
          <div class="metric-delta" style="color:var(--s-mid)"><i class="ri-government-line" aria-hidden="true"></i> Concejal de Canelones</div>
        </div>
      </div>

      <!-- Banner anuncio -->
      <div class="announcement-banner stagger-item">
        <div class="announcement-banner-icon"><i class="ri-megaphone-line" aria-hidden="true"></i></div>
        <div class="announcement-banner-content">
          <span class="announcement-banner-label">Comunicado oficial</span>
          <p class="announcement-banner-text">Nicolás Filipovich asumió como <strong>Concejal del Municipio de Canelones</strong> el 10 de julio de 2025 para el período 2025–2030, ejerciendo la función totalmente ad honórem.</p>
        </div>
        <a href="#" data-view="about" class="announcement-banner-cta">Ver perfil <i class="ri-arrow-right-line" aria-hidden="true"></i></a>
      </div>

      <!-- Declaración editorial -->
      <div class="announcement slide-in">
        <h3>Declaración editorial</h3>
          <p>
    El presente espacio editorial contiene publicaciones desarrolladas por un equipo de <strong>periodistas independientes</strong>, con el propósito de documentar, analizar y difundir actividades, propuestas y acciones vinculadas a nuestro movimiento político.
  </p>
    <p>
  Los contenidos publicados en este espacio reflejan las perspectivas de personas que adhieren al proyecto, sin que ello implique subordinación a intereses <strong>partidarios externos</strong>, <strong>corporativos</strong> o <strong>institucionales</strong> ajenos a la organización. Toda producción se realiza bajo criterios de <strong>transparencia</strong>, <strong>integridad</strong> y <strong>objetividad</strong>, asegurando que la información difundida cumpla con estándares profesionales de comunicación política y periodismo ético.
  </p>
  <p>
  Los artículos pueden incluir análisis, opiniones o interpretaciones propias de quienes los redactan, siempre enmarcados en el compromiso de contribuir al debate público y a la construcción de una ciudadanía más informada y participativa. Este espacio editorial también permite compartir de manera clara los valores, principios y propuestas que guían el proyecto político, con un enfoque en políticas y acciones más que en individuos.
  </p>
  <p>
  Invitamos a la ciudadanía a leer, reflexionar y participar activamente en la difusión de estos contenidos, fortaleciendo el diálogo democrático y promoviendo una mayor comprensión de nuestras iniciativas y visión política. La transparencia y la comunicación abierta son pilares fundamentales para construir una relación de confianza con la sociedad, y este espacio editorial constituye un canal clave para ese propósito.
  </p>
      </div>

      ${ef ? `<div class="efemeride-banner stagger-item">Hoy se conmemora:${ef.map((t) => `<span class="tag tag-amber">${t}</span>`).join("")}</div>` : ""}

      <!-- Buscador + filtro -->
      <div class="news-controls">
        <div class="news-search-wrap">
          <i class="ri-search-line" aria-hidden="true"></i>
          <input
            type="search"
            id="news-search"
            class="news-search"
            placeholder="Buscar artículos…"
            aria-label="Buscar artículos"
            autocomplete="off"
          />
          <button class="news-search-clear hidden" id="news-search-clear" aria-label="Limpiar búsqueda">
            <i class="ri-close-line" aria-hidden="true"></i>
          </button>
        </div>
        <div class="tags-filter" role="group" aria-label="Filtrar por categoría">
          <button class="tag tag-slate filter-active" data-tag="all">Todos</button>
          ${[...new Set(list.flatMap((n) => n.tags || []))]
            .map(
              (t) =>
                `<button class="tag ${tc(t)}" data-tag="${t}">${t}</button>`,
            )
            .join("")}
        </div>
      </div>

      <!-- Resultados -->
      <div class="news-results-count" id="news-count" aria-live="polite"></div>
      <div class="news-grid" id="news-grid">
        ${this._renderGrid(list)}
      </div>
    `;

    this._bindSearch();
  }

  _renderGrid(list) {
    if (!list.length)
      return `<div class="news-empty"><i class="ri-search-line" aria-hidden="true"></i><p>No se encontraron artículos.</p></div>`;
    return list
      .map((n) => {
        const tags = n.tags || [];
        const date = new Date(n.date).toLocaleDateString("es-UY", {
          day: "numeric",
          month: "short",
          year: "numeric",
        });
        const cat = tags[0]
          ? tags[0].charAt(0).toUpperCase() + tags[0].slice(1)
          : "General";
        return `
        <article class="news-item stagger-item">
          <div class="news-card-header">
            <span class="news-card-category">${cat}</span>
            <span class="news-card-date">${date}</span>
          </div>
          <img src="${n.thumbnail || ""}" alt="${n.title}" loading="lazy" onerror="this.closest('img')?.remove()" />
          <h4>${n.title}</h4>
          <p>${n.description}</p>
          <div class="news-meta">
            <div class="tags">${tags.map((t) => `<span class="tag ${tc(t)}">${t}</span>`).join("")}</div>
            <a href="#/news/${n.id}" class="read-more" data-id="${n.id}">Leer artículo</a>
          </div>
        </article>`;
      })
      .join("");
  }

  _bindSearch() {
    const input = document.getElementById("news-search");
    const clear = document.getElementById("news-search-clear");
    const grid = document.getElementById("news-grid");
    const count = document.getElementById("news-count");
    let activeCat = "all";

    const filter = () => {
      const q = input.value.trim().toLowerCase();
      clear.classList.toggle("hidden", !q);
      const filtered = this._all.filter((n) => {
        const matchCat =
          activeCat === "all" || (n.tags || []).includes(activeCat);
        const matchQ =
          !q ||
          n.title.toLowerCase().includes(q) ||
          n.description.toLowerCase().includes(q) ||
          (n.tags || []).some((t) => t.toLowerCase().includes(q));
        return matchCat && matchQ;
      });
      grid.innerHTML = this._renderGrid(filtered);
      count.textContent =
        filtered.length < this._all.length
          ? `${filtered.length} resultado${filtered.length !== 1 ? "s" : ""} encontrado${filtered.length !== 1 ? "s" : ""}`
          : "";
      this._bindReadMore();
    };

    input.addEventListener("input", filter);
    clear.addEventListener("click", () => {
      input.value = "";
      filter();
      input.focus();
    });

    document
      .querySelectorAll(".tags-filter button[data-tag]")
      .forEach((btn) => {
        btn.addEventListener("click", () => {
          document
            .querySelectorAll(".tags-filter button")
            .forEach((b) => b.classList.remove("filter-active"));
          btn.classList.add("filter-active");
          activeCat = btn.dataset.tag;
          filter();
        });
      });

    this._bindReadMore();
  }

  _single(n) {
    if (!n.title || !n.content) {
      this.content.innerHTML = "<p>Artículo incompleto.</p>";
      return;
    }
    const html = marked.parse(n.content);
    const tags = n.tags || [];
    const date = new Date(n.date).toLocaleDateString("es-UY", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    const TM = {
      actualidad: "Actualidad",
      eventos: "Eventos",
      actos: "Actos",
      efemerides: "Efemérides",
      opinion: "Opinión",
      proyectos: "Proyectos",
      propuestas: "Propuestas",
      sociedad: "Sociedad",
      economia: "Economía",
      desarrollo: "Desarrollo",
      cultura: "Cultura",
    };

    let label = "General";
    for (let k in TM) {
      if (tags.map((t) => t.toLowerCase()).includes(k)) {
        label = TM[k];
        break;
      }
    }
    this.content.innerHTML = `
      <article class="news-detail slide-in">
        <div class="news-detail-header">
          <span class="news-card-category">${label}</span>
          <span class="date">${date}</span>
        </div>
        <div class="content">${html}</div>
        <div class="news-meta">
          <div class="tags">${tags.map((t) => `<span class="tag ${tc(t)}">${t}</span>`).join("")}</div>
        </div>
      </article>`;
  }

  _efemeride() {
    const D = [
      { d: "01/01", t: "Año nuevo" },
      { d: "20/01", t: "Cumpleaños Alexandra 🎂" },
      { d: "07/04", t: "Aniversario Filipovich-Callejas 💕" },
      { d: "19/04", t: "Desembarco 33 Orientales" },
      { d: "01/05", t: "Día del Trabajador" },
      { d: "18/05", t: "Batalla de Las Piedras" },
      { d: "19/06", t: "Natalicio Artigas" },
      { d: "24/06", t: "Cumpleaños Nicolás 🎂" },
      { d: "18/07", t: "Jura de la Constitución" },
      { d: "25/08", t: "Independencia" },
      { d: "31/10", t: "Halloween 🎃" },
      { d: "25/12", t: "Navidad 🎄" },
    ];
    const fmt = new Date().toLocaleDateString("en-GB").slice(0, 5);
    const r = D.filter((x) => x.d === fmt).map((x) => x.t);
    return r.length ? r : null;
  }

  _bindReadMore() {
    this.content.removeEventListener("click", this._click);
    this._click = (e) => {
      const a = e.target.closest(".read-more");
      if (a) {
        e.preventDefault();
        location.hash = `#/news/${a.dataset.id}`;
      }
    };
    this.content.addEventListener("click", this._click);
  }
}
