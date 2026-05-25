import { WikiView } from './view.js';
import { WikiService } from './service.js';

export class WikiController {
  constructor() {
    this.service = new WikiService();
    this.view = new WikiView({ service: this.service });
  }

  async init(route = {}) {
    const slug = route?.postId || '';
    await this.view.render({ slug });
  }
}
