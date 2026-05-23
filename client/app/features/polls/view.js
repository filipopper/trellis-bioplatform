import { View } from "../../foundation/view.js";

const RAW_DATA = [
  [40.83, 35.58, 23.59],
  [30.92, 35.17, 19.08, 8.83, 5.99],
  [22.42, 31.67, 24.92, 20.99],
  [47.75, 38.08, 8.58, 12.42, 39.17],
  [21.33, 30.58, 27.67, 20.42],
  [18.75, 26.58, 23.42, 31.25],
  [29.17, 44.33, 26.5],
  [31.08, 18.92, 16.33, 14.83, 18.84],
  [24.83, 46.08, 29.09],
  [43.83, 41.08, 15.09],
  [19.92, 26.58, 28.17, 14.83, 10.5],
];

const QUESTIONS = [
  "Nivel de conocimiento de la figura",
  "Evaluación de la imagen pública",
  "Modalidad de apoyo hacia la figura",
  "Nivel de activismo político vinculado",
  "Importancia asignada en la vida personal",
  "Intención declarada de voto",
  "Percepción de viabilidad electoral",
  "Principales barreras percibidas",
  "Disposición a recomendación interpersonal",
  "Evaluación sobre necesidad de moderación",
  "Nivel de identificación emocional",
];

const ANSWERS = [
  ["Conoce bien", "Conoce de nombre", "No conoce"],
  ["Muy positiva", "Positiva", "Neutral", "Negativa", "Muy negativa"],
  ["Apoyo público", "Apoyo privado", "Indiferente", "Rechazo"],
  [
    "Comparte contenido",
    "Debate",
    "Dona",
    "Asiste a eventos",
    "Ninguna acción",
  ],
  ["Central", "Importante", "Secundaria", "Prescindible"],
  ["Voto seguro", "Voto probable", "Duda", "Rechazo"],
  ["Puede ganar", "No puede ganar", "NS/NC"],
  [
    "Falta estructura",
    "Radicalidad",
    "Baja visibilidad",
    "Falta alianzas",
    "Sin barreras",
  ],
  ["Recomienda", "Podría recomendar", "No recomienda"],
  ["Mantener", "Moderar", "NS/NC"],
  ["Muy alta", "Alta", "Media", "Baja", "Nula"],
];

const PALETTE = [
  ["#4DB891", "#8ECFB5", "#5A4055"],
  ["#2E7D5A", "#5BBF85", "#5A4055", "#D98080", "#C84545"],
  ["#4DB891", "#8ECFB5", "#5A4055", "#C84545"],
  ["#5E9FD0", "#8BBDE8", "#C9A84C", "#E8A056", "#5A4055"],
  ["#4DB891", "#8ECFB5", "#5A4055", "#C84545"],
  ["#2E7D5A", "#5BBF85", "#5A4055", "#C84545"],
  ["#4DB891", "#C84545", "#5A4055"],
  ["#E8A056", "#C84545", "#5E9FD0", "#B07FD8", "#5BBF85"],
  ["#4DB891", "#8ECFB5", "#C84545"],
  ["#4DB891", "#E8A056", "#5A4055"],
  ["#2E7D5A", "#5BBF85", "#5A4055", "#D98080", "#C84545"],
];

// Metadata del estudio
const STUDY = {
  id: "CAN-URB-PPX-1200-SIM",
  n: 1200,
  error: "±2.8%",
  ci: "95%",
  method: "Muestreo aleatorio simple simulado",
  scope: "Canelones, Uruguay",
  date: "2026-11-05",
  dimensions: RAW_DATA.length,
};

export class PollView extends View {
  render() {
    super.render();
    document.getElementById("pollPageTooltip")?.remove();

    // Normalizar: los datos ya son proporciones reales, se expresan tal cual en %
    const data = RAW_DATA.map((row) => {
      const total = row.reduce((a, b) => a + b, 0);
      return row.map((v) => (v * 100) / total);
    });

    // Calcular índice de favorabilidad ponderado por fila (para el resumen)
    const favorability = data.map((row, i) => {
      // Primeras 2 respuestas = favorables, última(s) = desfavorables (heurística)
      const pos = (row[0] ?? 0) + (row[1] ?? 0);
      const neg = (row[row.length - 1] ?? 0) + (row[row.length - 2] ?? 0);
      return +(pos - neg).toFixed(2);
    });

    const avgFav = (
      favorability.reduce((a, b) => a + b, 0) / favorability.length
    ).toFixed(2);

    this.content.innerHTML = `
      <div class="poll-page">

        <!-- ── ENCABEZADO ──────────────────────────────────── -->
        <header class="poll-page-header slide-in">

          <div class="poll-eyebrow">
            <span class="poll-eyebrow-line"></span>
            <span class="poll-eyebrow-text">Acceso público autorizado · Sin garantía ni responsabilidad legal · ${STUDY.id}</span>
        <span class="wiki-eyebrow-chip"><i class="ri-verified-badge-line"></i> Información corroborada</span>
          </div>

<h2 class="poll-page-title">
  <div class="circle-sketch-text">
    Evaluación de Opinión Pública:<br>
    <em>Imagen y Posicionamiento Político de 
      <span class="circle-sketch-highlight"><strong>Nicolás Filipovich</strong></span>
    </em>
  </div>
</h2>

          <p class="poll-page-desc">
            Distribución porcentual normalizada de respuestas obtenidas sobre una muestra simulada
            de <strong>n&nbsp;=&nbsp;${STUDY.n.toLocaleString("es-UY")}</strong> unidades estadísticas
            en el departamento de <strong>${STUDY.scope}</strong>. Los valores expresan proporciones
            relativas ponderadas; la normalización garantiza comparabilidad entre dimensiones de
            distinto número de categorías. Nivel de confianza: <strong>${STUDY.ci}</strong>.
            Margen de error teórico: <strong>${STUDY.error}</strong>
            (bajo supuestos de muestreo aleatorio simple).
          </p>

          <div class="poll-meta-row">
            <div class="poll-meta-pill"><span class="poll-meta-dot"></span>n&nbsp;=&nbsp;${STUDY.n.toLocaleString("es-UY")} unidades</div>
            <div class="poll-meta-pill"><span class="poll-meta-dot"></span>ME ${STUDY.error} · IC ${STUDY.ci}</div>
            <div class="poll-meta-pill"><span class="poll-meta-dot"></span>${STUDY.dimensions} dimensiones</div>
            <div class="poll-meta-pill"><span class="poll-meta-dot"></span>${STUDY.method}</div>
            <div class="poll-meta-pill"><span class="poll-meta-dot"></span>${STUDY.scope} · ${STUDY.date}</div>
          </div>

        </header>

        <!-- ── MÉTRICAS RESUMEN ────────────────────────────── -->
        <div class="poll-stats-grid stagger-item">
          <div class="poll-stat-card">
            <span class="poll-stat-n">${STUDY.n.toLocaleString("es-UY")}</span>
            <span class="poll-stat-lbl">Tamaño muestral</span>
          </div>
          <div class="poll-stat-card">
            <span class="poll-stat-n">${STUDY.dimensions}</span>
            <span class="poll-stat-lbl">Dimensiones analizadas</span>
          </div>
          <div class="poll-stat-card">
            <span class="poll-stat-n">${STUDY.error}</span>
            <span class="poll-stat-lbl">Error muestral teórico</span>
          </div>
          <div class="poll-stat-card">
            <span class="poll-stat-n">${avgFav > 0 ? "+" : ""}${avgFav}</span>
            <span class="poll-stat-lbl">Índice neto de favorabilidad</span>
          </div>
        </div>

        <!-- ── GRÁFICO ─────────────────────────────────────── -->
        <div class="poll-chart-wrapper">
          <div class="poll-axis-header stagger-item">
            <div class="poll-label-col">
              <span class="poll-axis-label-title">Dimensión</span>
            </div>
            <div class="poll-axis-ticks-wrap" id="pollPageAxis"></div>
          </div>
          <div class="poll-chart-grid stagger-item" id="pollPageChart"></div>
        </div>

        <!-- ── LEYENDA ─────────────────────────────────────── -->
        <div class="poll-legend stagger-item">
          <span class="poll-legend-label">← Favorable / Positivo</span>
          <div class="poll-legend-bar"></div>
          <span class="poll-legend-label">Desfavorable / Negativo →</span>
        </div>

        <!-- ── NOTA METODOLÓGICA ───────────────────────────── -->
        <div class="poll-note stagger-item">
          <strong>Nota metodológica.</strong>
          Los datos corresponden a un estudio simulado (ID: <code>${STUDY.id}</code>) con
          n&nbsp;=&nbsp;${STUDY.n.toLocaleString("es-UY")} casos en ${STUDY.scope}.
          Las proporciones fueron normalizadas para garantizar que la suma de categorías
          por dimensión sea exactamente 100%, permitiendo comparabilidad inter-dimensional.
          El margen de error teórico de ${STUDY.error} aplica bajo supuestos de muestreo
          aleatorio simple con nivel de confianza del ${STUDY.ci}.
          Los resultados reflejan percepciones declaradas y no constituyen predicción
          de comportamiento electoral efectivo.
          <br><br>
          <strong>Índice neto de favorabilidad (INF):</strong>
          calculado como la diferencia entre la suma de respuestas favorables (categorías
          superiores de la escala) y desfavorables (categorías inferiores), promediado
          entre las ${STUDY.dimensions} dimensiones analizadas. Valor obtenido: <strong>${avgFav > 0 ? "+" : ""}${avgFav} pp</strong>.
        </div>

      </div>
    `;

    // ── Eje de referencia ──────────────────────────────────
    const axisCont = document.getElementById("pollPageAxis");
    [0, 25, 50, 75, 100].forEach((v) => {
      const el = document.createElement("div");
      el.className = "poll-axis-tick";
      el.style.left = v + "%";
      el.textContent = v + "%";
      axisCont.appendChild(el);
    });

    // ── Tooltip (en body para evitar conflictos con position:fixed) ──
    const chart = document.getElementById("pollPageChart");
    document.getElementById("pollPageTooltip")?.remove();
    const tooltip = document.createElement("div");
    tooltip.className = "poll-tooltip-el";
    tooltip.id = "pollPageTooltip";
    tooltip.innerHTML = `
      <div class="poll-tt-q" id="pttQ"></div>
      <div class="poll-tt-a" id="pttA"></div>
      <div class="poll-tt-p" id="pttP"></div>
      <div class="poll-tt-n" id="pttN"></div>`;
    document.body.appendChild(tooltip);

    const ttQ = document.getElementById("pttQ");
    const ttA = document.getElementById("pttA");
    const ttP = document.getElementById("pttP");
    const ttN = document.getElementById("pttN");

    // ── Filas del gráfico ──────────────────────────────────
    data.forEach((row, i) => {
      const rowEl = document.createElement("div");
      rowEl.className = "poll-chart-row stagger-item";

      // Etiqueta de dimensión
      const labelCol = document.createElement("div");
      labelCol.className = "poll-label-col";
      const labelInner = document.createElement("div");
      labelInner.className = "poll-row-q";
      labelInner.innerHTML = `<span class="poll-row-num">P${String(i + 1).padStart(2, "0")}</span>${QUESTIONS[i]}`;
      labelCol.appendChild(labelInner);
      rowEl.appendChild(labelCol);

      // Barra de distribución
      const trackWrap = document.createElement("div");
      trackWrap.className = "poll-track-wrap";

      const track = document.createElement("div");
      track.className = "poll-track";

      // Líneas de referencia en 25 / 50 / 75 %
      [25, 50, 75].forEach((pct) => {
        const gl = document.createElement("div");
        gl.className = "poll-gridline";
        gl.style.left = pct + "%";
        track.appendChild(gl);
      });

      // Segmentos de respuesta
      row.forEach((val, j) => {
        // Estimar n absoluto para el tooltip
        const nAbs = Math.round((val / 100) * STUDY.n);

        const seg = document.createElement("div");
        seg.className = "poll-seg";
        seg.style.cssText = `width:${val}%;background:${PALETTE[i][j]};animation-delay:${i * 0.055 + 0.2}s;`;

        const inner = document.createElement("div");
        inner.className = "poll-seg-inner";

        if (val > 14) {
          inner.innerHTML = `<span class="poll-seg-lbl">${ANSWERS[i][j]}</span><span class="poll-seg-pct">${val.toFixed(2)}%</span>`;
        } else if (val > 7) {
          inner.innerHTML = `<span class="poll-seg-pct-sm">${val.toFixed(2)}%</span>`;
        }

        seg.appendChild(inner);

        seg.addEventListener("mousemove", (e) => {
          ttQ.textContent = `P${String(i + 1).padStart(2, "0")} · ${QUESTIONS[i]}`;
          ttA.textContent = ANSWERS[i][j];
          ttP.textContent = val.toFixed(2) + "%";
          ttN.textContent = `≈ ${nAbs.toLocaleString("es-UY")} casos`;
          tooltip.classList.add("visible");
          const x = Math.min(e.clientX + 16, window.innerWidth - 228);
          const y = Math.min(e.clientY + 16, window.innerHeight - 96);
          tooltip.style.transform = `translate(${x}px, ${y}px)`;
        });
        seg.addEventListener("mouseleave", () =>
          tooltip.classList.remove("visible"),
        );

        track.appendChild(seg);
      });

      trackWrap.appendChild(track);
      rowEl.appendChild(trackWrap);
      chart.appendChild(rowEl);
    });

    // Disparar animación de entrada al montar
    requestAnimationFrame(() => {
      document.querySelectorAll(".poll-seg").forEach((s) => {
        s.style.animationPlayState = "running";
      });
    });
  }
}
