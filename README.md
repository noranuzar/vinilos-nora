# Vinilos Nora · Tienda online

Regalos personalizados con vinilo adhesivo y textil. Catálogo, personalizador, cesta y pedido por WhatsApp.
React + Vite, desplegado en Vercel desde GitHub.

## Estado

- [x] Paso 1 · Portada
- [ ] Paso 2 · Catálogo
- [ ] Paso 3 · Ficha + personalizador
- [ ] Paso 4 · Cesta
- [ ] Paso 5 · Pedido por WhatsApp
- [ ] Galería "Trabajos reales"

## Probar en local

```bash
npm install
npm run dev
```

## Publicar

Sube la carpeta a un repo de GitHub e impórtalo en Vercel (Framework: Vite). No necesita variables de entorno.
`vercel.json` ya incluye la regla para que las URLs de producto funcionen al recargar.

## Editar productos, precios, fuentes y colores

Todo está en **`src/data/catalogo.json`**.

- `precioBase`, `extra`, `precioUnidad`: pon el número sin el símbolo € (ej. `12.5`). Si lo dejas en `null`, la web muestra "Precio a consultar".
- `config.whatsapp`: número con prefijo 34, sin espacios ni `+`.
- `config.diasMinimosEntrega`: días de antelación mínimos.
- `activo: false` oculta un producto sin borrarlo.
- `colores` (lista general): inventario real de vinilo. 14 adhesivos y 8 textiles. Cada color lleva `acabado` (mate, brillo o `null` si está pendiente) y `hex`, una muestra de pantalla **provisional** (`hexProvisional: true`): es una aproximación pendiente de calibrar, no una medición del material.
- `colores` (en cada producto): lista de colores permitidos. `null` = todos los de su tipo. En taza, vaso y cuaderno se han quitado Blanco y Plateado porque no se verían sobre un objeto claro.
- Colores retirados (no reutilizar estos ids para otro color): `ad-oro`, `ad-plata`, `ad-rosa`, `ad-azul`, `tx-oro`, `tx-rosa`, `tx-azul`, `tx-rojo`, `tx-granate`. Si una cesta guardada tiene uno de ellos, la página de la cesta avisa de que ya no está disponible.
- `config.avisoColores`: aviso de tonos orientativos bajo el selector de color.
- `permiteAdorno`: si el producto admite uno de los adornos de `adornos` (corazón, estrella, corona, margarita, ramita de olivo). Su precio va en `extra`.
- `tu-objeto`: producto para quien trae su propio objeto. No tiene foto; la clienta elige la altura de letra en cm (`medidas.altoLetraCm`).
- `zonaTexto`: dónde se pinta el texto sobre la foto, en % (x, y, ancho, alto). `anchoCm` y `altoCm` son la medida real aproximada de esa zona; con ellas la ficha calcula la altura de las letras en cm. **Ajústalas con tus productos reales.**
- `config.altoLetraMinimoCm`: altura mínima de letra por tipo de vinilo (adhesivo 0,5 cm, textil 0,6 cm). Cada fuente puede pedir más (`tamanoMinCm`: Pacifico 0,8, Dancing Script 1) y cada producto también (`altoLetraMinCm`: llavero 1 cm). Se aplica la más exigente. Por debajo, la ficha avisa y ofrece ajustar.
- `config.avisoPrueba`: texto del aviso de prueba de corte (ficha y pie).
- `plantillas[].tamLineas`: tamaño relativo de cada línea en los diseños de ejemplo (p. ej. `[1, 0.55]` = fecha más pequeña). El mínimo de letra se comprueba en la línea principal.

## Fotos

Ponlas en `public/img/productos/` con estos nombres:
`tote.jpg`, `body.jpg`, `vaso.jpg`, `taza.jpg`, `tarro.jpg`, `cuaderno.jpg`, `llavero.jpg`.
Formato vertical 4:5, mínimo 1200 px de ancho, foto frontal con la superficie lisa visible.

Las fotos de trabajos reales van en `public/img/galeria/`.

## Fuentes del personalizador

8 fuentes gratuitas de Google Fonts, licencia OFL (uso comercial y venta de lo cortado permitidos), 2 por estilo:

| Estilo | Fuentes |
|---|---|
| Caligrafía | Pacifico, Dancing Script (Bold) |
| Elegante | Playfair Display (Bold), Abril Fatface |
| Moderna | Montserrat (Bold), Bebas Neue |
| Infantil | Fredoka (SemiBold), Baloo 2 (Bold) |

Instala estas mismas en el ordenador del plóter, con el mismo grosor, para que lo cortado coincida con la vista previa. Si cambias una fuente en el JSON, cámbiala también en el enlace de Google Fonts de `index.html`.

## Migración a Supabase (v2)

Solo hay que cambiar `src/lib/datos.js`: devolver la misma forma de objeto leyendo de Supabase. Ningún componente lee el JSON directamente.
