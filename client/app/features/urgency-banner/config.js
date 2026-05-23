export const urgencyBannerConfig = {
  storageKey: "urgency-dismissed-oct2026",
  defaultPriority: 100,

  banners: [
    {
      id: "main",
      selector: "#urgency-banner",
      closeSelector: "#urgency-close",

      priority: 100,
      dismissMode: "local",

      media: {
        type: "none",
        lazy: true,
      },

      countdown: {
        selector: ".countdown",
        endsAt: "2026-12-31T23:59:59Z",
        expiredText: "Evento finalizado",
      },

      cta: {
        selector: ".urgency-cta",
      },
    },
  ],
};
