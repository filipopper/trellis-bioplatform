import { AboutView } from "./view.js";
export class AboutController {
  constructor() { this.view = new AboutView(); }
  init() { this.view.render(); }
}
