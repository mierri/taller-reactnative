# Pitstop Design System · Documentación y Guía de Adopción

> **Versión:** 1.0.0  
> **Frame base:** 393 × 852 px (móvil) · Máximo ancho de contenido: 460 px  
> **Fuente de verdad:** `Pitstop Design System.html` y `src/theme/tokens.ts`

Este documento detalla para qué se usa cada estilo, token, variante y componente del sistema de diseño **Pitstop**, especificando tamaños, colores, jerarquías y reglas de auto-layout para migrar la aplicación móvil React Native / Expo de manera consistente y sin valores arbitrarios ni hardcodeados.

---

## 1. Tipografía (17 Estilos Canónicos)

El sistema utiliza dos familias tipográficas:
* **UI**: `Inter` (pesos 400 Regular, 500 Medium, 600 SemiBold).
* **Monospace**: `JetBrains Mono` (pesos 400 Regular, 500 Medium).

> **Regla de oro de Expo/React Native**: No combines `fontFamily` con `fontWeight`. Cada peso ya es su propia familia de fuentes cargada (ej. `Inter_600SemiBold`).

| Token / Estilo | Fuente (RN) | Tamaño / Interlínea | Peso | Letter Spacing | Caso de Uso Exacto (Dónde se usa en la UI) | Antes (Was) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `display/wordmark` | `Inter_600SemiBold` | 24 / 32 px | 600 | -0.7 px | **Logo del encabezado principal** (`pitstop.`). | 23/34.5 |
| `heading/xl` | `Inter_600SemiBold` | 28 / 34 px | 600 | -0.7 px | **Título principal de pantalla** (ej. *Detalles del vehículo*, *Nueva orden*). | 27/32.4 y 28/42 |
| `heading/lg` | `Inter_600SemiBold` | 24 / 32 px | 600 | -0.5 px | **Título de paso** en hojas de guía y tarjetas hero de onboarding. | 24/32 |
| `heading/md` | `Inter_600SemiBold` | 18 / 28 px | 600 | -0.3 px | **Título de Bottom Sheets** (hojas inferiores). | 18/28 |
| `title/card` | `Inter_600SemiBold` | 16 / 24 px | 600 | -0.2 px | **Título de tarjeta de orden** (ej. nombre del vehículo *Nissan Versa*). | 15/22.5 |
| `stat/number` | `Inter_500Medium` | 28 / 32 px | 500 | -1.0 px | **Cifras destacadas del resumen** (ej. `01`, `08`). | 26/26 |
| `input` | `Inter_400Regular` | 16 / 24 px | 400 | 0.0 px | **Texto digitado dentro de campos de formulario**. | 16/24 |
| `body/lg` | `Inter_400Regular` | 14 / 22 px | 400 | 0.0 px | **Mensajes de Banners, texto de SearchBar y etiquetas de Checkbox**. | 14/22.75 y 12/18 |
| `button/md` | `Inter_600SemiBold` | 14 / 20 px | 600 | 0.0 px | **Texto de Botones**, títulos de bloque y título del Estado Vacío. | 14/20 y 13/19.5 |
| `label/lg` | `Inter_500Medium` | 14 / 20 px | 500 | 0.0 px | **Etiquetas superiores de campos** (ej. *Kilometraje*), botón Volver de detalle. | 13/19.5 |
| `body/md` | `Inter_400Regular` | 12 / 18 px | 400 | 0.0 px | **Descripciones secundarias**, subtítulos de ayuda y descripciones en cards. | 12/19.5 |
| `label/md` | `Inter_500Medium` | 12 / 16 px | 500 | 0.0 px | **Títulos de grupo**, filas de acción (`ActionRow`) y opciones de `Segmented`. | 12/16 y 11/16.5 |
| `caption` | `Inter_400Regular` | 11 / 16 px | 400 | 0.0 px | **Notas al pie, fechas pactadas**, nombres de cliente en tarjeta, subtítulos. | 10/15 y 9/13.5 |
| `caption/medium` | `Inter_500Medium` | 11 / 16 px | 500 | 0.0 px | **Texto de Badges**, etiquetas de `BottomNav`, chips contadores, inicial del avatar. | 10/15 y 8/12 |
| `eyebrow` | `Inter_600SemiBold` | 11 / 16 px | 600 | +1.5 px (UPPER) | **Encabezados de sección** (ej. *EN EL TALLER*) y fecha superior del sistema. | 10/15 |
| `mono/id` | `JetBrainsMono_500Medium` | 11 / 16 px | 500 | 0.0 px | **Folios oficiales de orden de trabajo** (ej. `OT-1049`). | 10/15 |
| `mono/plate` | `JetBrainsMono_400Regular` | 11 / 16 px | 400 | +0.5 px | **Texto de matrículas / placas de vehículo** (ej. `PXM-482-B`). | 9/13.5 |

---

## 2. Paleta de Colores y Superficies

### 2.1 Marca (`brand`)
* `brand/primary` (`#006045` claro / `#12805c` oscuro): Relleno de botones principales, fondo de segmento activo, logo, barra de avance y slider.
* `brand/primary-text` (`#006045` claro / `#5fd0a0` oscuro): Texto e iconos verdes, enlaces, punto de acento en el título y pestaña activa en navegación.
* `brand/accent-amber` (`#b68d4f` claro / `#d9ad63` oscuro): Punto indicador de notificaciones no leídas (decorativo, nunca contiene texto).

### 2.2 Texto (`text`)
Todos los colores de texto cumplen un contraste mínimo accesible de 4.5:1 sobre sus fondos designados:
* `text/strong` (`#20372d` / `#e8f1ea`): Títulos de tarjetas, nombres de cliente destacados y valores finales.
* `text/label` (`#3a4d3f` / `#c3d2c7`): Etiquetas de formularios y números del resumen.
* `text/secondary` (`#4d5e52` / `#a3b4a9`): Descripciones de apoyo, subtítulos y opciones inactivas del selector segmentado.
* `text/muted` (`#5c6b60` / `#8da093`): Captions, eyebrows, fecha, iconos inactivos y navegación secundaria.
* `text/placeholder` (`#68766c` / `#7f9386`): Texto sugerido dentro de inputs y buscadores vacíos.
* `text/on-brand` (`#ffffff` / `#ffffff`): Texto sobre fondos de color primario de marca.
* `text/avatar` (`#566b45` / `#9fc58e`): Iniciales de texto dentro del círculo de avatar de asesores.

### 2.3 Superficies y Capas (`surface` & `overlay`)
En modo oscuro cada capa sube un escalón progresivo de luminosidad (app → sheet → card → input):
* `surface/app` (`#e2e8de` / `#0e1612`): Fondo base global de la aplicación (canvas detrás de todo).
* `surface/shell` (`rgba(244,246,239,.8)` / `rgba(22,33,27,.8)`): Contenedor de la pantalla con soporte blur.
* `surface/glass` (`rgba(244,246,239,.85)` / `rgba(22,33,27,.85)`): Fondo translúcido del AppHeader (con blur 24).
* `surface/nav` (`rgba(248,250,244,.95)` / `rgba(15,24,19,.95)`): Fondo de la barra inferior de navegación BottomNav.
* `surface/sheet` (`#f1f3ed` / `#17221c`): Fondo de paneles y hojas emergentes BottomSheet.
* `surface/card` (`rgba(255,255,255,.9)` / `rgba(30,44,36,.9)`): Tarjetas de órdenes de trabajo, resúmenes y listas.
* `surface/input` (`#ffffff` / `#1b2a21`): Fondo de campos de texto y botón secundario.
* `surface/track` (`rgba(233,238,225,.7)` / `rgba(30,44,36,.7)`): Riel de fondo del control de segmentos.
* `surface/tile` (`#e6eee6` / `#1f3328`): Contenedor cuadrado redondeado para iconos de vehículos o acciones.
* `surface/chip-neutral` (`#f2f4ed` / `#213129`): Fondo del chip de matrículas / placas (`PlateChip`).
* `surface/chip-count` (`#dbe3ce` / `#2c4236`): Pastilla con el número de órdenes en el selector segmentado.
* `surface/avatar` (`#e2e9d6` / `#263a2e`): Fondo circular del avatar del asesor.
* `overlay/scrim` (`rgba(21,41,30,.35)` / `rgba(3,8,5,.6)`): Fondo oscurecido detrás de las hojas modales (con blur 3).

### 2.4 Bordes y Progreso (`border` & `progress`)
* `border/card` (`rgba(255,255,255,.9)` / `rgba(255,255,255,.07)`): Borde exterior de tarjetas.
* `border/glass` (`rgba(255,255,255,.6)` / `rgba(255,255,255,.07)`): Divisor inferior sutil del encabezado.
* `border/input` (`#e1e6de` / `#2e4237`): Contorno de inputs y línea divisoria superior del BottomNav.
* `border/button` (`#dce3d7` / `#36493d`): Borde del botón secundario.
* `border/divider` (`#edf1e7` / `#25362d`): Líneas de separación internas dentro de tarjetas y filas de lista.
* `border/dashed` (`#d1dacb` / `#3a5042`): Contorno discontinuo para estado vacío y área de firma.
* `border/grabber` (`#ccd5c5` / `#4a6054`): Tirador visual de la hoja inferior (`BottomSheet`).
* `border/control` (`#78897c` / `#6c8576`): Contorno para checkbox y switch (cumple 3:1).
* `border/focus` (`#006045` / `#5fd0a0`): Anillo exterior de 2 px al enfocar campos o botones.
* `progress/done` (`#5f8f50` / `#6fb585`): Segmento de orden o etapa concluida.
* `progress/off` (`#dde5d3` / `#26382e`): Segmento pendiente y riel desactivado del slider.

---

## 3. Estados Semánticos y Avisos (12 Familias)

Cada estado se compone de tres tokens sincronizados: `{ bg, fg, border }`. En modo claro y modo oscuro mantienen accesibilidad óptima.

| Familia | Nombre | Uso Principal | Fondo Claro / Texto Claro / Borde Claro |
| :--- | :--- | :--- | :--- |
| `neutral` | Neutral | Recibida, Entregada, Sin Cotizar, Sin Factura. | `#edf0ea` / `#4d5850` / `#cacfc8` |
| `archived` | Archivado | Orden Cerrada (inmutable, más neutra). | `#dde2dc` / `#38423b` / `#b9bfb9` |
| `info` | Informativo | En Diagnóstico, Cotizada, Banners de info. | `#dfedf4` / `#1d5d7b` / `#b4cdd9` |
| `warning` | Advertencia | En Cotización, Aprobada Parcial, Falta SAT. | `#f6eacb` / `#80530a` / `#dcc9a1` |
| `violet` | Atención | Por Aprobar (cliente), Cierre Pendiente. | `#ebe4f3` / `#5c3b88` / `#ccbfdb` |
| `active` | Activo | En Reparación, En Ejecución (verde de marca). | `#d8e9de` / `#0b5a3f` / `#abcabb` |
| `indigo` | Revisión | Control de Calidad (inspección final). | `#e3e5f4` / `#3d46a0` / `#bec2e2` |
| `success` | Éxito | Lista para Entrega, Liquidada, Facturada. | `#e2efd0` / `#3a6412` / `#bdd0a6` |
| `teal` | Fiscal | Lista para Facturar (datos SAT listos). | `#d6ede9` / `#0c665e` / `#aacfca` |
| `orange` | Prioridad | En Garantía (reingreso con prioridad alta). | `#f8e3d1` / `#9c470e` / `#e4c1a6` |
| `danger` | Peligro | Cancelada, Factura Cancelada, Declinada. | `#f6dfdc` / `#a1281f` / `#e3b7b2` |
| `late` | Retraso | **RETRASADA** (etiqueta sólida con reloj). | `#b42b40` / `#ffffff` / `#b42b40` |

### Mapeo de Enums a Familias
* **`OperationalStatus`**:
  * `RECIBIDA` → `neutral`
  * `EN_DIAGNOSTICO` → `info`
  * `EN_ESPERA_COTIZACION` → `warning`
  * `EN_ESPERA_APROBACION` → `violet`
  * `EN_REPARACION` → `active`
  * `CONTROL_CALIDAD` → `indigo`
  * `LISTA_PARA_ENTREGA` → `success`
  * `ENTREGADA` → `neutral`
  * `CERRADA` → `archived`
  * `EN_GARANTIA` → `orange`
  * `CANCELADA` → `danger`
  * Flag `isLate` / `estaRetrasada` → `late` (se renderiza en paralelo, no sustituye el estado).
* **`CommercialStatus`**:
  * `SIN_COTIZAR` → `neutral`
  * `COTIZADA` → `info`
  * `APROBADA_PARCIAL` → `warning`
  * `APROBADA_TOTAL` → `success`
  * `EN_EJECUCION` → `active`
  * `CIERRE_PENDIENTE` → `violet`
  * `COBRADA_PARCIAL` → `warning`
  * `COBRADA_TOTAL` → `success`
* **`BillingStatus`**:
  * `NO_REQUERIDA` → `neutral`
  * `PENDIENTE_DATOS` → `warning`
  * `LISTA_PARA_FACTURAR` → `teal`
  * `FACTURADA` → `success`
  * `CANCELADA` → `danger`

---

## 4. Geometría, Espaciado y Radios

### 4.1 Escala de Espaciado (`space`)
* `space[1] = 4 px`
* `space[2] = 8 px`
* `space[3] = 12 px`
* `space[4] = 16 px`
* `space[5] = 20 px`
* `space[6] = 24 px`
* `space[8] = 32 px`
* `space[10] = 40 px`
* `space[12] = 48 px`

### 4.2 Ritmo Vertical (`layout.rhythm`)
* `section = 32 px`: Separación entre grandes bloques de la pantalla.
* `group = 24 px`: Separación entre grupos de campos o elementos.
* `field = 16 px`: Separación entre campos consecutivos de formulario.
* `labelToField = 8 px`: Distancia entre la etiqueta (`label/lg`) y el control.
* `cardPadding = 16 px`: Relleno interior estándar de tarjetas de orden.
* `cardPaddingLg = 20 px`: Relleno interior para tarjetas de guía.

### 4.3 Radios de Curvatura (`radius`)
| Token | Valor | Dónde se usa en la UI |
| :--- | :--- | :--- |
| `radius.xs` | 6 px | Chip de matrículas (`PlateChip`), checkbox, contador numérico. |
| `radius.sm` | 8 px | Badges de estado (`Badge`). |
| `radius.md` | 12 px | Tiles de icono de vehículo/acciones, logotipo de marca, ítems de navegación. |
| `radius.lg` | 16 px | Controles de texto (`Field`), botones, barra de búsqueda, banners informativos. |
| `radius.xl` | 24 px | Tarjetas principales (`OrderCard`), estado vacío (`EmptyState`). |
| `radius.sheet` | 32 px | Esquinas superiores del panel modal deslizante (`BottomSheet`). |
| `radius.full` | 999 px | Avatar de asesor, pastillas de progreso y botones redondeados. |

### 4.4 Tamaños Estándar (`size`)
* `control`: `sm: 40`, `md: 48`, `lg: 52` (altura estándar de botones e inputs).
* `icon`: `xs: 12`, `sm: 16`, `md: 20`, `lg: 24`, `xl: 32`.
* `tile`: `sm: 40`, `md: 48` (tile de vehículo), `hero: 80` (icono de bienvenida).
* `avatar`: `sm: 24` (tarjeta de orden), `md: 32` (encabezado superior).
* `checkbox`: 24 px.
* `progressBar`: 4 px.
* `touchMin`: 44 px (área táctil mínima accesible para dedos).

---

## 5. Cuadrícula y Layout Móvil

* **Columnas:** 4 columnas con comportamiento de distribución fluida.
* **Márgenes laterales:** 24 px (`layout.margin`).
* **Medianil (Gutter):** 12 px entre columnas (`layout.gutter`).
* **Ancho Máximo:** 460 px centrado (`layout.maxContentWidth`).
* **AppHeader:** Fila de 56 px de altura (`layout.headerRow`) con padding inferior de 8 px.
* **BottomNav:** Altura interna de 72 px (`layout.bottomNavContent`) sobre el safe area inferior.
* **FAB (Botón Flotante):** Margen derecho de 24 px y margen de 16 px por encima de la barra inferior.

---

## 6. Especificación de Componentes y Auto-Layout

### `Button`
* **Variantes:** `Primary`, `Secondary`, `FAB`, `Icon`.
* **Dimensiones:** Altura 52 px (Icon: 48 × 48 px), padding H 20 px, gap 8 px, radio 16 px (`radius.lg`). Ancho mínimo 96 px (`fullWidth` expande al contenedor).
* **Tipografía:** `button/md` (14/20 px, peso 600).
* **Estados:**
  * *Default*: Sombra `shadows.button` (Primary) o `shadows.fab` (FAB).
  * *Pressed*: 8% más oscuro (Primary) o `surface/track` (Secondary).
  * *Disabled*: Opacidad 0.40, sin sombra.

### `Field`
* **Estructura:** Label arriba (gap 8 px), Control al centro (altura 52 px, padding H 16 px, gap 12 px, radio 16 px), Helper text abajo.
* **Tipografía:** Etiqueta en `label/lg`, texto del campo en `input` (16/24 px), helper en `body/md`.
* **Estados del control:**
  * *Default / Empty*: Borde 1 px `border/input`, texto `text/placeholder`.
  * *Filled*: Texto `text/strong`.
  * *Focus*: Borde 2 px `border/focus`, texto `text/strong`.
  * *Error*: Borde 1.5 px `status.danger.fg`, texto de error en rojo.
  * *Disabled*: Fondo `surface/track`, texto `text/placeholder`.

### `OrderCard`
* **Contenedor:** Radio 24 px (`radius.xl`), fondo `surface/card`, borde 1 px `border/card`, padding 16 px, gap 12 px, sombra `shadows.card`.
* **Fila Superior (MetaRow):** Folio en `mono/id` (JetBrains Mono 11/16 px, color `text/muted`) a la izquierda; fecha límite a la derecha con icono reloj 12 px + texto en `caption`.
* **Fila Principal (MainRow):** Tile de 48 × 48 px (radio 12 px, fondo `surface/tile`, icono auto 24 px en color `brand/primary-text`), bloque de información en el centro (título del vehículo en `title/card`, fila con `PlateChip` + cliente en `caption`), chevron 20 px a la derecha.
* **Fila Inferior (Footer):** Borde superior de 1 px `border/divider`, padding superior de 12 px. Badge de estado a la izquierda (con Badge `Retrasada` si aplica) y Asesor a la derecha (avatar 24 px con inicial en `caption/medium` + nombre en `caption`).
* **Barra de Progreso:** 6 segmentos de 4 px de alto, radio 999 px, gap 8 px. Segmentos concluidos en `progress/done`, pendientes en `progress/off`.

### `Badge` y `PlateChip`
* **Badge Estándar:** Padding V 4 px, H 12 px, radio 8 px (`radius.sm`), borde 1 px. Círculo (dot) de 8 × 8 px + texto en `caption/medium` (11/16 px, peso 500). Color obtenido de la familia semántica `{ bg, fg, border }`.
* **Badge Retrasada (`late`):** Sólido (fondo `#b42b40`), padding V 4 px, H 8 px, radio 8 px, icono reloj 12 px + texto "RETRASADA" en mayúsculas sin dot.
* **PlateChip:** Fondo `surface/chip-neutral`, padding V 4 px, H 8 px, radio 6 px (`radius.xs`), texto en `mono/plate` (JetBrains Mono 11/16 px, color `text/secondary`).

### `Segmented`
* **Contenedor:** Altura 56 px, padding 4 px, gap 4 px, radio 16 px, fondo `surface/track`.
* **Opción (Item):** Altura 48 px, radio 12 px, padding H 12 px, gap 8 px.
  * *Activo*: Fondo `brand/primary`, texto blanco `text/on-brand`, sombra `shadows.segmented`.
  * *Inactivo*: Fondo transparente, texto `text/secondary`.
  * *Texto:* `label/md` (12/16 px, peso 500).
  * *Chip Contador:* Altura 20 px, padding H 8 px, radio 6 px, fondo `surface/chip-count` (o blanco 25% si está activo), texto en `caption/medium`.

### `SectionTitle`
* **Estructura:** Altura mínima 48 px, alineación horizontal con espacio intermedio.
* **Izquierda:** Texto en `eyebrow` (11/16 px, peso 600, espaciado +1.5 px, mayúsculas, color `text/muted`).
* **Derecha:** Contador en `caption` (ej. "2 órdenes") + botón de filtros de 48 × 48 px.

### `Banner` (Inline y Floating/Toast)
* **Contenedor:** Radio 16 px, borde 1 px, padding 16 px (8 px a la derecha si es descartable con cruz de cierre).
* **Colores:** Familia `info`, `warning`, `danger` o `success`.
* **Icono:** 20 × 20 px a la izquierda. Título en `button/md`, mensaje en `body/lg`.
* **Variante Floating:** Sombra `shadows.floating`, posicionado flotante con márgenes de 16 px.

### `EmptyState`
* **Contenedor:** Borde 1 px discontinuo (`border/dashed`), radio 24 px (`radius.xl`), padding V 40 px, H 24 px, sin fondo.
* **Elementos:** Icono de 32 px en `text/muted`, título en `button/md` (`text/strong`), descripción en `body/md` (ancho máx. 280 px, `text/secondary`), botón secundario opcional con margen superior de 12 px.

### `BottomSheet`
* **Scrim:** Fondo `overlay/scrim` con efecto blur de 3 px.
* **Hoja:** Radio superior 32 px (`radius.sheet`), fondo `surface/sheet`, sombra `shadows.sheet`.
* **Grabber:** Centrado arriba, 36 × 4 px, radio 999 px, color `border/grabber`, margen superior 12 px.
* **Encabezado:** Altura 72 px, título en `heading/md`, botón de cerrar de 48 × 48 px.
* **Contenido:** Padding horizontal y vertical de 24 px + safe area inferior.

---

## 7. Reglas de Implementación en el Código
1. **Sin valores numéricos ni colores hardcodeados:** Todos los estilos deben leerse desde `useTheme()` (`theme.typography.*`, `theme.colors.*`, `theme.space.*`, `theme.radius.*`, `theme.shadows.*`).
2. **Archivos menores a 300 líneas:** Mantener los componentes desacoplados y modulares.
3. **Cero comentarios en código:** Cumplir con las políticas estrictas de estilo del proyecto.
4. **Mapeo directo de estados:** Conectar los enums provenientes del backend (`RECIBIDA`, `EN_REPARACION`, etc.) directamente con `OperationalStatus[status].family` para derivar automáticamente su tonalidad sin sentencias `switch` manuales.
