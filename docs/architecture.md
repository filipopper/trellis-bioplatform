# Arquitectura del cliente

## Filosofía

La arquitectura está diseñada para **evitar entropía**: cada módulo tiene owner explícito, dirección de dependencias controlada y límites verificables.

## Capas y ownership

- `client/app/main.js`: bootstrap SPA y composición general.
- `client/app/core/router/*`: orquestación de navegación y wiring de controllers.
- `client/app/state/*`: estado y acceso a datos transversales de la app.
- `client/app/features/<feature>/*`: dominio funcional aislado (controller/view/services/config/data adapters locales).
- `client/app/shared/*`: reutilizables reales (sin contexto de dominio).
- `client/app/core/*`: infraestructura técnica (scripts runtime, wiring no-domain).
- `client/styles/global/*`: tokens/layout/base global.
- `client/styles/features/*`: estilos de dominio.
- `client/app/features/<feature>/data/*`: datos estructurados propiedad de dominio.

## Flujo de dependencias permitido

1. `app/main` -> `core/router`, `state`, `features`.
2. `core/router` -> `features`.
3. `features` -> `shared`, `state`, `core` base classes (`/client/app/foundation/view.js`, `/client/app/foundation/controller.js`) y su propio feature.
4. `shared` no puede depender de `features`.
5. Ningún feature puede importar otro feature directamente.

## Reglas de organización

- **Feature-local primero**: si solo lo usa una feature, vive dentro de esa feature.
- **Shared por criterio estricto**: mínimo 2 consumidores + independencia de dominio.
- **Config junto al owner**:
  - global runtime/router en `app/router` o `app/main`.
  - config de dominio en `app/features/<feature>/config.js`.
- **Servicios**:
  - storage/render helpers globales en `app/shared/services`.
  - lógica de negocio de feature en `app/features/<feature>/service.js`.
- **Estilos**:
  - no duplicar reglas de dominio en global.
  - si un selector representa una feature, su CSS va a `styles/features`.

## Cuándo crear módulo nuevo

Crear módulo nuevo solo cuando exista:
- frontera de dominio clara,
- comportamiento propio,
- y potencial de crecimiento independiente.

## Cuándo NO crear módulo nuevo

No crear módulo para:
- helpers de 1 uso,
- wrappers triviales sin encapsulación real,
- separación “por estética” sin ownership técnico.

## Safeguard automático

- Script de boundaries: `scripts/check-architecture.mjs`.
- Ejecutar: `node scripts/check-architecture.mjs`.
- Falla si hay imports cruzados entre features o dependencias fuera de capa permitida.
