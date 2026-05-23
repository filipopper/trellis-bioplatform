export class HomeView {
  constructor() {
    this.content = document.getElementById("content");
  }

  render() {
    this.content.innerHTML = `
    <div class="home-page">

      <!-- ══ HERO ══════════════════════════════════════════════ -->
<section class="hero">
  <div class="hero-bg-pattern" aria-hidden="true"></div>

  <div class="hero-inner with-photo">
    
    <!-- TEXTO -->
    <div class="hero-text">
      <span class="overline">Nicolás Filipovich · Canelones, Uruguay</span>
      
      <h1 class="hero-title">
        Libertad.<br>Justicia.<br>Mérito.
      </h1>

      <p class="hero-lead">
        Concejal del Municipio de Canelones (2025–2030). Paleolibertario. 
        Defensor de la propiedad privada, la descentralización del poder y la soberanía individual.
      </p>

      <div class="hero-actions">
        <a href="#" data-view="proposals" class="btn btn-primary btn-lg">
          <i class="ri-file-list-3-line" aria-hidden="true"></i>
          Ver propuestas
        </a>
        <a href="#" data-view="about" class="btn btn-secondary btn-lg">
          <i class="ri-user-line" aria-hidden="true"></i>
          Conocer perfil
        </a>
      </div>
    </div>

    <!-- FOTO -->
    <div class="hero-photo">
      <img 
        src="client/assets/img/filipovich-hero.png" 
        alt="Nicolás Filipovich"
        loading="eager"
      />
    </div>

  </div>
</section>

      <!-- ══ MÉTRICAS ══════════════════════════════════════════ -->
      <section class="home-section">
        <div class="metrics-row stagger-item">
          <div class="metric-card accent-crimson">
            <div class="metric-label">Seguidores totales</div>
            <div class="metric-value c-crimson">47.2K</div>
            <div class="metric-delta"><i class="ri-arrow-up-line" aria-hidden="true"></i> +12% este mes</div>
          </div>
          <div class="metric-card accent-emerald">
            <div class="metric-label">Años activo</div>
            <div class="metric-value c-emerald">3</div>
            <div class="metric-delta"><i class="ri-calendar-line" aria-hidden="true"></i> Desde 2023</div>
          </div>
          <div class="metric-card accent-slate">
            <div class="metric-label">Período actual</div>
            <div class="metric-value">2030</div>
            <div class="metric-delta" style="color:var(--s-mid)"><i class="ri-government-line" aria-hidden="true"></i> Municipio Canelones</div>
          </div>
        </div>
      </section>

      <!-- ══ LÍNEA DE TIEMPO ═══════════════════════════════════ -->
      <section class="home-section">
        <div class="section-header">
          <span class="overline">Trayectoria</span>
          <h2>Un recorrido breve y contundente</h2>
        </div>
        <div class="timeline">
          <div class="timeline-item stagger-item">
            <div class="timeline-marker crimson"></div>
            <div class="timeline-content">
              <span class="timeline-date">2023</span>
              <h4>Inicio en la actividad política</h4>
              <p>Irrupción en el escenario político con un enfoque crítico y paleolibertario, desafiando estructuras tradicionales dentro del Partido Nacional.</p>
            </div>
          </div>
          <div class="timeline-item stagger-item">
            <div class="timeline-marker emerald"></div>
            <div class="timeline-content">
              <span class="timeline-date">2024</span>
              <h4>Afiliación al Partido Libertario (PLU)</h4>
              <p>Participación en el Partido Libertario del Uruguay y la Plataforma por la Libertad, consolidando su identidad ideológica.</p>
            </div>
          </div>
          <div class="timeline-item stagger-item">
            <div class="timeline-marker crimson"></div>
            <div class="timeline-content">
              <span class="timeline-date">2025 · Elecciones municipales</span>
              <h4>Electo Concejal del Municipio de Canelones</h4>
              <p>Elección en lista propia dentro del Partido Nacional. Asunción en el Teatro Politeama el 10 de julio de 2025.</p>
            </div>
          </div>
          <div class="timeline-item stagger-item">
            <div class="timeline-marker amber"></div>
            <div class="timeline-content">
              <span class="timeline-date">2025 – presente</span>
              <h4>Integrante de la Comisión de Desarrollo Humano</h4>
              <p>Ejercicio del cargo ad honórem. Participación activa en la Comisión de Amigos del Hospital Dr. Francisco Soca.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- ══ PROPUESTAS DESTACADAS ════════════════════════════ -->
      <section class="home-section">
        <div class="section-header">
          <span class="overline">Propuestas clave</span>
          <h2>Las ideas que definen el movimiento</h2>
        </div>
        <div class="proposals-grid-home stagger-item">
          <div class="proposal-card-home crimson">
            <div class="proposal-card-home-icon"><i class="ri-scales-3-line" aria-hidden="true"></i></div>
            <h4>Justicia proporcional</h4>
            <p>Sistema judicial basado en restitución y proporcionalidad, con mayor participación de las víctimas en el proceso.</p>
            <a href="#" data-view="proposals" class="proposal-card-home-link">Ver detalles <i class="ri-arrow-right-line" aria-hidden="true"></i></a>
          </div>
          <div class="proposal-card-home emerald">
            <div class="proposal-card-home-icon"><i class="ri-line-chart-line" aria-hidden="true"></i></div>
            <h4>Mercado libre y desregulación</h4>
            <p>Eliminación de cargas impositivas excesivas, zonas económicas especiales y apertura comercial total.</p>
            <a href="#" data-view="proposals" class="proposal-card-home-link">Ver detalles <i class="ri-arrow-right-line" aria-hidden="true"></i></a>
          </div>
          <div class="proposal-card-home amber">
            <div class="proposal-card-home-icon"><i class="ri-building-line" aria-hidden="true"></i></div>
            <h4>Descentralización del poder</h4>
            <p>Reducción del aparato estatal a su mínima expresión. Sociedad civil y mecanismos de mercado como motores de desarrollo.</p>
            <a href="#" data-view="proposals" class="proposal-card-home-link">Ver detalles <i class="ri-arrow-right-line" aria-hidden="true"></i></a>
          </div>
          <div class="proposal-card-home slate">
            <div class="proposal-card-home-icon"><i class="ri-book-open-line" aria-hidden="true"></i></div>
            <h4>Educación y vouchers</h4>
            <p>Sistema de vouchers educativos para fomentar la competencia entre instituciones sin desproteger sectores vulnerables.</p>
            <a href="#" data-view="proposals" class="proposal-card-home-link">Ver detalles <i class="ri-arrow-right-line" aria-hidden="true"></i></a>
          </div>
        </div>
        <div style="text-align:center;margin-top:var(--sp-8)">
          <a href="#" data-view="proposals" class="btn btn-secondary">
            <i class="ri-file-list-3-line" aria-hidden="true"></i>
            Ver todas las propuestas
          </a>
        </div>
      </section>

      <!-- ══ CTA ÚNETE ══════════════════════════════════════════ -->
      <section class="home-cta stagger-item">
        <div class="home-cta-inner">
          <div>
            <h3>¿Compartís alguna de estas propuestas? Sumate.</h3>
            <p>Escribinos, compartí tus ideas o realizá una consulta.</p>
          </div>
          <a href="#" data-view="join" class="btn btn-primary btn-lg">
            <i class="ri-heart-add-line" aria-hidden="true"></i>
            Participá ahora
          </a>
        </div>
      </section>

    </div>`;
  }
}
