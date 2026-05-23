export class ContactView {
  constructor() {
    this.content = document.getElementById("content");
  }

  render() {
    this.content.innerHTML = `
      <div class="contact-page slide-in">

        <!-- Header de sección -->
        <div class="contact-header">
          <span class="overline">Contacto directo</span>
          <h2>¿Querés comunicarte<br>con Nicolás?</h2>
          <p class="contact-lead">Completá el formulario y el equipo tratará de ponerse en contacto dentro de las 24 horas hábiles. También podés escribir directamente por redes sociales.</p>
        </div>

        <!-- Grid: formulario + info lateral -->
        <div class="contact-grid">

          <!-- FORMULARIO NATIVO -->
          <div class="contact-form-card">
            <div class="contact-form-header">
              <span class="overline">Formulario de contacto</span>
            </div>

            <form id="contact-form" class="contact-form" novalidate>

              <div class="form-row">
                <div class="form-group">
                  <label class="form-label" for="cf-nombre">Nombre completo <span class="required-mark">*</span></label>
                  <input class="form-input" type="text" id="cf-nombre" name="nombre" placeholder="Juan Rodríguez" autocomplete="name" required />
                  <span class="field-error" id="err-nombre"></span>
                </div>
                <div class="form-group">
                  <label class="form-label" for="cf-email">Correo electrónico <span class="required-mark">*</span></label>
                  <input class="form-input" type="email" id="cf-email" name="email" placeholder="juan@ejemplo.uy" autocomplete="email" required />
                  <span class="field-error" id="err-email"></span>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label" for="cf-asunto">Asunto <span class="required-mark">*</span></label>
                <select class="form-input" id="cf-asunto" name="asunto" required>
                  <option value="" disabled selected>Seleccioná el motivo de contacto</option>
                  <option value="consulta">Consulta general</option>
                  <option value="prensa">Prensa o medios</option>
                  <option value="evento">Invitación formal</option>
                  <option value="colaboracion">Coordinación institucional</option>
                  <option value="otro">Otro</option>
                </select>
                <span class="field-error" id="err-asunto"></span>
              </div>

              <div class="form-group">
                <label class="form-label" for="cf-mensaje">Mensaje <span class="required-mark">*</span></label>
                <textarea class="form-input" id="cf-mensaje" name="mensaje" rows="5" placeholder="Escribí tu consulta o solicitud de información..." required></textarea>
                <div class="char-counter"><span id="char-count">0</span> / 800 caracteres</div>
                <span class="field-error" id="err-mensaje"></span>
              </div>

              <div class="form-group consent-group">
                <label class="checkbox-label">
                  <input type="checkbox" id="cf-consent" name="consent" required />
                  <span class="checkbox-custom"></span>
                  <span class="checkbox-text">
                    Acepto que mis datos sean utilizados para responder esta consulta, conforme a la <strong>Ley 18.331</strong> de protección de datos personales (Uruguay).
                  </span>
                </label>
                <span class="field-error" id="err-consent"></span>
              </div>

              <div class="form-actions">
                <button type="submit" class="btn btn-primary btn-form-submit" id="cf-submit">
                  <i class="ri-send-plane-line"></i>
                  Enviar mensaje
                </button>
                <button type="button" class="btn btn-ghost" id="cf-reset">Limpiar</button>
              </div>

            </form>

            <!-- Estados de resultado -->
            <div id="form-success" class="form-state form-success hidden">
              <div class="form-state-icon">
                <i class="ri-checkbox-circle-line"></i>
              </div>
              <h4>¡Mensaje enviado!</h4>
              <p>Tu consulta fue recibida. El equipo de Filipovich se pondrá en contacto en las próximas 48 horas hábiles.</p>
              <button class="btn btn-secondary btn-sm" id="form-new">Enviar otro mensaje</button>
            </div>

            <div id="form-error-state" class="form-state form-error-state hidden">
              <div class="form-state-icon error">
                <i class="ri-error-warning-line"></i>
              </div>
              <h4>Hubo un problema</h4>
              <p>No se pudo enviar el mensaje. Intentá de nuevo o escribí por WhatsApp.</p>
              <button class="btn btn-secondary btn-sm" id="form-retry">Intentar de nuevo</button>
            </div>
          </div>

          <!-- INFO LATERAL -->
          <aside class="contact-aside">

            <!-- Card datos de contacto -->
            <div class="contact-info-card">
              <h6>Contacto directo</h6>
              <ul class="contact-info-list">
                <li class="contact-info-item">
                  <span class="contact-info-icon"><i class="ri-mail-line"></i></span>
                  <div>
                    <div class="contact-info-label">Email</div>
                    <a href="mailto:mrnicolasfilipovich@gmail.com" class="contact-info-value">mrnicolasfilipovich@gmail.com</a>
                  </div>
                </li>
                </li>
                <li class="contact-info-item">
                  <span class="contact-info-icon"><i class="ri-time-line"></i></span>
                  <div>
                    <div class="contact-info-label">Tiempo de respuesta</div>
                    <span class="contact-info-value">24-48 horas hábiles</span>
                  </div>
                </li>
              </ul>
            </div>

            <!-- Card redes -->
            <div class="contact-info-card">
              <h6>Redes sociales</h6>
              <div class="contact-social-grid">
                <a href="https://www.instagram.com/filipopper/" target="_blank" class="contact-social-item">
                  <i class="ri-instagram-line"></i>
                  <span>Instagram</span>
                </a>
                <a href="https://x.com/soyfilipopper" target="_blank" class="contact-social-item">
                  <i class="ri-twitter-x-line"></i>
                  <span>X / Twitter</span>
                </a>
                <a href="https://www.tiktok.com/@filipopper" target="_blank" class="contact-social-item">
                  <i class="ri-tiktok-fill"></i>
                  <span>TikTok</span>
                </a>
                <a href="https://www.youtube.com/@filipopper" target="_blank" class="contact-social-item">
                  <i class="ri-youtube-line"></i>
                  <span>YouTube</span>
                </a>
                <a href="https://whatsapp.com/channel/0029Vb8cTe71yT24mMrnmo0t" target="_blank" class="contact-social-item whatsapp">
                  <i class="ri-whatsapp-line"></i>
                  <span>Canal WhatsApp</span>
                </a>
              </div>
            </div>

            <!-- Blockquote -->
            <blockquote>
              <p>"La política es el arte de encontrar soluciones donde otros solo ven problemas."</p>
              <cite>— Nicolás Filipovich</cite>
            </blockquote>

          </aside>
        </div>
      </div>
    `;

    this._bindForm();
  }

  _bindForm() {
    const form = document.getElementById("contact-form");
    const success = document.getElementById("form-success");
    const errState = document.getElementById("form-error-state");
    const submit = document.getElementById("cf-submit");
    const mensaje = document.getElementById("cf-mensaje");
    const charCount = document.getElementById("char-count");
    const resetBtn = document.getElementById("cf-reset");
    const newBtn = document.getElementById("form-new");
    const retryBtn = document.getElementById("form-retry");

    if (!form) return;

    // Contador de caracteres
    mensaje.addEventListener("input", () => {
      const len = mensaje.value.length;
      charCount.textContent = len;
      charCount.style.color = len > 750 ? "var(--c-base)" : "var(--s-lt)";
      if (len > 800) mensaje.value = mensaje.value.slice(0, 800);
    });

    // Reset
    resetBtn.addEventListener("click", () => {
      form.reset();
      charCount.textContent = "0";
      document.querySelectorAll(".field-error").forEach((e) => {
        e.textContent = "";
      });
      document
        .querySelectorAll(".form-input.error")
        .forEach((e) => e.classList.remove("error"));
    });

    // Volver a mostrar el form
    [newBtn, retryBtn].forEach((btn) => {
      if (!btn) return;
      btn.addEventListener("click", () => {
        form.style.display = "";
        success.classList.add("hidden");
        errState.classList.add("hidden");
        form.reset();
        charCount.textContent = "0";
      });
    });

    // Validación y envío
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!this._validate()) return;

      submit.disabled = true;
      submit.innerHTML = '<i class="ri-loader-4-line ri-spin"></i> Enviando…';

      const data = {
        nombre: document.getElementById("cf-nombre").value.trim(),
        email: document.getElementById("cf-email").value.trim(),
        asunto: document.getElementById("cf-asunto").value,
        mensaje: document.getElementById("cf-mensaje").value.trim(),
      };

      // Enviamos via WhatsApp (mismo mecanismo que la tienda)
      const msg = `*Nuevo contacto desde Filipovich.uy*\n───────────────────────\n*Nombre:* ${data.nombre}\n*Email:* ${data.email}\n*Asunto:* ${data.asunto}\n\n*Mensaje:*\n${data.mensaje}\n───────────────────────\n_Enviado el ${new Date().toLocaleString("es-UY")}_`;

      setTimeout(() => {
        window.open(
          `https://wa.me/59892955928?text=${encodeURIComponent(msg)}`,
          "_blank",
        );
        form.style.display = "none";
        success.classList.remove("hidden");
      }, 800);
    });
  }

  _validate() {
    let ok = true;
    const rules = [
      {
        id: "cf-nombre",
        err: "err-nombre",
        msg: "Ingresá tu nombre completo.",
        fn: (v) => v.trim().length >= 3,
      },
      {
        id: "cf-email",
        err: "err-email",
        msg: "Ingresá un correo electrónico válido.",
        fn: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
      },
      {
        id: "cf-asunto",
        err: "err-asunto",
        msg: "Seleccioná el motivo de contacto.",
        fn: (v) => v !== "",
      },
      {
        id: "cf-mensaje",
        err: "err-mensaje",
        msg: "Escribí un mensaje de al menos 20 caracteres.",
        fn: (v) => v.trim().length >= 20,
      },
    ];

    rules.forEach(({ id, err, msg, fn }) => {
      const el = document.getElementById(id);
      const errEl = document.getElementById(err);
      const val = el.tagName === "SELECT" ? el.value : el.value;
      if (!fn(val)) {
        errEl.textContent = msg;
        el.classList.add("error");
        ok = false;
      } else {
        errEl.textContent = "";
        el.classList.remove("error");
      }
    });

    const consent = document.getElementById("cf-consent");
    const errConsent = document.getElementById("err-consent");
    if (!consent.checked) {
      errConsent.textContent =
        "Debés aceptar el uso de tus datos para continuar.";
      ok = false;
    } else {
      errConsent.textContent = "";
    }

    return ok;
  }
}
