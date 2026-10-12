import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, X } from 'lucide-react'
import { useCatalogo } from '../context/CatalogoContext'
import { filtrarProductos } from '../lib/buscar'
import TarjetaProducto from '../components/TarjetaProducto'
import EjemplosOcasion from '../components/EjemplosOcasion'

export default function Catalogo() {
  const datos = useCatalogo()
  const { productos, ocasiones, tipos, config } = datos
  const [params, setParams] = useSearchParams()

  const q = params.get('q') || ''
  const ocasion = params.get('ocasion') || ''
  const tipo = params.get('tipo') || ''

  const cambiar = (clave, valor) => {
    const nuevos = new URLSearchParams(params)
    if (valor) nuevos.set(clave, valor)
    else nuevos.delete(clave)
    setParams(nuevos, { replace: true })
  }

  const resultados = useMemo(
    () => filtrarProductos(productos, { q, ocasion, tipo }, datos),
    [productos, q, ocasion, tipo, datos]
  )
  const hayFiltros = q || ocasion || tipo
  const nombreOcasion = ocasiones.find((o) => o.id === ocasion)?.nombre

  return (
    <section className="seccion" aria-labelledby="titulo-catalogo">
      <div className="contenedor">
        <h1 id="titulo-catalogo" className="seccion__titulo">
          {nombreOcasion ? `Regalos para ${nombreOcasion.toLowerCase()}` : 'Catálogo'}
        </h1>
        <p className="seccion__intro">Toca un producto para personalizarlo y ver cómo queda.</p>

        <div className="filtros">
          <div className="filtros__buscar">
            <label htmlFor="buscar-catalogo" className="sr-only">Buscar en el catálogo</label>
            <Search size={20} aria-hidden="true" />
            <input
              id="buscar-catalogo"
              type="search"
              value={q}
              onChange={(e) => cambiar('q', e.target.value)}
              placeholder="Buscar: taza, boda, profe…"
              autoComplete="off"
            />
          </div>

          <fieldset className="chips">
            <legend>Tipo</legend>
            <button type="button" className="chip" aria-pressed={!tipo} onClick={() => cambiar('tipo', '')}>Todos</button>
            {tipos.map((t) => (
              <button key={t.id} type="button" className="chip" aria-pressed={tipo === t.id} onClick={() => cambiar('tipo', tipo === t.id ? '' : t.id)}>
                {t.id === 'adhesivo' ? 'Adhesivo' : 'Textil'}
              </button>
            ))}
          </fieldset>

          <fieldset className="chips chips--desliza">
            <legend>Ocasión</legend>
            <button type="button" className="chip" aria-pressed={!ocasion} onClick={() => cambiar('ocasion', '')}>Todas</button>
            {ocasiones.map((o) => (
              <button key={o.id} type="button" className="chip" aria-pressed={ocasion === o.id} onClick={() => cambiar('ocasion', ocasion === o.id ? '' : o.id)}>
                {o.nombre}
              </button>
            ))}
          </fieldset>
        </div>

        {ocasion && <EjemplosOcasion ocasion={ocasion} />}

        <div className="resultados__cabecera">
          <p aria-live="polite" className="resultados__num">
            {resultados.length} {resultados.length === 1 ? 'producto' : 'productos'}
          </p>
          {hayFiltros && (
            <button type="button" className="enlace-boton" onClick={() => setParams({}, { replace: true })}>
              <X size={16} aria-hidden="true" /> Quitar filtros
            </button>
          )}
        </div>

        {resultados.length ? (
          <ul className="rejilla-productos">
            {resultados.map((p) => (
              <li key={p.id}><TarjetaProducto producto={p} nivelTitulo="h2" /></li>
            ))}
          </ul>
        ) : (
          <div className="vacio">
            <p><strong>No he encontrado nada con esos filtros.</strong></p>
            <p>Si buscas algo que no está aquí, pregúntame por WhatsApp: muchas cosas se pueden hacer por encargo.</p>
            <a className="boton boton--principal" href={`https://wa.me/${config.whatsapp}?text=${encodeURIComponent(`Hola Nora, busco un regalo personalizado${q ? `: ${q}` : ''}.`)}`} target="_blank" rel="noopener noreferrer">
              Preguntar por WhatsApp
            </a>
          </div>
        )}

        <p className="nota-imagen">{config.avisoImagenes}</p>
      </div>
    </section>
  )
}
