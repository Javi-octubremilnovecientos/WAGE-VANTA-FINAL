markdown_content = """# Sistema de Diseño

Este documento define las bases visuales del sistema de diseño, extrayendo las especificaciones de color y tipografía a partir de la guía de marca proporcionada.

## 🎨 Paleta de Colores (Color Palette)

El sistema utiliza una combinación de tonos oscuros profundos con un acento vibrante en degradado naranja y un gris neutro para elementos secundarios.

| Muestra | Nombre / Uso sugerido | Hex Code |
| :--- | :--- | :--- |
| ![#D84124](https://via.placeholder.com/15/D84124/000000?text=+) | **Acento Primario (Degradado)** | `#D84124` a `#ED8B34` |
| ![#0A0A0B](https://via.placeholder.com/15/0A0A0B/000000?text=+) | **Fondo Principal (Deep Black)** | `#0A0A0B` |
| ![#121213](https://via.placeholder.com/15/121213/000000?text=+) | **Superficie Secundaria (Dark Grey)** | `#121213` |
| ![#96969F](https://via.placeholder.com/15/96969F/000000?text=+) | **Texto Desactivado / Bordes (Muted Grey)** | `#96969F` |

---

## 🔤 Tipografía (Typography)

La familia tipográfica principal es **Poppins**, una fuente sans-serif geométrica que aporta modernidad y legibilidad.

### Especificaciones de Estilo

#### Heading (Encabezados)
- **Fuente:** Poppins
- **Tamaño:** 90 px
- **Uso:** Títulos principales de gran impacto.
- **Muestra:** `ABCDEFGHIJKLMNOPQRSTUVWXYZ`
  `abcdefghijklmnopqrstuvwxyz`
  `1234567890`

#### Paragraph (Párrafos)
- **Fuente:** Poppins
- **Tamaño:** 24 px
- **Uso:** Cuerpo de texto, descripciones y contenido general.
- **Muestra:**
  `ABCDEFGHIJKLMNOPQRSTUVWXYZ`
  `abcdefghijklmnopqrstuvwxyz`
  `1234567890`

---

## 🛠️ Implementación Sugerida (CSS)

```css
:root {
  /* Colors */
  --primary-gradient: linear-gradient(135deg, #D84124 0%, #ED8B34 100%);
  --bg-primary: #0A0A0B;
  --bg-secondary: #121213;
  --text-muted: #96969F;
  --text-light: #FFFFFF;

  /* Typography */
  --font-family: 'Poppins', sans-serif;
  --size-heading: 90px;
  --size-paragraph: 24px;
}

body {
  background-color: var(--bg-primary);
  color: var(--text-light);
  font-family: var(--font-family);
  margin: 0;
}

h1 {
  font-size: var(--size-heading);
  font-weight: bold;
}

p {
  font-size: var(--size-paragraph);
  line-height: 1.5;
}