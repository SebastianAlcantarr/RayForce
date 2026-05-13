# Panel Administrativo Rayforce — Documentación Completa

> **Para quién es este documento:**  
> Está escrito en capas. Primero se explica *qué hace* algo en palabras simples, y luego *cómo lo hace* con detalles técnicos. Puedes leer hasta donde te sirva.

---

## ¿Qué es el Panel Admin?

El panel admin es una sección privada del sitio web de Rayforce (`/admin/inventario`) que solo el personal autorizado puede usar. Desde ahí pueden:

- Actualizar precios y stock de cientos de productos a la vez
- Buscar y editar un producto individual
- Crear productos nuevos en la tienda
- Descargar pedidos en formato CSV para importar en CONTPAQi
- Controlar banners y publicidad de la página de inicio
- Crear y gestionar cupones de descuento

**No es parte de WordPress.** Es una interfaz propia construida en el mismo sitio web de Rayforce, que habla con WooCommerce "por detrás" usando su API.

---

## Mapa de Archivos

```
RayForce/
├── pages/admin/
│   ├── login.vue              ← Pantalla de acceso con contraseña
│   └── inventario.vue         ← Panel principal (todos los módulos)
│
├── layouts/
│   └── admin.vue              ← Estructura visual: sidebar + header + notificaciones
│
├── middleware/
│   └── admin-auth.ts          ← Guardia de seguridad (bloquea acceso sin login)
│
├── composables/
│   └── useAdminNotify.ts      ← Sistema de notificaciones (toasts verdes/rojos)
│
└── server/api/admin/
    ├── verify-password.post.ts   ← Verifica la contraseña de acceso
    ├── search-product.get.ts     ← Busca un producto por SKU
    ├── update-product.put.ts     ← Guarda cambios de un producto
    ├── create-product.post.ts    ← Crea un producto nuevo
    ├── bulk-update.post.ts       ← Actualiza cientos de productos a la vez
    ├── export-orders.get.ts      ← Genera CSV de pedidos para CONTPAQi
    ├── upload-image.post.ts      ← Sube imágenes a la biblioteca de WordPress
    ├── categories.get.ts         ← Lista las categorías de WooCommerce
    ├── config.post.ts            ← Guarda configuración de banners/publicidad
    ├── coupons.get.ts            ← Lista los cupones
    ├── create-coupon.post.ts     ← Crea un cupón
    ├── update-coupon.put.ts      ← Edita un cupón
    └── delete-coupon.delete.ts   ← Elimina un cupón
```

---

## 1. Sistema de Autenticación

### Para el novato
El panel tiene una puerta con llave. El empleado va a `/admin/login`, escribe una contraseña (que solo Rayforce conoce), y si es correcta, el sistema le da acceso por **24 horas**. Si intenta ir directo a `/admin/inventario` sin haber entrado antes, el sistema lo manda de regreso al login automáticamente.

### Cómo funciona técnicamente

**`pages/admin/login.vue`** — La pantalla de login:
1. El usuario escribe la contraseña y presiona "Ingresar"
2. Se llama `POST /api/admin/verify-password` con la contraseña
3. Si es correcta, el servidor devuelve un `token` y una fecha de expiración (`expires`)
4. El frontend guarda esto en `localStorage` bajo la clave `rayforce_admin_session`
5. Redirige a `/admin/inventario`

```js
// Lo que se guarda en localStorage:
{ token: "dGltZXN0YW1wOjEyMzQ=", expires: 1715000000000 }
```

**`server/api/admin/verify-password.post.ts`** — El servidor:
- Lee la contraseña guardada en `.env.local` como `ADMIN_PASSWORD`
- Compara con lo que mandó el usuario (comparación directa de strings)
- Si coincide, genera un token con `Buffer.from(timestamp + primeras4letras)` codificado en base64
- Devuelve `{ token, expires: now + 24h }`

**`middleware/admin-auth.ts`** — El guardia:
- Se ejecuta automáticamente en cada navegación a rutas `/admin/*` (excepto `/admin/login`)
- Solo corre en el **cliente** (`import.meta.client`)
- Lee `localStorage.getItem('rayforce_admin_session')`
- Verifica que exista, sea JSON válido, y que `expires > Date.now()`
- Si algo falla → borra la sesión y redirige a `/admin/login`

---

## 2. Layout: La Estructura Visual

**`layouts/admin.vue`** envuelve todas las páginas del admin con tres zonas:

| Zona | Descripción |
|------|-------------|
| **Sidebar** | Barra lateral fija (220px) con logo, navegación y "Cerrar Sesión" |
| **Header** | Barra superior con ruta actual ("Panel / Inventario") y avatar |
| **`<slot />`** | El contenido real de cada página (ej: `inventario.vue`) se inyecta aquí |
| **Toast Container** | Esquina inferior derecha — muestra notificaciones animadas |

**`logout()`:** Borra `rayforce_admin_session` del localStorage y navega a `/admin/login`.

**Transiciones de toasts:** Usan `<TransitionGroup name="toast">` de Vue — entran deslizando desde la derecha y salen igual.

---

## 3. Sistema de Notificaciones

**`composables/useAdminNotify.ts`**

### Para el novato
Cada vez que algo sale bien o mal (ej: "Producto actualizado" o "Error 403"), aparece un cuadrito de color en la esquina inferior derecha que desaparece solo.

### Técnicamente
- `notifications` es un `ref<Notification[]>` **global** — compartido entre el layout y cualquier componente que llame al composable
- `push(type, message, duration)` empuja al array y programa `setTimeout` para eliminarla
- Duraciones por defecto: `error` = 6s, el resto = 4s
- En `layouts/admin.vue` se renderizan; en `inventario.vue` se disparan

```ts
const { success, error } = useAdminNotify()
success('Producto actualizado.')  // toast verde
error('Error 403: sin permisos')  // toast rojo, dura más
```

---

## 4. El Servicio de WooCommerce

**`server/services/woocomerce.ts`** — El puente con WordPress.

### Para el novato
Todos los datos de productos, pedidos y cupones viven en WordPress. Este archivo sabe cómo pedirle cosas a WordPress con las credenciales correctas. Todo el panel lo usa para no repetir esa lógica en cada endpoint.

### Autenticación
```
Authorization: Basic base64(WOO_KEY:WOO_SECRET)
```
Las credenciales se leen de `runtimeConfig` → `process.env` → `.env.local` (fallback manual con `fs.readFileSync` para compatibilidad con Windows/Node 24).

### Función principal: `wooFetch<T>(endpoint, options)`
```
URL final = ${WOO_URL}/wp-json/wc/v3${endpoint}
```
- Agrega parámetros de query si se pasan en `options.params`
- Agrega header `Authorization: Basic ...`
- Si la respuesta HTTP no es 2xx → lanza `createError()` con el status y cuerpo del error
- Retorna `response.json()` tipado como `T`

### Endpoints de WooCommerce usados por el panel

| Endpoint WC | Usado en |
|-------------|----------|
| `GET /products?sku=X` | Buscar producto, actualización masiva |
| `PUT /products/{id}` | Guardar cambios, actualización masiva |
| `POST /products` | Crear producto nuevo |
| `GET /products/categories` | Selector de categorías |
| `GET /orders` | Exportar pedidos |
| `GET /coupons` | Listar cupones |
| `POST /coupons` | Crear cupón |
| `PUT /coupons/{id}` | Editar cupón |
| `DELETE /coupons/{id}?force=1` | Eliminar cupón |
| `POST /wp/v2/media` | Subir imagen |

---

## 5. Módulo 1 — Buzón de Actualización Masiva

### Para el novato
Cuando hay cambios de precios o stock en CONTPAQi, el contador exporta un archivo Excel/CSV. Con este módulo, se arrastra ese archivo y todos los productos se actualizan automáticamente en WooCommerce.

### Flujo completo

**Frontend (tab `buzon`):**

1. **Dropzone:** Escucha `@drop` y `@change` en un `<input type="file" class="hidden">`. La clase `hidden` lo esconde y el div estilizado actúa como botón.

2. **Parseo con XLSX:**
```js
const XLSX = await import('xlsx')  // Import dinámico (solo cliente)
const wb = XLSX.read(arrayBuffer, { type: 'array' })
const rows = XLSX.utils.sheet_to_json(ws, { defval: '' })
// rows = [{ "CÓDIGO": "CAB-001", "PRECIO": "150", ... }, ...]
```

3. **Auto-detección de columnas:** Busca en los headers palabras clave (`CÓDIGO`, `PRECIO`, `EXIST`) para pre-seleccionar con `headers.findIndex(h => h.includes('CÓDIGO'))`.

4. **Ejecución:** `POST /api/admin/bulk-update` con el array de items.

**Backend (`bulk-update.post.ts`):**
```
Para cada { sku, price?, stock? }:
  1. GET /products?sku=X&per_page=1
  2. Si no existe → status: 'not_found'
  3. PUT /products/{id} con { regular_price, stock_quantity, manage_stock: true }
  4. status: 'updated' o 'error'
Devuelve: { total, updated, notFound, errors, results[] }
```

> **Nota técnica:** Opera secuencialmente (no en paralelo) para no superar el rate limit de la API de WooCommerce.

---

## 6. Módulo 2 — Modo Edición

### Para el novato
Busca un producto por SKU y permite editar todos sus datos en una pantalla: nombre, precio, stock, descripción, categorías e imagen.

### Flujo

1. `GET /api/admin/search-product?sku=X` → `GET /products?sku=X&per_page=1`
2. Respuesta: `{ id, name, sku, stock_quantity, regular_price, image, image_id, description, categories[] }`
3. El usuario edita los campos reactivos: `currentName`, `currentPrice`, `currentStock`, `currentDescription`, `currentCategories`
4. **Cambio de imagen:** `<input type="file">` oculto, preview con `URL.createObjectURL()`, se sube con `POST /api/admin/upload-image` → devuelve `{ id, src }` → el `id` se incluye al guardar
5. **Guardar:** `PUT /api/admin/update-product` → `PUT /products/{id}` en WooCommerce

**`update-product.put.ts`** solo incluye en el payload los campos que **no son undefined ni null**, evitando sobreescribir datos que el admin no tocó. Las categorías se transforman: `[1, 5]` → `[{ id: 1 }, { id: 5 }]` (formato requerido por WooCommerce).

---

## 7. Módulo 3 — Creador de Productos

### Para el novato
Para dar de alta productos que no vienen de CONTPAQi. Se llena un formulario y el producto aparece en la tienda inmediatamente.

### Campos y lógica

Campos: imagen (opcional), SKU*, nombre*, precio*, descripción, categorías (checkboxes).

**`create-product.post.ts`:**
```ts
payload = {
  name, sku,
  regular_price: String(regular_price),
  status: 'publish',    // Publicado inmediatamente
  type: 'simple',       // Producto simple (no variable)
  manage_stock: true,   // Activar control de inventario
  stock_quantity: 0,    // Empieza en 0
  description,
  categories: [{ id: X }, ...],
  images: [{ id: image_id }],  // Si se subió imagen
}
POST /products → devuelve { id, name, sku, permalink }
```

---

## 8. Módulo 4 — Exportador CONTPAQi

### Para el novato
Descarga un archivo Excel-compatible con los pedidos recientes para que el contador lo importe en CONTPAQi y haga la facturación.

### Cómo genera el CSV

**`export-orders.get.ts`:**
1. `GET /orders?per_page=N&orderby=date&order=desc`
2. Por cada pedido × cada producto en el pedido → una fila CSV:
   ```
   Folio, Fecha, Cliente, Email, SKU, Nombre, Cantidad, P.Unitario, Importe, Total, Estatus
   ```
3. `csvCell(valor)`: escapa comillas y comas para que Excel no rompa las columnas
4. Agrega **BOM UTF-8** (`\uFEFF`) al inicio → Excel en Windows abre acentos correctamente
5. Codifica en **Base64** para transportarlo en JSON

**En el frontend:**
```js
// Base64 → Blob → descarga
const binary = atob(res.data)
const bytes = new Uint8Array(binary.length)
for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
const blob = new Blob([bytes], { type: 'text/csv;charset=utf-8;' })
const a = document.createElement('a')
a.href = URL.createObjectURL(blob)
a.download = res.filename
a.click()
```

---

## 9. Módulo 5 — Publicidad (Banners)

### Para el novato
Controla qué aparece en la página de inicio de la tienda sin tocar código. Los cambios se guardan en un archivo en el servidor.

### Secciones configurables

| Sección | Qué controla |
|---------|-------------|
| **Cintillo Superior** | Texto + color + link de la barra arriba de todo |
| **Banner Intermedio** | Bloque promocional grande: título, subtítulo, botón, imagen de fondo |
| **Carrusel** | Imágenes de fondo de las 3 diapositivas del hero |
| **Banner Lateral** | Imagen junto al carrusel |
| **Video Promocional** | Sección de video MP4 en el inicio |

### Flujo de datos

```
[Admin guarda] → POST /api/admin/config → escribe data/config.json (servidor)
[Tienda carga] → GET /api/config       → lee data/config.json   → muestra banners
```

`config.post.ts` usa `fs.writeFileSync(filePath, JSON.stringify(body, null, 2))`.  
`config.get.ts` usa `fs.readFileSync(filePath, 'utf-8')` con defaults si el archivo no existe.

---

## 10. Módulo 6 — Cupones de Descuento

### Para el novato
Crea códigos como `VERANO10` que los clientes pueden ingresar en el carrito para obtener descuento. Los cupones viven en WooCommerce, así que el descuento es real en la orden de compra.

### APIs del servidor

| Endpoint | Método | Qué hace |
|----------|--------|----------|
| `/api/admin/coupons` | GET | Lista todos los cupones. Agrega campo `expired` calculado |
| `/api/admin/create-coupon` | POST | Crea cupón en WC. Acepta: código, tipo, monto, expiración, límites, emails restringidos |
| `/api/admin/update-coupon` | PUT | Edita cupón existente por `id` |
| `/api/admin/delete-coupon?id=X` | DELETE | Elimina cupón con `force=1` (sin papelera) |
| `/api/validate-coupon` | POST | **Pública.** Valida un código desde el carrito del cliente |

### Lógica de validación (`validate-coupon.post.ts`)

```
Recibe: { code, subtotal }
1. GET /coupons?code=X&per_page=1
2. Si no existe → 404
3. Si date_expires < ahora → 400 "expirado"
4. Si usage_count >= usage_limit → 400 "límite alcanzado"
5. Si subtotal < minimum_amount → 400 "mínimo requerido"
6. Calcula descuento:
   - percent:    subtotal × (amount / 100)
   - fixed_cart: min(amount, subtotal)
Devuelve: { valid, id, code, discount_type, amount, discountValue }
```

### En el carrito (`useCart.ts`)

```ts
// Estado nuevo agregado al cart:
interface Cart {
  items: CartItem[]
  coupon?: AppliedCoupon | null  // ← nuevo
}

// Computeds nuevos:
const discountAmount = computed(() => cart.value.coupon?.discountValue ?? 0)
const total = computed(() => Math.max(0, subtotal.value - discountAmount.value))
```

El cupón aplicado se persiste en `localStorage` junto con el carrito. Al crear la orden en checkout, se pasa `coupon_lines: [{ code }]` a WooCommerce para que el descuento quede registrado en el pedido real.

---

## 11. Flujo Completo de una Acción Típica

**Ejemplo: El admin actualiza el precio de un producto**

```
[Navegador]                      [Servidor Nuxt/Nitro]        [WordPress/WooCommerce]
    │                                     │                           │
    │ 1. Escribe SKU "CAB-001"            │                           │
    │ 2. Click "Buscar"                   │                           │
    │──── GET /api/admin/search-product ─▶│                           │
    │                                     │── GET /products?sku=X ───▶│
    │                                     │◀──── [{ id:42, ... }] ────│
    │◀───── { id:42, price, stock... } ───│                           │
    │                                     │                           │
    │ 3. Cambia precio a $150             │                           │
    │ 4. Click "Guardar Cambios"          │                           │
    │──── PUT /api/admin/update-product ─▶│                           │
    │    { id:42, regular_price:"150" }   │── PUT /products/42 ──────▶│
    │                                     │  { regular_price:"150" }  │
    │                                     │◀────── { updated } ───────│
    │◀─── { id:42, name, price } ─────────│                           │
    │                                     │                           │
    │ 5. Toast verde: "Actualizado ✓"     │                           │
```

---

## 12. Variables de Entorno Requeridas

```env
# .env.local

# URL del sitio WordPress (sin slash al final)
WOO_URL=https://tu-tienda.com

# API Keys de WooCommerce
# Crealas en: WooCommerce > Ajustes > Avanzado > API REST
# Permiso necesario: "Lectura/Escritura"
WOO_KEY=ck_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
WOO_SECRET=cs_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Contraseña del panel admin
ADMIN_PASSWORD=mi_contrasena_secreta

# Secret para tokens JWT del checkout
JWT_SECRET=cadena_aleatoria_muy_larga_y_segura
```

---

## 13. Seguridad

### ✅ Lo que protege el panel
- La contraseña de acceso es solo conocida por Rayforce
- La sesión expira automáticamente en 24 horas
- Las credenciales de WooCommerce **nunca llegan al navegador** — solo existen en el servidor
- Todas las llamadas a WooCommerce se hacen desde el servidor (el cliente no puede llamar a WooCommerce directamente)

### ⚠️ Limitaciones
- El middleware `admin-auth.ts` corre solo en el **cliente**. Un usuario técnico podría fabricar un JSON en `localStorage` y acceder a la UI del panel. Sin embargo, cualquier acción real (crear/editar/eliminar) pasa por el servidor, y si se quisiera agregar seguridad adicional, los endpoints de `/api/admin/*` deberían verificar el token también en el servidor.

---

## Glosario

| Término | Significado en este proyecto |
|---------|------------------------------|
| **SKU** | Código único de cada producto (ej: `CAB-001`) |
| **WooCommerce** | Plugin de tienda en línea dentro de WordPress |
| **API REST** | Forma de comunicarse con WooCommerce via peticiones HTTP que devuelven JSON |
| **CONTPAQi** | Software de contabilidad usado para facturar |
| **Nuxt / Nitro** | Framework del sitio. Nitro es la parte del servidor (donde corren los endpoints) |
| **Composable** | Función reutilizable de Vue 3 que agrupa lógica (ej: `useAdminNotify`) |
| **Middleware** | Código que se ejecuta automáticamente antes de cargar una página |
| **Toast** | Notificación pequeña que aparece y desaparece sola |
| **Base64** | Codificación para convertir archivos binarios a texto transportable en JSON |
| **BOM UTF-8** | Marca al inicio de archivos CSV para que Excel abra los acentos correctamente |
| **`defineEventHandler`** | Función de Nitro (Nuxt server) para crear endpoints del servidor |
| **`$fetch`** | Función de Nuxt para hacer peticiones HTTP desde el cliente o servidor |
| **`ref` / `computed`** | Sistema de reactividad de Vue 3 — los datos en pantalla se actualizan solos cuando cambian |
