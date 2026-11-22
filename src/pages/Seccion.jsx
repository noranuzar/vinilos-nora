import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useCatalogo } from '../context/CatalogoContext'
import { lineasDelDiseno, tamMuestra } from '../lib/diseno'
import DisenoTaller from '../components/DisenoTaller'

// Página de una sección (Bebé y niños, Equipos…): el cliente escribe el nombre
// y ve todos los diseños de la sección con su nombre al momento.
export default function Seccion() {
  const { id } = useParams()
  const { secciones, ocasiones, plantillas, fuentes, adornos, disenosTaller } = useCatalogo()
  const [texto, setTexto] = useState('')
  const seccion = secciones.find((s) => s.id === id)

  if (!seccion) {
    return (
      <section className="seccion">
        <div className="contenedor">
          <h1>No encuentro esta sección</h1>
          <Link to="/">Volver al inicio</Link>
        </div>
      </section>
    )
  }

  const idsOcasion = ocasiones.filter((o) => o.seccion === id).map((o) => o.id)
  const disenos = plantillas.filter((p) => idsOcasion.includes(p.ocasion))
  const taller = disenosTaller.filter((t) => t.seccion === id)
  const nombre = texto.trim()
  const consulta = nombre ? `&nombre=${encodeURIComponent(nombre)}` : ''

  return (
    <section className="seccion seccion-tema" aria-labelledby="titulo-seccion">
      <div className="contenedor">
        <p className="miga"><Link to="/">Inicio</Link> › {seccion.nombre}</p>
        <h1 id="titulo-seccion">{seccion.nombre}</h1>
        <p className="seccion__intro">{seccion.descripcion} Escribe el nombre y elige el diseño que más te guste.</p>

        <div className="campo seccion-tema__campo">
          <label htmlFor="nombre-seccion">Su nombre o tu frase</label>
          <input id="nombre-seccion" type="text" maxLength={24} value={texto}
            placeholder="Por ejemplo: Andrea" onChange={(e) => setTexto(e.target.value)} />
        </div>
        {seccion.sugerencias?.length > 0 && (
          <div className="sugerencias">
            <span>Prueba:</span>
            {seccion.sugerencias.map((s) => (
              <button key={s} type="button" onClick={() => setTexto(s)}>{s}</button>
            ))}
          </div>
        )}

        {taller.length > 0 && (
          <div className="seccion-tema__taller">
            {taller.map((t) => <DisenoTaller key={t.id} diseno={t} nombre={nombre} />)}
          </div>
        )}

        {disenos.length > 0 && (
          <ul className="ejemplos-ocasion__lista seccion-tema__lista">
            {disenos.map((p) => {
              const f = fuentes.find((x) => x.id === p.fuente)
              const a = adornos.find((x) => x.id === p.adorno)
              const lineas = lineasDelDiseno({ modo: 'plantilla', plantillaId: p.id, campos: nombre ? { nombre } : {} }, [p], { usarEjemplos: true })
              return (
                <li key={p.id}>
                  <Link to={`/producto/${p.productoSugerido}?plantilla=${p.id}${consulta}`} className="ejemplo-tarjeta">
                    <span className="ejemplo__muestra" style={{ fontFamily: `"${f.familia}"`, fontWeight: f.peso, fontSize: tamMuestra(lineas) }} aria-hidden="true">
                      {a && <svg className="seccion-tema__adorno" viewBox="0 0 100 100"><path d={a.svg} /></svg>}
                      {lineas.map((l, i) => <span key={i} style={{ fontSize: `${p.tamLineas?.[i] ?? 1}em` }}>{l}</span>)}
                    </span>
                    <span className="ejemplo-tarjeta__pie">
                      <strong>{p.nombre}</strong>
                      <span>Personalizar →</span>
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
        )}

        <Link className="seccion-tema__cero" to="/producto/tu-objeto">¿Otra idea? Empieza desde cero</Link>
      </div>
    </section>
  )
}
