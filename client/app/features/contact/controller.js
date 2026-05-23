import { ContactView } from "./view.js";
export class ContactController {
  constructor() { this.view = new ContactView(); }
  init() { this.view.render(); }
}
