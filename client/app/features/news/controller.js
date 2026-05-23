import { NewsView } from "./view.js";
import { Model    } from "../../state/model.js";

export class NewsController {
  constructor(model) {
    this.model = model || new Model();
    this.view  = new NewsView();
  }
  async init() {
    try {
      const data = await this.model.getNews();
      this.view.render(data);
    } catch(e) {
      console.error("NewsController init error:", e);
      this.view.render([]);
    }
  }
}
