export class JoinView {
  constructor() {
    this.content = document.getElementById("content");
  }

  render() {
    this.content.innerHTML = `
    <div class="join-page slide-in">

      <!-- Hero -->
      <div class="join-hero">
        <div class="join-hero-content">
          <span class="overline">Adhesión y voluntariado</span>
          <h1>Únete a nuestro movimiento</h1>
          <p class="join-lead">Completá el formulario para sumarte como adherente, voluntario o colaborador. Tu participación impulsa el cambio que Uruguay necesita.</p>
        </div>
        <div class="join-hero-values">
          <div class="join-value"><i class="ri-scales-3-line" aria-hidden="true"></i><span>Libertad individual</span></div>
          <div class="join-value"><i class="ri-building-line" aria-hidden="true"></i><span>Descentralización</span></div>
          <div class="join-value"><i class="ri-shield-check-line" aria-hidden="true"></i><span>Justicia proporcional</span></div>
          <div class="join-value"><i class="ri-trophy-line" aria-hidden="true"></i><span>Mérito</span></div>
        </div>
      </div>

      <!-- Grid: form + aside -->
      <div class="join-grid">

        <!-- Google Form embebido -->
        <div class="join-form-wrap">
          <div class="join-form-header">
            <span class="overline">Formulario de adhesión</span>
            <p class="join-form-note">
              <i class="ri-google-line" aria-hidden="true"></i>
              Este formulario está gestionado por Google Forms. Tus datos son tratados conforme a la Ley 18.331 de protección de datos personales de Uruguay.
            </p>
          </div>
          <div class="join-iframe-wrap">
            <iframe
              src="https://docs.google.com/forms/d/e/1FAIpQLSe3z5hTk3G7a73ajsw6zwNW7VZlUWWLId5e6iQHFDCkAzIpxg/viewform?embedded=true"
              width="100%"
              height="1800"
              frameborder="0"
              marginheight="0"
              marginwidth="0"
              title="Formulario de adhesión al movimiento Filipovich"
              loading="lazy"
              aria-label="Formulario de adhesión"
            >
              Cargando formulario…
            </iframe>
          </div>
          <div class="join-iframe-note">
            <i class="ri-external-link-line" aria-hidden="true"></i>
            Si el formulario no carga, podés accederlo directamente en
            <a href="https://docs.google.com/forms/d/e/1FAIpQLSe3z5hTk3G7a73ajsw6zwNW7VZlUWWLId5e6iQHFDCkAzIpxg/viewform" target="_blank" rel="noopener">este enlace</a>.
          </div>
        </div>

        <!-- Aside -->
        <aside class="join-aside">

          <div class="join-aside-card">
            <h4><i class="ri-question-line" aria-hidden="true"></i>¿Qué implica adherirse?</h4>
            <ul class="join-checklist">
              <li><i class="ri-check-line" aria-hidden="true"></i>Recibís comunicados y novedades del movimiento</li>
              <li><i class="ri-check-line" aria-hidden="true"></i>Podés participar en eventos y actividades</li>
              <li><i class="ri-check-line" aria-hidden="true"></i>Acceso a contenido exclusivo para adherentes</li>
              <li><i class="ri-check-line" aria-hidden="true"></i>Tu apoyo fortalece la representación política local</li>
            </ul>
          </div>

          <div class="join-aside-card emerald">
            <h4><i class="ri-hand-heart-line" aria-hidden="true"></i>¿Cómo puedo colaborar?</h4>
            <div class="join-role-list">
              <div class="join-role"><span class="join-role-icon"><i class="ri-megaphone-line" aria-hidden="true"></i></span><div><strong>Difusión</strong><p>Compartí propuestas en tus redes sociales</p></div></div>
              <div class="join-role"><span class="join-role-icon"><i class="ri-group-line" aria-hidden="true"></i></span><div><strong>Voluntariado</strong><p>Participá en actividades comunitarias</p></div></div>
              <div class="join-role"><span class="join-role-icon"><i class="ri-pencil-ruler-line" aria-hidden="true"></i></span><div><strong>Diseño y tecnología</strong><p>Aportá habilidades técnicas o creativas</p></div></div>
              <div class="join-role"><span class="join-role-icon"><i class="ri-money-dollar-circle-line" aria-hidden="true"></i></span><div><strong>Financiamiento</strong><p>Apoyá económicamente la causa</p></div></div>
            </div>
          </div>

          <div class="join-aside-card crimson">
          <h4><i class="ri-map-pin-line" aria-hidden="true"></i> Sede permanente</h4>
          <p>Para consultas, coordinación de voluntariado o información oficial, podés dirigirte personalmente a nuestra sede:</p>
          <p><address>
            Dr. Carlos Cigliuti, entre Francisco Acuña de Figueroa y Hermenegildo Melo, Nº 256<br>
            Canelones, Uruguay - 90000
          </address></p>
          
          <p><i class="ri-information-2-line" aria-hidden="true"></i> Avisar asistencia previa</p>
          </div>
          </div>`;
  }
}
