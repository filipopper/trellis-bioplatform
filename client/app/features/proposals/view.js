export class ProposalsView {
  constructor() { this.content = document.getElementById("content"); }

  render() {
    this.content.innerHTML = `
    <div class="proposals-page slide-in">

      <div class="proposals-hero">
        <span class="overline">Programa político</span>
        <h1>Propuestas</h1>
        <p class="proposals-lead">Un programa claro, basado en la libertad individual, la justicia proporcional y la descentralización efectiva del poder. Estas son las ideas que guían cada acción.</p>
        <div class="proposals-hero-actions">
          <a href="/client/assets/docs/principles.docx" target="_blank" class="btn btn-secondary btn-sm">
            <i class="ri-download-line" aria-hidden="true"></i> Descargar declaración de principios
          </a>
          <a href="/client/assets/docs/code-of-ethics.docx" target="_blank" class="btn btn-ghost btn-sm">
            <i class="ri-download-line" aria-hidden="true"></i> Código de ética
          </a>
        </div>
      </div>

      <!-- Filtros -->
      <div class="proposals-filters" role="group" aria-label="Filtrar propuestas">
        <button class="prop-filter active" data-cat="all">Todas</button>
        <button class="prop-filter" data-cat="economia">Economía</button>
        <button class="prop-filter" data-cat="justicia">Justicia</button>
        <button class="prop-filter" data-cat="educacion">Educación</button>
        <button class="prop-filter" data-cat="cultura">Cultura</button>
        <button class="prop-filter" data-cat="gobernanza">Gobernanza</button>
      </div>

      <!-- Grilla -->
      <div class="proposals-list" id="proposals-list">
        ${this._renderCards()}
      </div>

      <!-- Bloque de transparencia -->
      <div class="proposals-transparency">
        <div class="proposals-transparency-icon"><i class="ri-shield-check-line" aria-hidden="true"></i></div>
        <div>
          <h4>Transparencia y acceso abierto</h4>
          <p>Todos los documentos programáticos están disponibles para descarga libre. La política de puertas abiertas es un compromiso, no una promesa.</p>
          <div class="proposals-doc-links">
            <a href="/client/assets/docs/principles.docx" target="_blank"><i class="ri-file-text-line" aria-hidden="true"></i> Declaración de principios</a>
            <a href="/client/assets/docs/code-of-ethics.docx" target="_blank"><i class="ri-file-shield-line" aria-hidden="true"></i> Código de ética</a>
          </div>
        </div>
      </div>

    </div>`;

    this._bindFilters();
    this._bindAccordion();
  }

  _data() {
    return [
      {
        id: "economia-1", cat: "economia", icon: "ri-line-chart-line", color: "emerald",
        title: "Mercado Libre Dionisiaco Ordenado",
        short: "Desregulación integral de la economía con apertura comercial total y eliminación de impuestos excesivos.",
        body: `<p>La propuesta económica de Filipovich establece un claro distanciamiento de los modelos económicos mixtos. Propone:</p>
        <ul>
          <li><strong>Eliminación casi total de cargas impositivas</strong>, manteniendo solo tributos para seguridad e infraestructura básica.</li>
          <li><strong>Privatización integral</strong> de educación, salud y transporte bajo principios de competencia.</li>
          <li><strong>Zonas económicas especiales</strong> como laboratorios de desregulación total.</li>
          <li><strong>Apertura comercial total</strong> para posicionar a Uruguay como nodo global de comercio e inversión.</li>
        </ul>`,
      },
      {
        id: "economia-2", cat: "economia", icon: "ri-money-dollar-circle-line", color: "amber",
        title: "Sistema tributario minimalista",
        short: "Tasa única de baja cuantía que garantice el financiamiento de servicios esenciales sin cargar al ciudadano.",
        body: `<p>El modelo fiscal contempla una <strong>tasa única de mínima cuantía</strong> aplicada de forma universal y sin excepciones. Los principios son:</p>
        <ul>
          <li>Previsibilidad y simplicidad para ciudadanos y empresas.</li>
          <li>Eliminación de exenciones y regímenes especiales que generan corrupción.</li>
          <li>Prohibición constitucional de déficit fiscal estructural.</li>
        </ul>`,
      },
      {
        id: "justicia-1", cat: "justicia", icon: "ri-scales-3-line", color: "crimson",
        title: "Justicia restaurativa y proporcional",
        short: "Las víctimas tienen voz activa en el proceso. Las penas deben ser proporcionales al daño causado.",
        body: `<p>El sistema judicial propuesto se basa en <strong>restitución y proporcionalidad</strong>:</p>
        <ul>
          <li>Mayor participación de las víctimas durante el proceso judicial.</li>
          <li><strong>Cadena perpetua con obligatoriedad laboral</strong> para delitos de extrema gravedad.</li>
          <li>Reforma estructural para eliminar dilaciones procesales.</li>
          <li>Derecho a la <strong>autodefensa plena</strong> y sistemas de seguridad privada legalizados.</li>
        </ul>`,
      },
      {
        id: "justicia-2", cat: "justicia", icon: "ri-shield-user-line", color: "slate",
        title: "Tolerancia cero y seguridad descentralizada",
        short: "La sociedad civil tiene un rol protagónico en la prevención del delito.",
        body: `<p>El modelo de seguridad contempla:</p>
        <ul>
          <li>Política de <strong>tolerancia cero</strong> frente a la criminalidad.</li>
          <li>Descentralización de los mecanismos de seguridad pública.</li>
          <li>Legalización plena del <strong>derecho a la autodefensa</strong>.</li>
          <li>Penas ejemplares y de aplicación expeditiva.</li>
        </ul>`,
      },
      {
        id: "gobernanza-1", cat: "gobernanza", icon: "ri-building-line", color: "crimson",
        title: "Estado mínimo y subsidiario",
        short: "El Estado limita sus funciones a seguridad, justicia e infraestructura básica. El resto lo resuelve la sociedad civil.",
        body: `<p>El paradigma de gobernanza propuesto contempla una <strong>reducción drástica del aparato estatal</strong>:</p>
        <ul>
          <li>El Estado garantiza exclusivamente seguridad, justicia e infraestructura básica.</li>
          <li>El amplio espectro de responsabilidades restantes son asumidas por la <strong>sociedad civil y el mercado</strong>.</li>
          <li>Eliminación de duplicidades burocráticas y organismos parasitarios.</li>
          <li>Auditoría ciudadana permanente y publicación de todos los gastos en tiempo real.</li>
        </ul>`,
      },
      {
        id: "educacion-1", cat: "educacion", icon: "ri-book-open-line", color: "emerald",
        title: "Vouchers educativos",
        short: "El Estado financia el acceso, la familia elige la institución. Competencia y excelencia como motor.",
        body: `<p>El sistema educativo se transforma mediante <strong>vouchers de libre elección</strong>:</p>
        <ul>
          <li>El Estado transfiere el voucher directamente a la familia, no a la institución.</li>
          <li>Cualquier institución —pública o privada— que cumpla estándares puede recibir vouchers.</li>
          <li>La competencia entre instituciones mejora la calidad sin excluir a los vulnerables.</li>
          <li>Eliminación progresiva del monopolio educativo estatal.</li>
        </ul>`,
      },
      {
        id: "educacion-2", cat: "educacion", icon: "ri-hospital-line", color: "amber",
        title: "Salud en competencia",
        short: "Sistema mixto con vouchers sanitarios. El ciudadano elige su prestador sin perder cobertura.",
        body: `<p>El acceso a salud se garantiza mediante un <strong>sistema de vouchers sanitarios</strong>:</p>
        <ul>
          <li>Voucher universal transferible a cualquier prestador habilitado.</li>
          <li>Mutualistas, policlínicas privadas y el sector público compiten en igualdad de condiciones.</li>
          <li>Eliminación progresiva del FONASA en su forma actual, reemplazado por cuentas de salud individuales.</li>
        </ul>`,
      },
      {
        id: "cultura-1", cat: "cultura", icon: "ri-palette-line", color: "amber",
        title: "Cultura Dionisiaca con Estructura",
        short: "Libertad cultural total financiada por el mercado y el mecenazgo privado, sin subsidios estatales.",
        body: `<p>El modelo cultural se basa en la <strong>autonomía y el mecenazgo privado</strong>:</p>
        <ul>
          <li>Las manifestaciones culturales se financian exclusivamente por mecanismos de mercado.</li>
          <li>Eliminación de subsidios estatales que fomentan la mediocridad o responden a agendas.</li>
          <li>Uruguay como epicentro de creatividad, turismo y gastronomía de excelencia.</li>
          <li>Modelo de <strong>placer responsable</strong>: libertad cultural con valores y estándares de calidad.</li>
        </ul>`,
      },
    ];
  }

  _renderCards(cat = "all") {
    return this._data()
      .filter(p => cat === "all" || p.cat === cat)
      .map(p => `
        <div class="proposal-card" data-cat="${p.cat}" id="prop-${p.id}">
          <div class="proposal-card-header ${p.color}">
            <div class="proposal-card-icon"><i class="${p.icon}" aria-hidden="true"></i></div>
            <div class="proposal-card-meta">
              <span class="proposal-cat-badge">${this._catLabel(p.cat)}</span>
              <h3 class="proposal-card-title">${p.title}</h3>
            </div>
            <button class="proposal-accordion-btn" aria-expanded="false" aria-controls="pbody-${p.id}">
              <i class="ri-add-line" aria-hidden="true"></i>
            </button>
          </div>
          <div class="proposal-card-short">${p.short}</div>
          <div class="proposal-card-body" id="pbody-${p.id}" hidden>${p.body}</div>
        </div>`).join("");
  }

  _catLabel(cat) {
    return { economia:"Economía", justicia:"Justicia", educacion:"Educación", cultura:"Cultura", gobernanza:"Gobernanza" }[cat] || cat;
  }

  _bindFilters() {
    document.querySelectorAll(".prop-filter").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".prop-filter").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        const cat = btn.dataset.cat;
        document.getElementById("proposals-list").innerHTML = this._renderCards(cat);
        this._bindAccordion();
      });
    });
  }

  _bindAccordion() {
    document.querySelectorAll(".proposal-accordion-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const card   = btn.closest(".proposal-card");
        const body   = card.querySelector(".proposal-card-body");
        const isOpen = !body.hidden;
        body.hidden = isOpen;
        btn.setAttribute("aria-expanded", !isOpen);
        btn.querySelector("i").className = isOpen ? "ri-add-line" : "ri-subtract-line";
        card.classList.toggle("open", !isOpen);
      });
    });
  }
}
