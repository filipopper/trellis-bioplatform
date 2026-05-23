import { JoinView } from "./view.js";
export class JoinController {
  constructor() { this.view = new JoinView(); }
  init() { this.view.render(); }
}
