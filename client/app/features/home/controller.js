import { HomeView } from "./view.js";
export class HomeController {
  constructor() { this.view = new HomeView(); }
  init() { this.view.render(); }
}
