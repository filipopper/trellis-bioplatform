/**
 * GenealogyTree — Árbol genealógico extensible
 * Los datos se cargan desde client/app/features/genealogy/data/family.json
 * Filipovich™ · 2026
 */

/* ══════════════════════════════════════════════════════════
   LAYOUT — posiciones en grilla por generación
══════════════════════════════════════════════════════════ */
const CW   = 140;
const CH   = 110;
const HGAP = 22;
const VGAP = 64;
const PAD  = 60;

function computeLayout(people) {
  people = [...people]; // copia mutable
  const gen = {};
  const subject = people.find(p => p.isSubject)?.id;

  function walk(id, g, seen = new Set()) {
    if (!id || seen.has(id)) return;
    seen.add(id);
    if (gen[id] === undefined) gen[id] = g;
    const p = people.find(x => x.id === id);
    if (!p) return;
    if (p.fatherID) walk(p.fatherID, g + 1, new Set(seen));
    if (p.motherID) walk(p.motherID, g + 1, new Set(seen));
    people
      .filter(x => x.fatherID === id || x.motherID === id)
      .forEach(c => walk(c.id, g - 1, new Set(seen)));
  }
  walk(subject, 0);

  // Personas sin conexión al árbol: no las incluimos en el layout
  // (evita que descentren al sujeto principal)
  const connected = people.filter(p => gen[p.id] !== undefined);
  people = connected;

  const byGen = {};
  people.forEach(p => {
    const g = gen[p.id];
    (byGen[g] = byGen[g] || []).push(p);
  });

  // Agrupar cónyuges juntos dentro de su generación
  Object.values(byGen).forEach(row => {
    const placed = new Set();
    const sorted = [];
    row.forEach(p => {
      if (placed.has(p.id)) return;
      sorted.push(p);
      placed.add(p.id);
      if (p.spouseID) {
        const sp = row.find(x => x.id === p.spouseID);
        if (sp && !placed.has(sp.id)) {
          sorted.push(sp);
          placed.add(sp.id);
        }
      }
    });
    row.length = 0;
    sorted.forEach(p => row.push(p));
  });

  const gens = Object.keys(byGen).map(Number).sort((a, b) => b - a);
  const maxRow = Math.max(...Object.values(byGen).map(r => r.length));
  const stageW = maxRow * (CW + HGAP) - HGAP + PAD * 2;

  const pos = {};
  gens.forEach((g, rowIdx) => {
    const row = byGen[g];
    const rowW = row.length * CW + (row.length - 1) * HGAP;
    const startX = (stageW - rowW) / 2;
    row.forEach((p, i) => {
      pos[p.id] = {
        x: startX + i * (CW + HGAP),
        y: PAD + rowIdx * (CH + VGAP),
      };
    });
  });

  const stageH = gens.length * (CH + VGAP) - VGAP + PAD * 2;
  return { pos, stageW, stageH };
}

/* ══════════════════════════════════════════════════════════
   CLASE PRINCIPAL
══════════════════════════════════════════════════════════ */
export class GenealogyTree {
  constructor(mount) {
    this.mount   = mount;
    this.people  = [];
    this.zoom    = 1;
    this.panX    = 0;
    this.panY    = 0;
    this._drag   = false;
    this._last   = { x: 0, y: 0 };

    this._buildShell();
    this._loadData();
  }

  /* ── SHELL (estructura vacía mientras carga) ─────────── */
  _buildShell() {
    this.mount.innerHTML = `
      <div class="gen-wrapper">
        <div class="gen-toolbar">
          <span class="gen-toolbar-title">
            <i class="ri-node-tree"></i> Árbol genealógico
          </span>
          <button class="gen-btn" id="gen-zout"><i class="ri-subtract-line"></i></button>
          <button class="gen-btn" id="gen-zin"><i class="ri-add-line"></i></button>
          <button class="gen-btn" id="gen-fit"><i class="ri-fullscreen-line"></i> Ajustar</button>
        </div>
        <div class="gen-canvas" id="gen-canvas">
          <div class="gen-loading" id="gen-loading">
            <i class="ri-loader-4-line"></i> Cargando árbol…
          </div>
          <div class="gen-stage" id="gen-stage" style="display:none">
            <svg class="gen-svg" id="gen-svg"></svg>
          </div>
          <div class="gen-panel-overlay">
            <div class="gen-panel" id="gen-panel">
              <div class="gen-panel-head" id="gen-panel-head"></div>
              <div class="gen-panel-body" id="gen-panel-body"></div>
            </div>
          </div>
        </div>
        <div class="gen-legend">
          <span class="gen-legend-item"><span class="gen-legend-dot gen-legend-dot--s"></span> Sujeto</span>
          <span class="gen-legend-item"><span class="gen-legend-dot gen-legend-dot--m"></span> Hombre</span>
          <span class="gen-legend-item"><span class="gen-legend-dot gen-legend-dot--f"></span> Mujer</span>
          <span class="gen-legend-item"><span class="gen-legend-dash"></span> Filiación</span>
          <span class="gen-legend-item"><span class="gen-legend-dash gen-legend-dash--spouse"></span> Pareja</span>
        </div>
      </div>
    `;

    this.canvas = this.mount.querySelector('#gen-canvas');
    this.stage  = this.mount.querySelector('#gen-stage');
    this.svg    = this.mount.querySelector('#gen-svg');
    this.panel  = this.mount.querySelector('#gen-panel');

    this._bindEvents();
  }

  /* ── CARGA DE DATOS ──────────────────────────────────── */
  _loadData() {
    fetch('client/app/features/genealogy/data/family.json')
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(data => {
        this.people = data.people || [];
        this._render();
      })
      .catch(err => {
        const loading = this.mount.querySelector('#gen-loading');
        if (loading) loading.innerHTML = `<i class="ri-error-warning-line"></i> No se pudo cargar family.json`;
        console.warn('GenealogyTree:', err);
      });
  }

  /* ── RENDER ──────────────────────────────────────────── */
  _render() {
    const loading = this.mount.querySelector('#gen-loading');
    if (loading) loading.style.display = 'none';
    this.stage.style.display = '';

    const { pos, stageW, stageH } = computeLayout(this.people);
    this._pos    = pos;
    this._stageW = stageW;
    this._stageH = stageH;

    this.stage.style.width  = stageW + 'px';
    this.stage.style.height = stageH + 'px';
    this.svg.style.width    = stageW + 'px';
    this.svg.style.height   = stageH + 'px';
    this.svg.setAttribute('viewBox', `0 0 ${stageW} ${stageH}`);

    this.svg.innerHTML = '';
    [...this.stage.querySelectorAll('.gen-card')].forEach(el => el.remove());

    this._drawLines(pos);
    this.people.forEach(p => {
      if (pos[p.id]) this.stage.appendChild(this._makeCard(p, pos[p.id]));
    });

    requestAnimationFrame(() => this._focusSubject());
  }

  /* ── LÍNEAS SVG ──────────────────────────────────────── */
  _drawLines(pos) {
    const ns = 'http://www.w3.org/2000/svg';
    const drawnSpouse = new Set();

    this.people.forEach(p => {
      const pp = pos[p.id];
      if (!pp) return;

      // Filiación padre/madre → hijo
      ['fatherID', 'motherID'].forEach(k => {
        const pid = p[k];
        if (!pid || !pos[pid]) return;
        const par = pos[pid];
        const x1 = par.x + CW / 2, y1 = par.y + CH;
        const x2 = pp.x  + CW / 2, y2 = pp.y;
        const my = (y1 + y2) / 2;
        const path = document.createElementNS(ns, 'path');
        path.setAttribute('class', 'gen-line');
        path.setAttribute('d', `M${x1},${y1} C${x1},${my} ${x2},${my} ${x2},${y2}`);
        this.svg.appendChild(path);
      });

      // Pareja (línea horizontal entre cónyuges)
      if (p.spouseID && !drawnSpouse.has(p.id + p.spouseID)) {
        drawnSpouse.add(p.id + p.spouseID);
        drawnSpouse.add(p.spouseID + p.id);
        const sp = pos[p.spouseID];
        if (!sp) return;
        const leftX  = Math.min(pp.x + CW, sp.x + CW);
        const rightX = Math.max(pp.x, sp.x);
        const y = pp.y + CH / 2;
        const line = document.createElementNS(ns, 'line');
        line.setAttribute('class', 'gen-line-spouse');
        line.setAttribute('x1', leftX);  line.setAttribute('y1', y);
        line.setAttribute('x2', rightX); line.setAttribute('y2', y);
        this.svg.appendChild(line);
      }
    });
  }

  /* ── TARJETA ─────────────────────────────────────────── */
  _makeCard(person, p) {
    const el = document.createElement('div');
    el.className = [
      'gen-card',
      `gen-card--${person.gender || 'unknown'}`,
      person.isSubject ? 'gen-card--subject' : '',
    ].join(' ').trim();
    el.style.left = p.x + 'px';
    el.style.top  = p.y + 'px';

    const initials = (person.name || '?').split(' ').slice(0, 2).map(n => n[0]).join('');

    el.innerHTML = `
      <div class="gen-card-avatar">
        ${person.photo
          ? `<img src="${person.photo}" alt="${person.name}" onerror="this.style.display='none'">`
          : initials}
      </div>
      <div class="gen-card-name">${person.name}</div>
      ${person.role ? `<div class="gen-card-role">${person.role}</div>` : ''}
    `;

    el.addEventListener('click', e => { e.stopPropagation(); this._openPanel(person); });
    return el;
  }

  /* ── PANEL LATERAL ───────────────────────────────────── */
  _openPanel(person) {
    const head = this.mount.querySelector('#gen-panel-head');
    const body = this.mount.querySelector('#gen-panel-body');

    const initials = (person.name || '?').split(' ').slice(0, 2).map(n => n[0]).join('');
    const color = person.isSubject       ? 'var(--c-dp)'
                : person.gender === 'male'   ? '#3b82f6'
                : person.gender === 'female' ? '#ec4899'
                : 'var(--s-lt)';

    const father   = this.people.find(p => p.id === person.fatherID);
    const mother   = this.people.find(p => p.id === person.motherID);
    const spouse   = this.people.find(p => p.id === person.spouseID);
    const children = this.people.filter(p => p.fatherID === person.id || p.motherID === person.id);

    head.innerHTML = `
      <div class="gen-panel-avatar" style="background:${color}">
        ${person.photo
          ? `<img src="${person.photo}" alt="${person.name}" onerror="this.style.display='none'">`
          : initials}
      </div>
      <div class="gen-panel-info">
        <div class="gen-panel-name">${person.fullName || person.name}</div>
        ${person.role ? `<div class="gen-panel-role">${person.role}</div>` : ''}
      </div>
      <button class="gen-panel-close" id="gen-panel-close"><i class="ri-close-line"></i></button>
    `;

    const rows = [
      (person.born || person.birthPlace) && {
        label: 'Nacimiento',
        value: [person.born, person.birthPlace].filter(Boolean).join(' · ')
      },
      (person.died || person.deathPlace) && {
        label: 'Fallecimiento',
        value: [person.died, person.deathPlace].filter(Boolean).join(' · ')
      },
      father   && { label: 'Padre',   value: father.name },
      mother   && { label: 'Madre',   value: mother.name },
      spouse   && { label: 'Pareja',  value: spouse.name },
      children.length && {
        label: children.length === 1 ? 'Hijo' : 'Hijos',
        value: children.map(c => c.name).join(', ')
      },
    ].filter(Boolean);

    body.innerHTML = rows.map(r => `
      <div class="gen-panel-row">
        <span class="gen-panel-label">${r.label}</span>
        <span class="gen-panel-value">${r.value}</span>
      </div>
    `).join('') + (person.bio ? `<p class="gen-panel-bio">${person.bio}</p>` : '');

    this.panel.classList.add('open');
    this.mount.querySelector('#gen-panel-close')
        .addEventListener('click', () => this._closePanel(), { once: true });
  }

  _closePanel() { this.panel.classList.remove('open'); }

  /* ── ZOOM & PAN ──────────────────────────────────────── */
  _applyTransform() {
    this.stage.style.transform = `translate(${this.panX}px,${this.panY}px) scale(${this.zoom})`;
  }

  _zoomBy(factor, ox, oy) {
    const cW = this.canvas.offsetWidth;
    const cH = this.canvas.offsetHeight;
    const cx = ox ?? cW / 2;
    const cy = oy ?? cH / 2;
    const prev = this.zoom;
    this.zoom = Math.min(2.5, Math.max(0.2, this.zoom * factor));
    this.panX = cx - (cx - this.panX) * (this.zoom / prev);
    this.panY = cy - (cy - this.panY) * (this.zoom / prev);
    this._applyTransform();
  }

  // Vista inicial: encuadra al sujeto + sus padres + abuelos (3 generaciones)
  _focusSubject() {
    const cW = this.canvas.offsetWidth  || 600;
    const cH = this.canvas.offsetHeight || 500;
    const subject = this.people.find(p => p.isSubject);
    if (!subject || !this._pos?.[subject.id]) return this._fit();

    // Recopilar IDs de las 3 generaciones cercanas
    const ids = new Set([subject.id]);
    const add = id => { if (id && this._pos[id]) ids.add(id); };

    // Padres
    add(subject.fatherID);
    add(subject.motherID);

    // Abuelos
    const father = this.people.find(p => p.id === subject.fatherID);
    const mother = this.people.find(p => p.id === subject.motherID);
    [father, mother].forEach(parent => {
      if (!parent) return;
      add(parent.fatherID);
      add(parent.motherID);
      // Cónyuge del padre/madre (para que la pareja no quede cortada)
      add(parent.spouseID);
    });
    // Cónyuge de los abuelos también
    ids.forEach(id => {
      const p = this.people.find(x => x.id === id);
      if (p?.spouseID) add(p.spouseID);
    });

    // Calcular bounding box del grupo
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    ids.forEach(id => {
      const p = this._pos[id];
      if (!p) return;
      minX = Math.min(minX, p.x);
      minY = Math.min(minY, p.y);
      maxX = Math.max(maxX, p.x + CW);
      maxY = Math.max(maxY, p.y + CH);
    });

    const MARGIN = 48;
    const groupW = maxX - minX + MARGIN * 2;
    const groupH = maxY - minY + MARGIN * 2;

    // Zoom para que el grupo quepa con un tope de 1 (no ampliar más de tamaño real)
    this.zoom = Math.min(cW / groupW, cH / groupH, 1);
    this.zoom = Math.max(0.3, this.zoom);

    // Centrar el grupo en el canvas
    const cx = (minX - MARGIN) + groupW / 2;
    const cy = (minY - MARGIN) + groupH / 2;
    this.panX = cW / 2 - cx * this.zoom;
    this.panY = cH / 2 - cy * this.zoom;

    this._applyTransform();
  }

  // Botón "Ajustar": muestra el árbol completo
  _fit() {
    const cW = this.canvas.offsetWidth  || 600;
    const cH = this.canvas.offsetHeight || 500;
    this.zoom = Math.min(cW / this._stageW, cH / this._stageH, 1) * 0.9;
    this.zoom = Math.max(0.2, this.zoom);
    this.panX = (cW - this._stageW * this.zoom) / 2;
    this.panY = (cH - this._stageH * this.zoom) / 2;
    this._applyTransform();
  }

  /* ── EVENTOS ─────────────────────────────────────────── */
  _bindEvents() {
    this.mount.querySelector('#gen-zin') .addEventListener('click', () => this._zoomBy(1.2));
    this.mount.querySelector('#gen-zout').addEventListener('click', () => this._zoomBy(1 / 1.2));
    this.mount.querySelector('#gen-fit') .addEventListener('click', () => this._fit());

    this.canvas.addEventListener('wheel', e => {
      e.preventDefault();
      const r = this.canvas.getBoundingClientRect();
      this._zoomBy(e.deltaY < 0 ? 1.12 : 0.9, e.clientX - r.left, e.clientY - r.top);
    }, { passive: false });

    this.canvas.addEventListener('mousedown', e => {
      if (e.button !== 0) return;
      this._drag = true;
      this._last = { x: e.clientX, y: e.clientY };
      this.canvas.style.cursor = 'grabbing';
    });
    window.addEventListener('mousemove', e => {
      if (!this._drag) return;
      this.panX += e.clientX - this._last.x;
      this.panY += e.clientY - this._last.y;
      this._last = { x: e.clientX, y: e.clientY };
      this._applyTransform();
    });
    window.addEventListener('mouseup', () => {
      this._drag = false;
      this.canvas.style.cursor = 'grab';
    });

    // Touch
    let lt = null;
    this.canvas.addEventListener('touchstart', e => {
      if (e.touches.length === 1) lt = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }, { passive: true });
    this.canvas.addEventListener('touchmove', e => {
      if (e.touches.length !== 1 || !lt) return;
      e.preventDefault();
      this.panX += e.touches[0].clientX - lt.x;
      this.panY += e.touches[0].clientY - lt.y;
      lt = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      this._applyTransform();
    }, { passive: false });

    this.canvas.addEventListener('click', () => this._closePanel());
    document.addEventListener('keydown', e => { if (e.key === 'Escape') this._closePanel(); });
  }
}
