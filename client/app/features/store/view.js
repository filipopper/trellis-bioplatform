export class StoreView {
  constructor() {
    this.content = document.getElementById("content");
    try {
      const raw = JSON.parse(localStorage.getItem("fili_cart") || "[]");
      this.cart = Array.isArray(raw)
        ? raw
            .filter(
              (i) =>
                i && typeof i.id !== "undefined" && typeof i.price === "number",
            )
            .map((i) => ({
              ...i,
              variations: Array.isArray(i.variations) ? i.variations : [],
              quantity: i.quantity || 1,
            }))
        : [];
    } catch (_) {
      this.cart = [];
    }

    this.products = [
      {
        id: 1,
        name: "Taza cerámica",
        price: 800,
        currency: "$",
        badge: "Más vendido",
        description:
          "Cerámica de alta calidad con diseño exclusivo del movimiento.",
        baseImage: "client/assets/img/product-placeholder.svg",
        variations: [
          {
            name: "Diseño",
            required: true,
            options: [
              {
                name: "Nicolás Filipovich",
                image: "client/assets/img/product-placeholder.svg",
              },
              {
                name: "Con logo",
                image: "client/assets/img/product-placeholder.svg",
              },
              {
                name: "Blanca",
                image: "client/assets/img/product-placeholder.svg",
              },
            ],
          },
          {
            name: "Tamaño",
            required: true,
            options: [
              { name: "Standard 300ml", image: null },
              { name: "Grande 450ml", image: null },
            ],
          },
        ],
      },
      {
        id: 2,
        name: "Gorra",
        price: 500,
        currency: "$",
        badge: null,
        description: "Logo bordado de alta calidad. Talle único ajustable.",
        baseImage: "client/assets/img/gorra-base.webp",
        variations: [
          {
            name: "Color",
            required: true,
            options: [
              { name: "Negro", image: "client/assets/img/gorra-negra.webp" },
              { name: "Blanco", image: "client/assets/img/gorra-blanca.webp" },
            ],
          },
        ],
      },
      {
        id: 3,
        name: "Stickers · 50 u.",
        price: 60,
        currency: "$",
        badge: "Mejor precio",
        description: "50 stickers surtidos, resistentes al agua.",
        baseImage: "client/assets/img/stickers.webp",
        variations: [],
      },
    ];

    // Track selected variations and qty per product
    this.selections = {};
    this.quantities = {};
    this.products.forEach((p) => {
      this.selections[p.id] = {};
      this.quantities[p.id] = 1;
    });
    this.activeProduct = this.products[0];
  }

  // ── Persistence ────────────────────────────────────────────
  _save() {
    try {
      localStorage.setItem("fili_cart", JSON.stringify(this.cart));
    } catch (_) {}
  }
  _fmt(n) {
    return `$${n.toLocaleString("es-UY", { minimumFractionDigits: 0 })}`;
  }
  _subtotal() {
    return this.cart.reduce((s, i) => s + i.price * i.quantity, 0);
  }
  _count() {
    return this.cart.reduce((s, i) => s + i.quantity, 0);
  }

  // ── Main render ────────────────────────────────────────────
  render() {
    this.content.innerHTML = `
<div class="sv-root">

  <!-- LEFT: product list -->
  <div class="sv-left">
    <div class="sv-left-head">
      <div class="sv-left-title">
        <span class="sv-overline">Tienda oficial</span>
        <h2>Apoyá el movimiento</h2>
        <p>El 100% de las ganancias va a la causa.</p>
      </div>
      <div class="sv-badges">
        <span class="sv-badge sv-badge-green"><i class="ri-heart-line"></i>Causa social</span>
        <span class="sv-badge"><i class="ri-map-pin-line"></i>Envío nacional</span>
      </div>
    </div>

    <div class="sv-product-list" id="sv-list">
      ${this.products.map((p) => this._productRow(p)).join("")}
    </div>

    <div class="sv-how">
      <i class="ri-information-2-line"></i>
      <span>Elegís productos → los agregás → te contactamos por WhatsApp para coordinar pago y envío.</span>
    </div>
  </div>

  <!-- RIGHT: configurator + cart -->
  <div class="sv-right">

    <!-- Configurator -->
    <div class="sv-config-panel" id="sv-config">
      <div class="sv-config-inner" id="sv-config-inner">
        ${this._configHTML(this.activeProduct)}
      </div>
    </div>

    <!-- Cart -->
    <div class="sv-cart" id="sv-cart">
      <div class="sv-cart-head">
        <span class="sv-cart-title"><i class="ri-shopping-cart-2-line"></i> Carrito</span>
        <span class="sv-cart-count" id="sv-cart-count">0 productos</span>
      </div>
      <div class="sv-cart-body" id="sv-cart-body">
        <div class="sv-cart-empty" id="sv-cart-empty">
          <i class="ri-shopping-cart-line"></i>
          <p>Tu carrito está vacío</p>
        </div>
        <div class="sv-cart-items" id="sv-cart-items" style="display:none"></div>
      </div>
      <div class="sv-cart-foot" id="sv-cart-foot" style="display:none">
        <div class="sv-cart-total-row">
          <span>Total</span>
          <span class="sv-cart-total" id="sv-cart-total">$0</span>
        </div>
        <button class="sv-checkout-btn" id="sv-checkout-btn">
          <i class="ri-whatsapp-line"></i> Hacer pedido por WhatsApp
        </button>
        <button class="sv-clear-btn" id="sv-clear-btn">Vaciar carrito</button>
      </div>
    </div>

  </div>
</div>

<!-- Checkout modal -->
<div class="sv-modal-overlay" id="sv-modal" style="display:none">
  <div class="sv-modal-box">
    <div class="sv-modal-head">
      <div>
        <h3>Finalizar pedido</h3>
        <p>Revisá tu pedido y completá tus datos</p>
      </div>
      <button class="sv-modal-close" id="sv-modal-close"><i class="ri-close-line"></i></button>
    </div>
    <div class="sv-modal-body">
      <div class="sv-modal-items" id="sv-modal-items"></div>
      <div class="sv-modal-prices" id="sv-modal-prices"></div>
      <div class="sv-modal-form">
        <div class="sv-form-row">
          <div class="sv-form-group">
            <label>Nombre completo *</label>
            <input type="text" id="sv-name" placeholder="Tu nombre completo" autocomplete="name" />
            <span class="sv-field-err" id="sv-err-name"></span>
          </div>
          <div class="sv-form-group">
            <label>Método de pago *</label>
            <select id="sv-pay">
              <option value="" disabled selected>Seleccioná</option>
              <option value="Prex">Prex</option>
              <option value="Efectivo">Efectivo al recibir</option>
              <option value="MercadoPago">MercadoPago (+10%)</option>
            </select>
            <span class="sv-field-err" id="sv-err-pay"></span>
          </div>
        </div>
        <div class="sv-form-row">
          <div class="sv-form-group">
            <label>Entrega *</label>
            <select id="sv-del">
              <option value="" disabled selected>Seleccioná</option>
              <option value="Coordinar">A coordinar</option>
              <option value="Retiro">Retiro en persona</option>
              <option value="Envío">Envío a domicilio (+$5)</option>
            </select>
            <span class="sv-field-err" id="sv-err-del"></span>
          </div>
          <div class="sv-form-group" id="sv-addr-group" style="display:none">
            <label>Dirección de envío</label>
            <input type="text" id="sv-addr" placeholder="Calle, número, localidad" />
          </div>
        </div>
        <div class="sv-form-group">
          <label>Notas (opcional)</label>
          <textarea id="sv-notes" rows="2" placeholder="Instrucciones especiales, horarios..."></textarea>
        </div>
      </div>
    </div>
    <div class="sv-modal-foot">
      <button class="sv-modal-back" id="sv-modal-back"><i class="ri-arrow-left-line"></i> Volver</button>
      <button class="sv-modal-confirm" id="sv-modal-confirm"><i class="ri-whatsapp-line"></i> Confirmar pedido</button>
    </div>
  </div>
</div>
`;
    this._bind();
    this._renderCart();
  }

  // ── Product row (left panel) ───────────────────────────────
  _productRow(p) {
    return `
    <div class="sv-product-row ${p.id === this.activeProduct.id ? "active" : ""}"
         data-pid="${p.id}" role="button" tabindex="0">
      <div class="sv-product-img">
        <img src="${p.baseImage}" alt="${p.name}"
             onerror="this.src='client/assets/img/product-placeholder.svg'" />
        ${p.badge ? `<span class="sv-product-badge">${p.badge}</span>` : ""}
      </div>
      <div class="sv-product-info">
        <div class="sv-product-name">${p.name}</div>
        <div class="sv-product-desc">${p.description}</div>
      </div>
      <div class="sv-product-price">
        <span class="sv-price-cur">${p.currency}</span>
        <span class="sv-price-amt">${p.price.toLocaleString("es-UY")}</span>
      </div>
    </div>`;
  }

  // ── Configurator HTML ──────────────────────────────────────
  _configHTML(p) {
    const sel = this.selections[p.id] || {};
    const qty = this.quantities[p.id] || 1;

    const varHtml = p.variations
      .map(
        (v, vi) => `
      <div class="sv-var-group">
        <div class="sv-var-label">${v.name}${v.required ? " *" : ""}</div>
        <div class="sv-var-opts">
          ${v.options
            .map(
              (o, oi) => `
            <button class="sv-var-opt ${sel[vi] === oi ? "selected" : ""}"
                    data-pid="${p.id}" data-vi="${vi}" data-oi="${oi}"
                    data-img="${o.image || ""}">
              ${o.name}
            </button>`,
            )
            .join("")}
        </div>
        <div class="sv-var-err hidden" id="sv-verr-${p.id}-${vi}">Seleccioná una opción</div>
      </div>`,
      )
      .join("");

    return `
      <div class="sv-config-header">
        <div class="sv-config-img-wrap">
          <img class="sv-config-img" id="sv-config-img-${p.id}"
               src="${p.baseImage}" alt="${p.name}"
               onerror="this.src='client/assets/img/product-placeholder.svg'" />
          ${p.badge ? `<span class="sv-product-badge">${p.badge}</span>` : ""}
        </div>
        <div class="sv-config-info">
          <div class="sv-config-name">${p.name}</div>
          <div class="sv-config-desc">${p.description}</div>
          <div class="sv-config-price">${p.currency}${p.price.toLocaleString("es-UY")}</div>
        </div>
      </div>

      ${p.variations.length ? `<div class="sv-vars">${varHtml}</div>` : ""}

      <div class="sv-qty-add">
        <div class="sv-qty-ctrl">
          <button class="sv-qty-btn" data-pid="${p.id}" data-action="dec">−</button>
          <span class="sv-qty-val" id="sv-qty-${p.id}">${qty}</span>
          <button class="sv-qty-btn" data-pid="${p.id}" data-action="inc">+</button>
        </div>
        <button class="sv-add-btn" data-pid="${p.id}">
          <i class="ri-shopping-cart-2-line"></i> Agregar al carrito
        </button>
      </div>`;
  }

  // ── Bind all events ────────────────────────────────────────
  _bind() {
    // Product row selection
    this.content.querySelectorAll(".sv-product-row").forEach((row) => {
      const activate = () => {
        const pid = +row.dataset.pid;
        this.activeProduct = this.products.find((p) => p.id === pid);
        this.content
          .querySelectorAll(".sv-product-row")
          .forEach((r) => r.classList.remove("active"));
        row.classList.add("active");
        document.getElementById("sv-config-inner").innerHTML = this._configHTML(
          this.activeProduct,
        );
        this._bindConfig();
      };
      row.addEventListener("click", activate);
      row.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          activate();
        }
      });
    });

    this._bindConfig();

    // Cart actions
    document
      .getElementById("sv-checkout-btn")
      ?.addEventListener("click", () => this._openModal());
    document.getElementById("sv-clear-btn")?.addEventListener("click", () => {
      this.cart = [];
      this._save();
      this._renderCart();
      this._toast("Carrito vaciado", "info");
    });

    // Modal
    document
      .getElementById("sv-modal-close")
      ?.addEventListener("click", () => this._closeModal());
    document
      .getElementById("sv-modal-back")
      ?.addEventListener("click", () => this._closeModal());
    document.getElementById("sv-modal")?.addEventListener("click", (e) => {
      if (e.target.id === "sv-modal") this._closeModal();
    });
    document
      .getElementById("sv-modal-confirm")
      ?.addEventListener("click", () => this._processOrder());
    document
      .getElementById("sv-pay")
      ?.addEventListener("change", () => this._updatePrices());
    document.getElementById("sv-del")?.addEventListener("change", () => {
      this._updatePrices();
      const del = document.getElementById("sv-del")?.value;
      const ag = document.getElementById("sv-addr-group");
      if (ag) ag.style.display = del === "Envío" ? "" : "none";
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") this._closeModal();
    });
  }

  _bindConfig() {
    const p = this.activeProduct;

    // Variation buttons
    this.content
      .querySelectorAll(`.sv-var-opt[data-pid="${p.id}"]`)
      .forEach((btn) => {
        btn.addEventListener("click", () => {
          const vi = +btn.dataset.vi;
          const oi = +btn.dataset.oi;
          this.content
            .querySelectorAll(
              `.sv-var-opt[data-pid="${p.id}"][data-vi="${vi}"]`,
            )
            .forEach((b) => b.classList.remove("selected"));
          btn.classList.add("selected");
          this.selections[p.id] = { ...this.selections[p.id], [vi]: oi };
          if (btn.dataset.img) {
            const img = document.getElementById(`sv-config-img-${p.id}`);
            if (img) img.src = btn.dataset.img;
          }
          document
            .getElementById(`sv-verr-${p.id}-${vi}`)
            ?.classList.add("hidden");
        });
      });

    // Qty
    this.content
      .querySelectorAll(`.sv-qty-btn[data-pid="${p.id}"]`)
      .forEach((btn) => {
        btn.addEventListener("click", () => {
          let q = this.quantities[p.id] || 1;
          if (btn.dataset.action === "inc" && q < 20) q++;
          if (btn.dataset.action === "dec" && q > 1) q--;
          this.quantities[p.id] = q;
          const el = document.getElementById(`sv-qty-${p.id}`);
          if (el) el.textContent = q;
        });
      });

    // Add to cart
    this.content
      .querySelector(`.sv-add-btn[data-pid="${p.id}"]`)
      ?.addEventListener("click", () => this._addToCart(p.id));
  }

  _addToCart(pid) {
    const p = this.products.find((x) => x.id === pid);
    let ok = true;

    // Validate required variations
    p.variations.forEach((v, vi) => {
      if (!v.required) return;
      const err = document.getElementById(`sv-verr-${pid}-${vi}`);
      if (this.selections[pid]?.[vi] === undefined) {
        err?.classList.remove("hidden");
        ok = false;
      } else {
        err?.classList.add("hidden");
      }
    });
    if (!ok) return;

    const sel = this.selections[pid] || {};
    const vars = p.variations
      .map((v, vi) => {
        const oi = sel[vi];
        return oi !== undefined
          ? { name: v.name, value: v.options[oi].name }
          : null;
      })
      .filter(Boolean);

    const qty = this.quantities[pid] || 1;
    const img =
      document.getElementById(`sv-config-img-${pid}`)?.src || p.baseImage;
    const key = JSON.stringify(vars);
    const idx = this.cart.findIndex(
      (x) => x.id === pid && JSON.stringify(x.variations) === key,
    );

    if (idx >= 0) this.cart[idx].quantity += qty;
    else
      this.cart.push({
        id: pid,
        name: p.name,
        price: p.price,
        quantity: qty,
        variations: vars,
        image: img,
      });

    this._save();
    this._renderCart();
    this._toast(`✓ ${p.name} agregado`, "success");

    // Reset qty
    this.quantities[pid] = 1;
    const qEl = document.getElementById(`sv-qty-${pid}`);
    if (qEl) qEl.textContent = 1;
  }

  // ── Cart rendering ─────────────────────────────────────────
  _renderCart() {
    const count = this._count();
    const total = this._subtotal();

    const countEl = document.getElementById("sv-cart-count");
    const emptyEl = document.getElementById("sv-cart-empty");
    const itemsEl = document.getElementById("sv-cart-items");
    const footEl = document.getElementById("sv-cart-foot");
    const totalEl = document.getElementById("sv-cart-total");

    if (countEl)
      countEl.textContent = `${count} producto${count !== 1 ? "s" : ""}`;
    if (totalEl) totalEl.textContent = this._fmt(total);

    if (count === 0) {
      if (emptyEl) emptyEl.style.display = "";
      if (itemsEl) itemsEl.style.display = "none";
      if (footEl) footEl.style.display = "none";
      return;
    }

    if (emptyEl) emptyEl.style.display = "none";
    if (itemsEl) itemsEl.style.display = "";
    if (footEl) footEl.style.display = "";

    if (itemsEl) {
      itemsEl.innerHTML = this.cart
        .map(
          (item, idx) => `
        <div class="sv-cart-item">
          <img class="sv-cart-item-img" src="${item.image}"
               onerror="this.src='client/assets/img/product-placeholder.svg'" />
          <div class="sv-cart-item-info">
            <div class="sv-cart-item-name">${item.name}</div>
            ${
              (item.variations || []).length
                ? `<div class="sv-cart-item-vars">${item.variations.map((v) => `${v.name}: ${v.value}`).join(" · ")}</div>`
                : ""
            }
            <div class="sv-cart-item-controls">
              <button class="sv-cqty-btn" data-idx="${idx}" data-action="dec">−</button>
              <span class="sv-cqty-val">${item.quantity}</span>
              <button class="sv-cqty-btn" data-idx="${idx}" data-action="inc">+</button>
              <span class="sv-citem-price">${this._fmt(item.price * item.quantity)}</span>
            </div>
          </div>
          <button class="sv-cart-del" data-idx="${idx}" aria-label="Eliminar"><i class="ri-delete-bin-6-line"></i></button>
        </div>`,
        )
        .join("");

      itemsEl.querySelectorAll(".sv-cqty-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          const i = +btn.dataset.idx;
          if (btn.dataset.action === "inc" && this.cart[i].quantity < 20)
            this.cart[i].quantity++;
          else if (btn.dataset.action === "dec") {
            if (this.cart[i].quantity > 1) this.cart[i].quantity--;
            else {
              this.cart.splice(i, 1);
            }
          }
          this._save();
          this._renderCart();
        });
      });
      itemsEl.querySelectorAll(".sv-cart-del").forEach((btn) => {
        btn.addEventListener("click", () => {
          const name = this.cart[+btn.dataset.idx].name;
          this.cart.splice(+btn.dataset.idx, 1);
          this._save();
          this._renderCart();
          this._toast(`${name} eliminado`, "info");
        });
      });
    }
  }

  // ── Modal ──────────────────────────────────────────────────
  _openModal() {
    if (!this.cart.length) {
      this._toast("El carrito está vacío", "warn");
      return;
    }
    const modal = document.getElementById("sv-modal");
    if (!modal) return;
    this._updatePrices();
    const itemsEl = document.getElementById("sv-modal-items");
    if (itemsEl) {
      itemsEl.innerHTML = this.cart
        .map(
          (item) => `
        <div class="sv-modal-item">
          <img src="${item.image}" onerror="this.src='client/assets/img/product-placeholder.svg'" />
          <div>
            <div class="sv-modal-item-name">${item.name} <span>×${item.quantity}</span></div>
            ${(item.variations || []).length ? `<div class="sv-modal-item-vars">${item.variations.map((v) => `${v.name}: ${v.value}`).join(" · ")}</div>` : ""}
          </div>
          <div class="sv-modal-item-price">${this._fmt(item.price * item.quantity)}</div>
        </div>`,
        )
        .join("");
    }
    modal.style.display = "";
    requestAnimationFrame(() => modal.classList.add("open"));
    document.body.style.overflow = "hidden";
  }

  _closeModal() {
    const modal = document.getElementById("sv-modal");
    if (!modal) return;
    modal.classList.remove("open");
    setTimeout(() => {
      modal.style.display = "none";
    }, 280);
    document.body.style.overflow = "";
  }

  _updatePrices() {
    const sub = this._subtotal();
    const pay = document.getElementById("sv-pay")?.value;
    const del = document.getElementById("sv-del")?.value;
    const surcharge = pay === "MercadoPago" ? sub * 0.1 : 0;
    const delivery = del === "Envío" ? 5 : 0;
    const pricesEl = document.getElementById("sv-modal-prices");
    if (pricesEl) {
      pricesEl.innerHTML = `
        <div class="sv-price-row"><span>Subtotal</span><span>${this._fmt(sub)}</span></div>
        ${surcharge ? `<div class="sv-price-row"><span>Recargo MercadoPago</span><span>${this._fmt(surcharge)}</span></div>` : ""}
        ${delivery ? `<div class="sv-price-row"><span>Envío</span><span>${this._fmt(delivery)}</span></div>` : ""}
        <div class="sv-price-total"><span>Total</span><span>${this._fmt(sub + surcharge + delivery)}</span></div>`;
    }
  }

  _processOrder() {
    const name = document.getElementById("sv-name")?.value.trim();
    const pay = document.getElementById("sv-pay")?.value;
    const del = document.getElementById("sv-del")?.value;
    const addr = document.getElementById("sv-addr")?.value.trim();
    const notes = document.getElementById("sv-notes")?.value.trim();

    let ok = true;
    const setErr = (id, msg) => {
      const e = document.getElementById(id);
      if (e) e.textContent = msg;
      ok = false;
    };
    const clrErr = (id) => {
      const e = document.getElementById(id);
      if (e) e.textContent = "";
    };

    if (!name) setErr("sv-err-name", "Ingresá tu nombre");
    else clrErr("sv-err-name");
    if (!pay) setErr("sv-err-pay", "Seleccioná un método");
    else clrErr("sv-err-pay");
    if (!del) setErr("sv-err-del", "Seleccioná entrega");
    else clrErr("sv-err-del");
    if (!ok) return;

    const sub = this._subtotal();
    const surcharge = pay === "MercadoPago" ? sub * 0.1 : 0;
    const delivery = del === "Envío" ? 5 : 0;
    const total = sub + surcharge + delivery;

    const msg = `*Pedido — Filipovich™*
${"─".repeat(30)}
${this.cart
  .map(
    (i) =>
      `• ${i.name} ×${i.quantity} → ${this._fmt(i.price * i.quantity)}` +
      ((i.variations || []).length
        ? `\n  ${i.variations.map((v) => `${v.name}: ${v.value}`).join(", ")}`
        : ""),
  )
  .join("\n")}
${"─".repeat(30)}
Subtotal: ${this._fmt(sub)}${surcharge ? `\nRecargo (MercadoPago): ${this._fmt(surcharge)}` : ""}${delivery ? `\nEnvío: ${this._fmt(delivery)}` : ""}
*Total: ${this._fmt(total)}*
${"─".repeat(30)}
Pago: ${pay}
Entrega: ${del}${addr ? `\nDirección: ${addr}` : ""}
Nombre: ${name}${notes ? `\nNotas: ${notes}` : ""}
Fecha: ${new Date().toLocaleString("es-UY")}`;

    window.open(
      `https://wa.me/59892955928?text=${encodeURIComponent(msg)}`,
      "_blank",
    );
    this._closeModal();
    this.cart = [];
    this._save();
    this._renderCart();
    this._toast("¡Pedido enviado! 🎉", "success");
  }

  // ── Toast ──────────────────────────────────────────────────
  _toast(msg, type = "info") {
    document.querySelectorAll(".sv-toast").forEach((t) => t.remove());
    const colors = {
      success: "var(--e-dp)",
      warn: "#B06E00",
      info: "var(--s-dk)",
    };
    const icons = {
      success: "ri-checkbox-circle-line",
      warn: "ri-error-warning-line",
      info: "ri-information-2-line",
    };
    const el = document.createElement("div");
    el.className = "sv-toast";
    el.style.background = colors[type] || colors.info;
    el.innerHTML = `<i class="${icons[type] || icons.info}"></i><span>${msg}</span>`;
    document.body.appendChild(el);
    requestAnimationFrame(() => el.classList.add("show"));
    setTimeout(() => {
      el.classList.remove("show");
      setTimeout(() => el.remove(), 300);
    }, 3000);
  }
}
