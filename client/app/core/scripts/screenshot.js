/**
 * screenshot.js — Captura limpia de vistas sin header ni footer
 *
 * Uso: añade #pic al final del hash de cualquier vista.
 */

(function () {
  "use strict";

  const HTML2CANVAS_CDN =
    "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";

  function loadHtml2Canvas() {
    if (window.html2canvas) return Promise.resolve(window.html2canvas);
    return new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = HTML2CANVAS_CDN;
      s.onload = () => resolve(window.html2canvas);
      s.onerror = () => reject(new Error("No se pudo cargar html2canvas"));
      document.head.appendChild(s);
    });
  }

  function parsePicFlag() {
    const raw = location.hash;
    if (!raw.endsWith("#pic")) return { hasPic: false, cleanHash: raw };
    const cleanHash = raw.slice(0, -4);
    return { hasPic: true, cleanHash };
  }

  function waitForContentReady(contentEl) {
    return new Promise((resolve) => {
      function waitForChildren() {
        if (contentEl.children.length > 0) {
          waitForImages();
        } else {
          const observer = new MutationObserver(() => {
            if (contentEl.children.length > 0) {
              observer.disconnect();
              waitForImages();
            }
          });
          observer.observe(contentEl, { childList: true, subtree: true });

          setTimeout(() => {
            observer.disconnect();
            waitForImages();
          }, 5000);
        }
      }

      function waitForImages() {
        const imgs = Array.from(contentEl.querySelectorAll("img"));
        const pending = imgs.filter((img) => !img.complete);

        if (pending.length === 0) {
          resolve();
          return;
        }

        let loaded = 0;
        function onLoad() {
          if (++loaded >= pending.length) resolve();
        }

        pending.forEach((img) => {
          img.addEventListener("load", onLoad, { once: true });
          img.addEventListener("error", onLoad, { once: true });
        });
      }

      waitForChildren();
    });
  }

  function waitForDomStability(root, timeout = 1500) {
    return new Promise((resolve) => {
      let lastChange = Date.now();

      const observer = new MutationObserver(() => {
        lastChange = Date.now();
      });

      observer.observe(root, {
        childList: true,
        subtree: true,
        attributes: true,
      });

      const interval = setInterval(() => {
        if (Date.now() - lastChange > timeout) {
          clearInterval(interval);
          observer.disconnect();
          resolve();
        }
      }, 100);
    });
  }


  async function waitForMotionToEnd(root, maxWait = 2500) {
    if (!root.getAnimations) return;

    const start = Date.now();

    while (Date.now() - start < maxWait) {
      const running = root
        .getAnimations({ subtree: true })
        .filter((anim) => anim.playState === "running" || anim.playState === "pending");

      if (running.length === 0) return;

      await Promise.race([
        Promise.allSettled(running.map((anim) => anim.finished)),
        new Promise((resolve) => setTimeout(resolve, 120)),
      ]);
    }
  }

  function freezeMotion() {
    const style = document.createElement("style");
    style.id = "pic-motion-freeze";
    style.textContent = `
      * , *::before, *::after {
        animation: none !important;
        transition: none !important;
      }
    `;
    document.head.appendChild(style);

    return () => style.remove();
  }

  async function waitForFonts() {
    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready;
    }
  }

  function showToast(message, type = "info") {
    document.getElementById("pic-toast")?.remove();

    const toast = document.createElement("div");
    toast.id = "pic-toast";

    Object.assign(toast.style, {
      position: "fixed",
      bottom: "24px",
      right: "24px",
      zIndex: "99999",
      background: type === "error" ? "#c0392b" : "#1a1a2e",
      color: "#fff",
      padding: "12px 18px",
      borderRadius: "10px",
      fontSize: "14px",
      fontFamily: "system-ui, sans-serif",
      boxShadow: "0 4px 20px rgba(0,0,0,.35)",
      display: "flex",
      alignItems: "center",
      gap: "10px",
      maxWidth: "320px",
      opacity: "0",
      transition: "opacity .3s",
    });

    const icon = type === "error" ? "✖" : type === "success" ? "✔" : "⏳";

    toast.innerHTML = `<span style="font-size:18px">${icon}</span><span>${message}</span>`;
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
      toast.style.opacity = "1";
    });

    if (type !== "info") {
      setTimeout(() => {
        toast.style.opacity = "0";
        setTimeout(() => toast.remove(), 350);
      }, 3500);
    }

    return toast;
  }

  async function captureView(viewName) {
    const toast = showToast("Preparando captura…");

    try {
      const h2c = await loadHtml2Canvas();
      const contentEl = document.getElementById("content");

      if (!contentEl) throw new Error("No existe #content");

      toast.querySelector("span:last-child").textContent =
        "Esperando contenido…";

      await waitForContentReady(contentEl);
      await waitForDomStability(contentEl);
      await waitForFonts();
      await waitForMotionToEnd(contentEl);

      toast.querySelector("span:last-child").textContent = "Capturando…";

      window.scrollTo(0, 0);

      await new Promise((r) =>
        requestAnimationFrame(() => requestAnimationFrame(r)),
      );

      const releaseMotion = freezeMotion();

      const bgColor =
        getComputedStyle(document.documentElement)
          .getPropertyValue("--bg-primary")
          ?.trim() ||
        getComputedStyle(document.body).backgroundColor ||
        "#ffffff";

      let canvas;
      try {
        canvas = await h2c(contentEl, {
          useCORS: true,
          allowTaint: false,
          scale: window.devicePixelRatio || 1,
          backgroundColor: bgColor,
          scrollX: 0,
          scrollY: 0,
          windowWidth: document.documentElement.scrollWidth,
          windowHeight: document.documentElement.scrollHeight,
          ignoreElements: (el) =>
            el.id === "main-header" ||
            el.classList.contains("footer") ||
            el.id === "urgency-banner" ||
            el.id === "pic-toast",
        });
      } finally {
        releaseMotion();
      }

      const filename = `${viewName || "captura"}-${Date.now()}.png`;

      const link = document.createElement("a");
      link.download = filename;
      link.href = canvas.toDataURL("image/png");
      link.click();

      toast.remove();
      showToast(`Guardado: ${filename}`, "success");
    } catch (err) {
      console.error("[screenshot.js]", err);
      toast.remove();
      showToast(`Error: ${err.message}`, "error");
    }
  }

  async function checkAndCapture() {
    const { hasPic, cleanHash } = parsePicFlag();
    if (!hasPic) return;

    const viewName = cleanHash.replace(/^#\/?/, "").split("/")[0] || "home";

    const contentEl = document.getElementById("content");
    if (!contentEl) {
      console.error("No existe #content");
      return;
    }

    await captureView(viewName);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", checkAndCapture);
  } else {
    checkAndCapture();
  }

  window.addEventListener("hashchange", () => {
    setTimeout(checkAndCapture, 0);
  });
})();
