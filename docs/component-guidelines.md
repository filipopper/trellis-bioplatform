# Component Guidelines

- Components must be framework-free and DOM-driven.
- Public API should be small (`init`, `mount`, `destroy` when needed).
- Use config objects for variants instead of branching HTML in controllers.
- Keep side effects isolated; persistence/network logic goes to `services/`.
- Keep render-cost low: cache selectors and avoid unnecessary DOM writes.
