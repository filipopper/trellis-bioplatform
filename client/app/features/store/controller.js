import { StoreView } from "./view.js";
export class StoreController {
  constructor() { this.view = new StoreView(); }
  init() { this.view.render(); }
}
