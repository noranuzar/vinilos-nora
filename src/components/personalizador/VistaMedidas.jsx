// "Tu propio objeto": no hay foto, así que se muestra el diseño con una regla
// en centímetros. La altura de letra elegida se toma como altura de las mayúsculas.
import { useTexto, Lineas, Adorno, cajaAdorno, unir, alineacionGeneral, useInformarMedida, MAYUSCULA } from './DisenoSvg'


const cm = (mm) => (mm / 10).toLocaleString('es-ES', { maximumFractionDigits: 1 })

export default function VistaMedidas({ lineas, tamanos = [], fuente, color, adorno, posicion, alineaciones, altoLetraCm, descripcion, onMedida }) {
  const tam = (altoLetraCm * 10) / MAYUSCULA          // unidades = milímetros
  const texto = useTexto({ lineas, fuente, alineaciones, tamanos, tam })
  const caja = texto.caja
  const general = alineacionGeneral(alineaciones, lineas.length)
  const cAdorno = adorno && caja ? cajaAdorno(caja, posicion, tam * 0.75, tam * 0.18, general) : null
  const total = unir(caja, cAdorno)
  useInformarMedida(total ? { letraCm: altoLetraCm, anchoCm: total.width / 10, altoCm: total.height / 10 } : null, onMedida)

  // Regla bajo el diseño, del ancho del diseño redondeado al cm superior.
  const reglaY = total ? total.y + total.height + tam * 0.25 : 0
  const largo = total ? Math.max(10, Math.ceil(total.width / 10) * 10) : 0
  const reglaX = total ? total.x + total.width / 2 - largo / 2 : 0
  const paso = largo > 200 ? 50 : largo > 80 ? 20 : 10   // etiquetas legibles
  const fuenteRegla = Math.max(3.5, largo / 32)
  const m = total ? Math.max(total.width, total.height) * 0.06 : 0
  const vb = total
    ? `${Math.min(total.x, reglaX) - m} ${total.y - m} ${Math.max(total.width, largo) + 2 * m} ${reglaY - total.y + fuenteRegla * 2.6 + 2 * m}`
    : '-200 -100 400 200'

  return (
    <figure className="previa previa--medidas">
      <div className="previa__lienzo previa__lienzo--medidas">
        <svg className="diseno-svg" viewBox={vb} preserveAspectRatio="xMidYMid meet" aria-hidden="true">
          <Lineas lineas={lineas} fuente={fuente} color={color} tam={tam} alineaciones={alineaciones} tamanos={tamanos} texto={texto} />
          <Adorno adorno={adorno} caja={cAdorno} color={color} />
          {total && (
            <g className="regla" style={{ fontFamily: 'Nunito Sans, sans-serif' }}>
              <line x1={reglaX} x2={reglaX + largo} y1={reglaY} y2={reglaY} strokeWidth={fuenteRegla / 8} />
              {Array.from({ length: largo / 10 + 1 }, (_, i) => (
                <g key={i}>
                  <line
                    x1={reglaX + i * 10} x2={reglaX + i * 10}
                    y1={reglaY} y2={reglaY + ((i * 10) % paso === 0 ? fuenteRegla * 0.9 : fuenteRegla * 0.5)}
                    strokeWidth={fuenteRegla / 10}
                  />
                  {(i * 10) % paso === 0 && (
                    <text x={reglaX + i * 10} y={reglaY + fuenteRegla * 2.1} fontSize={fuenteRegla} textAnchor="middle">{i}</text>
                  )}
                </g>
              ))}
            </g>
          )}
        </svg>
      </div>
      <figcaption className="previa__medidas" aria-live="polite">
        {total ? (
          <>Medida aproximada del diseño: <strong>{cm(total.width)} × {cm(total.height)} cm</strong> (regla en cm)</>
        ) : 'Calculando medidas…'}
        <span className="sr-only">. {descripcion}</span>
      </figcaption>
    </figure>
  )
}
