export class ContactModel {
  constructor() {
    this.endpoint = "https://api.filipovich.uy/contact"; // Cambiar por tu endpoint real
  }

  async sendContactForm(formData) {
    try {
      const response = await fetch(this.endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Error en la respuesta del servidor");
      }

      return await response.json();
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      throw error;
    }
  }

  getContactInfo() {
    return {
      email: "contacto@filipovich.uy",
      phone: "+598 XX XXX XXX",
      address: "Montevideo, Uruguay",
      socialMedia: {
        instagram: "https://www.instagram.com/filipopper/",
        twitter: "https://x.com/soyfilipopper",
        tiktok: "https://www.tiktok.com/@filipopper",
        youtube: "https://www.youtube.com/@filipopper",
      },
    };
  }
}
