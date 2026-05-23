export class View {
  constructor() {
    this.content = document.getElementById("content");
    if (!this.content) {
      console.error("Element with id 'content' not found.");
    }
  }

  render(data) {
    // Añade animación de fade-in
    this.content.classList.remove("fade-in");
    void this.content.offsetWidth; // Forzar reflow para reiniciar la animación
    this.content.classList.add("fade-in");
  }
}
