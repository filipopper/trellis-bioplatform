import { UrgencyBannerService } from "./service.js";
import { reportError } from "../../core/runtime-errors.js";

export class UrgencyBannerManager {
  constructor(config) {
    this.config = config;
    this.service = new UrgencyBannerService(config);

    this.openBanners = new Map();

    this.boundKeydown = (event) => {
      if (event.key !== "Escape") return;

      for (const [id, meta] of this.openBanners.entries()) {
        if (meta.el.style.display !== "none") {
          this.dismiss(meta.el, meta.key, meta.mode);
          this.openBanners.delete(id);
        }
      }
    };
  }

  init() {
    const sorted = [...(this.config?.banners || [])]
      .sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));

    if (!sorted.length) return;

    document.addEventListener(
      "keydown",
      this.boundKeydown
    );

    sorted.forEach((bannerConfig) =>
      this.mountBanner(bannerConfig)
    );
  }

  mountBanner(bannerConfig) {
    const el = document.querySelector(
      bannerConfig.selector
    );

    if (!el) return;

    const key =
      `${this.config.storageKey}-${bannerConfig.id}`;

    if (
      this.service.isDismissed(
        key,
        bannerConfig.dismissMode
      )
    ) {
      el.style.display = "none";
      return;
    }

    this.openBanners.set(
      bannerConfig.id,
      {
        el,
        key,
        mode: bannerConfig.dismissMode,
      }
    );

    const closeButton = document.querySelector(
      bannerConfig.closeSelector
    );

    closeButton?.addEventListener(
      "click",
      () => {
        this.dismiss(
          el,
          key,
          bannerConfig.dismissMode
        );

        this.openBanners.delete(
          bannerConfig.id
        );
      }
    );

    if (bannerConfig.countdown) {
      this.startCountdown(
        el,
        bannerConfig.countdown
      );
    }
  }

  dismiss(el, key, mode) {
    el.classList.add("dismissing");

    el.style.maxHeight =
      `${el.scrollHeight}px`;

    requestAnimationFrame(() => {
      el.style.transition =
        "max-height 0.35s ease, opacity 0.35s ease, transform 0.35s ease";

      el.style.maxHeight = "0";
      el.style.opacity = "0";

      setTimeout(() => el.remove(), 360);
    });

    this.service.setDismissed(key, mode);
  }

  startCountdown(el, countdownConfig) {
    const target = el.querySelector(
      countdownConfig.selector
    );

    if (!target) return;

    const endTime = new Date(
      countdownConfig.endsAt
    ).getTime();

    if (Number.isNaN(endTime)) {
      reportError(
        "urgency-banner.countdown",
        new Error("Invalid endsAt date"),
        {
          endsAt:
            countdownConfig.endsAt,
        }
      );

      return;
    }

    const tick = () => {
      const remaining =
        endTime - Date.now();

      if (remaining <= 0) {
        target.textContent =
          countdownConfig.expiredText ??
          "00:00:00";

        return;
      }

      const h = String(
        Math.floor(remaining / 36e5)
      ).padStart(2, "0");

      const m = String(
        Math.floor(
          (remaining % 36e5) / 6e4
        )
      ).padStart(2, "0");

      const s = String(
        Math.floor(
          (remaining % 6e4) / 1000
        )
      ).padStart(2, "0");

      target.textContent =
        `${h}:${m}:${s}`;

      requestAnimationFrame(tick);
    };

    tick();
  }
}