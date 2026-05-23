document.addEventListener("DOMContentLoaded", () => {
  // Registrar Service Worker (PWA)
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/client/app/core/pwa/service-worker.js", { scope: "/" })
      .catch(() => {}); // silencioso en file://
  }

  // Logo bounce
  const logo = document.getElementById("logo-smiling-face");
  let bouncing = false;
  logo?.addEventListener("click", () => {
    if (bouncing) return;
    bouncing = true;
    logo.classList.add("jump");
    setTimeout(() => { logo.classList.remove("jump"); bouncing = false; }, 550);
  });

  // Dark mode toggle
  const darkBtn = document.getElementById("dark-mode-toggle");
  const html    = document.documentElement;
  const saved   = localStorage.getItem("theme");
  if (saved === "dark") html.setAttribute("data-theme", "dark");
  darkBtn?.addEventListener("click", () => {
    const isDark = html.getAttribute("data-theme") === "dark";
    html.setAttribute("data-theme", isDark ? "light" : "dark");
    localStorage.setItem("theme", isDark ? "light" : "dark");
    if (darkBtn) darkBtn.setAttribute("aria-label", isDark ? "Activar modo oscuro" : "Desactivar modo oscuro");
    if (darkBtn) darkBtn.innerHTML = isDark ? '<i class="ri-moon-line" aria-hidden="true"></i>' : '<i class="ri-sun-line" aria-hidden="true"></i>';
  });
  // Sync icon on load
  if (darkBtn && saved === "dark") darkBtn.innerHTML = '<i class="ri-sun-line" aria-hidden="true"></i>';

  // TRUE STICKY BEHAVIOR - Header becomes fixed after scrolling past it
  const header = document.getElementById("main-header");
  const urgencyBanner = document.getElementById("urgency-banner");
  let headerOffset = 0;
  let stickyPlaceholder = null;
  
  // Calculate initial header offset
  const calculateHeaderOffset = () => {
    if (!header) return;
    
    // Get header's original position (including urgency banner if present)
    const headerRect = header.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    headerOffset = headerRect.top + scrollTop;
    
    // If urgency banner exists and is visible, account for it
    if (urgencyBanner && urgencyBanner.offsetHeight > 0) {
      headerOffset = urgencyBanner.offsetHeight;
    }
  };
  
  // Create placeholder to prevent content jump when header becomes fixed
  const createPlaceholder = () => {
    if (!stickyPlaceholder) {
      stickyPlaceholder = document.createElement('div');
      stickyPlaceholder.id = 'header-placeholder';
      stickyPlaceholder.style.display = 'none';
      header.parentNode.insertBefore(stickyPlaceholder, header.nextSibling);
    }
  };
  
  const onScroll = () => {
    if (!header) return;
    
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > headerOffset) {
      // Make sticky
      if (!header.classList.contains('is-sticky')) {
        header.classList.add('is-sticky');
        header.classList.add('scrolled');
        
        // Create placeholder to prevent layout shift
        if (stickyPlaceholder) {
          stickyPlaceholder.style.height = header.offsetHeight + 'px';
          stickyPlaceholder.style.display = 'block';
        }
      }
    } else {
      // Remove sticky
      if (header.classList.contains('is-sticky')) {
        header.classList.remove('is-sticky');
        header.classList.remove('scrolled');
        
        // Hide placeholder
        if (stickyPlaceholder) {
          stickyPlaceholder.style.display = 'none';
        }
      }
    }
  };
  
  // Initialize
  calculateHeaderOffset();
  createPlaceholder();
  onScroll();
  
  // Listen to scroll with passive flag for better performance
  window.addEventListener("scroll", onScroll, { passive: true });
  
  // Recalculate on resize
  window.addEventListener("resize", () => {
    calculateHeaderOffset();
    onScroll();
  }, { passive: true });
  
  // Recalculate when urgency banner is closed
  const urgencyClose = document.getElementById("urgency-close");
  if (urgencyClose) {
    urgencyClose.addEventListener("click", () => {
      setTimeout(() => {
        calculateHeaderOffset();
        onScroll();
      }, 400); // Wait for banner close animation
    });
  }
});
