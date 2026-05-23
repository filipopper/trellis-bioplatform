# 📸 Guía: Agregar Foto al Hero (Estilo Campaña Política)

## 🎯 ¿Qué se agregó?

Se añadió soporte para incluir una **foto de persona sin fondo** en la sección hero, con un diseño profesional tipo campaña política.

## ✨ Características del Diseño

### Efectos Visuales:
- ✅ **Glow effect carmesí** detrás de la foto (efecto resplandor)
- ✅ **Drop shadow profesional** para dar profundidad
- ✅ **Línea decorativa** gradiente debajo de la foto
- ✅ **Hover effect sutil** (escala 1.02x al pasar el mouse)
- ✅ **Responsive**: En mobile, la foto aparece arriba del texto

### Layout:
- **Desktop**: Texto a la izquierda, foto a la derecha (380px)
- **Mobile**: Foto arriba (400px), texto abajo

## 📋 Paso a Paso

### 1. Prepara tu Foto

#### Especificaciones técnicas:
```
Formato:     PNG con fondo transparente
Tamaño:      700-1000px ancho × 900-1200px alto
Proporción:  2:3 o 3:4 (vertical)
Peso:        < 500 KB (optimizada)
```

#### Recomendaciones de la foto:
- **Pose**: De pie, brazos cruzados o a los lados
- **Encuadre**: Cuerpo completo o desde la cintura
- **Fondo**: Transparente (usa remove.bg, photoscissors.com, etc.)
- **Iluminación**: Profesional, luz frontal y lateral
- **Ropa**: Formal o semi-formal (camisa, blazer, traje)
- **Expresión**: Seria pero accesible, mirada a cámara
- **Ángulo**: Ligeramente desde abajo para dar presencia

#### Herramientas para remover fondo:
1. **remove.bg** (https://www.remove.bg/) - Automático, gratis
2. **Photopea** (https://www.photopea.com/) - Photoshop online
3. **GIMP** - Gratuito, manual
4. **Photoshop** - Profesional

### 2. Guarda la Foto

```bash
# Ubicación recomendada:
client/assets/img/filipovich-hero.png

# Otros nombres posibles:
client/assets/img/candidato-hero.png
client/assets/img/perfil-hero.png
```

### 3. Modifica el HTML

Abre `client/app/features/home/view.js` y busca la sección hero:

#### ANTES (sin foto):
```html
<div class="hero-inner">
  <div class="hero-text">
    <!-- contenido -->
  </div>
  <div class="hero-badge-stack">
    <!-- badges -->
  </div>
</div>
```

#### DESPUÉS (con foto):
```html
<div class="hero-inner with-photo">
  <div class="hero-text">
    <!-- contenido -->
  </div>
  
  <!-- NUEVO: Agrega esto -->
  <div class="hero-photo">
    <img 
      src="client/assets/img/filipovich-hero.png" 
      alt="Nicolás Filipovich"
      loading="eager"
    />
  </div>
</div>
```

### 4. (Opcional) Quitar los Badges

Si usas foto, puedes quitar los badges para dar más espacio:

```html
<!-- OPCIÓN A: Con foto SIN badges -->
<div class="hero-inner with-photo">
  <div class="hero-text">...</div>
  <div class="hero-photo">...</div>
</div>

<!-- OPCIÓN B: Con foto Y badges (más lleno) -->
<div class="hero-inner with-photo">
  <div class="hero-text">
    <!-- texto y botones -->
    
    <!-- Badges dentro del hero-text -->
    <div class="hero-badge-stack" style="margin-top: var(--sp-6);">
      <div class="hero-badge">...</div>
    </div>
  </div>
  <div class="hero-photo">...</div>
</div>
```

## 🎨 Personalización Avanzada

### Cambiar el color del glow:

En `client/styles/global/layout.css`, busca `.hero-photo::before` y modifica:

```css
.hero-photo::before {
  /* Carmesí (default) */
  background: radial-gradient(
    ellipse at center bottom,
    rgba(202, 103, 142, 0.25) 0%,
    rgba(202, 103, 142, 0.1) 40%,
    transparent 70%
  );
}

/* ALTERNATIVA: Esmeralda */
background: radial-gradient(
  ellipse at center bottom,
  rgba(34, 142, 103, 0.25) 0%,
  rgba(34, 142, 103, 0.1) 40%,
  transparent 70%
);

/* ALTERNATIVA: Azul */
background: radial-gradient(
  ellipse at center bottom,
  rgba(59, 130, 246, 0.25) 0%,
  rgba(59, 130, 246, 0.1) 40%,
  transparent 70%
);
```

### Ajustar tamaño de la foto:

```css
/* Foto más grande */
.hero-inner.with-photo {
  grid-template-columns: 1fr 450px; /* era 380px */
}

.hero-photo {
  max-width: 450px;
  height: 550px; /* era 480px */
}
```

### Cambiar posición (foto a la izquierda):

```css
.hero-inner.with-photo {
  grid-template-columns: 380px 1fr; /* invertido */
}
```

## 📱 Vista Mobile

En pantallas pequeñas (≤768px):
- La foto aparece **arriba** (order: -1)
- Altura reducida a 400px
- Ancho 100% del contenedor
- Los badges se apilan horizontalmente

## 🖼️ Ejemplo Completo

Ver el archivo `EJEMPLO-HERO-CON-FOTO.html` para ver el código completo comentado.

## ⚡ Tips de Performance

1. **Optimiza la imagen:**
   ```bash
   # Usa TinyPNG o similar
   # PNG con fondo transparente optimizado
   # Máximo 500 KB
   ```

2. **Lazy loading NO recomendado:**
   ```html
   <!-- USAR ESTO (eager) -->
   <img loading="eager" ... />
   
   <!-- NO usar lazy en hero -->
   <img loading="lazy" ... /> ❌
   ```

3. **Considera WebP:**
   ```html
   <picture>
     <source srcset="img/hero.webp" type="image/webp">
     <img src="img/hero.png" alt="...">
   </picture>
   ```

## 🎭 Ejemplos de Fotos Profesionales

### ✅ BUENAS prácticas:
- Pose confiada, brazos cruzados
- Fondo removido limpiamente
- Buena iluminación, sin sombras duras
- Expresión seria pero accesible
- Ropa profesional, bien planchada
- Mirada directa a la cámara

### ❌ EVITAR:
- Fotos casuales o informales
- Fondos borrosos o mal recortados
- Iluminación pobre o contraluz
- Poses rígidas o incómodas
- Ropa muy casual
- Fotos pixeladas o de baja calidad

## 🔄 Volver al diseño sin foto

Si quieres volver al diseño original:

1. Quita la clase `with-photo`:
   ```html
   <!-- Cambiar esto -->
   <div class="hero-inner with-photo">
   
   <!-- Por esto -->
   <div class="hero-inner">
   ```

2. Elimina el `<div class="hero-photo">` completo

3. Restaura los badges si los quitaste

## 📊 Comparación

| Aspecto | Sin Foto | Con Foto |
|---------|----------|----------|
| **Impacto Visual** | Moderado | Alto |
| **Personalización** | Badges | Imagen real |
| **Espacio** | Más compacto | Más amplio |
| **Mobile** | 1 columna | Foto arriba |
| **Carga** | Rápida | Media |
| **Mantenimiento** | Fácil | Requiere foto |

## 🎯 Casos de Uso

### Usar foto CUANDO:
- ✅ Campaña política activa
- ✅ Tienes foto profesional de calidad
- ✅ Quieres maximizar reconocimiento personal
- ✅ Estilo de comunicación más cercano

### NO usar foto CUANDO:
- ⚠️ No tienes foto profesional
- ⚠️ Prefieres enfoque en propuestas
- ⚠️ Quieres diseño más minimalista
- ⚠️ Foto no representa imagen actual

---

**¿Necesitas ayuda?** Revisa `EJEMPLO-HERO-CON-FOTO.html` para código completo con comentarios.
