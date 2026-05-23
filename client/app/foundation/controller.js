import { escapeHTML } from "../shared/utils/escape-html.js";

export class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.init();
  }

  init() {
    this.renderView();
  }

  updateData(newData) {
    try {
      const escapedData = this.sanitizeData(newData);
      this.model.setData(escapedData);
      this.renderView();
    } catch (error) {
      console.error("Error updating data:", error);
      this.view.render("Error updating data");
    }
  }

  sanitizeData(data) {
    return escapeHTML(data);
  }

  renderView() {
    try {
      const data = this.model.getData();
      const escapedData = escapeHTML(data); // Escapa los datos aquí
      this.view.render(escapedData);
    } catch (error) {
      console.error("Error initializing view:", error);
      this.view.render("Error loading data");
    }
  }
}
