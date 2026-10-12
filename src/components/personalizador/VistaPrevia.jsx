// Vista previa sobre la foto del producto. El texto se dibuja dentro de
// zonaTexto (porcentajes de la foto, definidos en el JSON).
// Si el producto tiene imagenPrevia (p. ej. una foto apaisada), se usa esa
// con su proporción; la imagen normal 4:5 queda para la tarjeta del catálogo.
import DisenoSvg from './DisenoSvg'

export default function VistaPrevia({ producto, lineas, tamanos, fuente, color, adorno, posicion, ajuste, verZona, descripcion, onMedida }) {
  const z = producto.zonaTexto
  // El diseño ocupa "escala" % de la zona; el hueco sobrante permite moverlo.
  const t = ajuste.escala
  const libre = 100 - t
  const izq = libre / 2 + (ajuste.desX / 100) * (libre / 2)
  const arr = libre / 2 + (ajuste.desY / 100) * (libre / 2)
  const zonaCm = z.anchoCm ? { ancho: (z.anchoCm * t) / 100, alto: (z.altoCm * t) / 100 } : null
  return (
    <figure className="previa">
      <div
        className={`previa__lienzo${producto.proporcionPrevia ? ' previa__lienzo--propia' : ''}`}
        style={producto.proporcionPrevia ? { aspectRatio: producto.proporcionPrevia } : undefined}
      >
        <img src={producto.imagenPrevia || producto.imagen} alt={`${producto.nombre} personalizado`} />
        <div
          className={`previa__zona${verZona ? ' previa__zona--visible' : ''}`}
          style={{ left: `${z.x}%`, top: `${z.y}%`, width: `${z.ancho}%`, height: `${z.alto}%` }}
        >
          <div className="previa__diseno" style={{ left: `${izq}%`, top: `${arr}%`, width: `${t}%`, height: `${t}%` }}>
            <DisenoSvg lineas={lineas} tamanos={tamanos} fuente={fuente} color={color} adorno={adorno} posicion={posicion} alineaciones={ajuste.alineaciones} zonaCm={zonaCm} onMedida={onMedida} sombra />
          </div>
        </div>
      </div>
      <figcaption className="sr-only" aria-live="polite">{descripcion}</figcaption>
    </figure>
  )
}
