// Personalizador de un producto. El diseño (texto, fuente, color, adorno) es
// compartido entre objetos; tamaño, cantidad y fecha son propios de este objeto.
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Minus, Plus, Check, ShoppingBag, TriangleAlert, Scissors } from 'lucide-react'
import { useCatalogo } from '../../context/CatalogoContext'
import { useCesta } from '../../context/CestaContext'
import { useDiseno } from '../../context/DisenoContext'
import { lineasDelDiseno, aplicarPlantilla, coloresPermitidos, colorParaProducto } from '../../lib/diseno'
import { calcularPrecio } from '../../lib/precio'
import { fechaMinima, formatearFecha } from '../../lib/fechas'
import VistaPrevia from './VistaPrevia'
import VistaMedidas from './VistaMedidas'
import Ejemplos from './Ejemplos'
import CamposTexto from './CamposTexto'
import SelectorFuente from './SelectorFuente'
import SelectorColor from './SelectorColor'
import SelectorAdorno from './SelectorAdorno'
import SelectorObjeto from './SelectorObjeto'
import SelectorAjuste from './SelectorAjuste'
import ResumenPrecio from './ResumenPrecio'

// Texto para el pedido: cómo quiere colocado el diseño.
function describirAjuste(a, conZona, lineas) {
  const nombre = { izquierda: 'a la izquierda', centro: 'centrada', derecha: 'a la derecha' }
  const usadas = a.alineaciones.slice(0, lineas.length)
  const partes = usadas.every((x) => x === usadas[0])
    ? [`texto ${nombre[usadas[0]].replace('centrada', 'centrado')}`]
    : usadas.map((x, i) => `línea ${i + 1} ${nombre[x]}`)
  if (conZona) {
    partes.push(a.escala === 100 ? 'tamaño máximo de la zona' : `${a.escala} % de la zona`)
    const h = a.desX === 0 ? '' : a.desX < 0 ? 'desplazado a la izquierda' : 'desplazado a la derecha'
    const v = a.desY === 0 ? '' : a.desY < 0 ? 'desplazado hacia arriba' : 'desplazado hacia abajo'
    if (h) partes.push(h)
    if (v) partes.push(v)
    if (!h && !v) partes.push('en el centro de la zona')
  }
  return partes.join(', ')
}

export default function Personalizador({ producto }) {
  const datos = useCatalogo()
  const { config, fuentes, estilosFuente, colores, adornos, plantillas, productos, tipos } = datos
  const { anadir } = useCesta()
  const [diseno, setDiseno] = useDiseno()

  // Opciones propias de este objeto
  const [tipoSel, setTipoSel] = useState(producto.tipo || producto.tiposPermitidos?.[0])
  const [tamanoId, setTamanoId] = useState(producto.tamanos?.[0]?.id || null)
  const [variante, setVariante] = useState(producto.variantes?.opciones[0] || null)
  const [cantidad, setCantidad] = useState(1)
  const [fecha, setFecha] = useState('')
  const [altoLetra, setAltoLetra] = useState(producto.medidas?.altoLetraCm.defecto || 5)
  const [medidasObjeto, setMedidasObjeto] = useState('')
  const [intento, setIntento] = useState(false)
  const [anadido, setAnadido] = useState(false)
  const [verZona, setVerZona] = useState(false)
  const [medida, setMedida] = useState(null)

  const fechaMin = fechaMinima(config.diasMinimosEntrega)
  const plantillasProducto = plantillas.filter((p) => producto.ocasiones.includes(p.ocasion))
  const plantilla = plantillas.find((p) => p.id === diseno.plantillaId)
  const fuente = fuentes.find((f) => f.id === diseno.fuenteId) || fuentes[0]
  const permitidos = coloresPermitidos(producto, tipoSel, colores)
  const color = colorParaProducto(permitidos, diseno.colorNombre)
  const adorno = adornos.find((a) => a.id === diseno.adornoId) || null
  const tamano = producto.tamanos?.find((t) => t.id === tamanoId) || null
  const ajuste = { alineaciones: diseno.alineaciones, escala: diseno.escala, desX: diseno.desX, desY: diseno.desY }
  const conZona = Boolean(producto.zonaTexto && producto.imagen)

  // Altura mínima de letra para que el vinilo se corte y pele bien
  // (la más exigente entre el tipo de vinilo y la fuente elegida).
  const minimoCm = Math.max(config.altoLetraMinimoCm?.[tipoSel] || 0, fuente.tamanoMinCm || 0, producto.altoLetraMinCm || 0)
  const textoPequeno = Boolean(medida && minimoCm && medida.letraCm < minimoCm - 0.005)

  // "Ajustar a 1 cm": primero agranda el diseño dentro de la zona; si ya está
  // al máximo, quita el adorno para ganar espacio. Si no basta, lo explica.
  const accionAjuste = !textoPequeno ? null
    : conZona && diseno.escala < 100 ? 'agrandar'
    : adorno ? 'quitarAdorno'
    : null
  const ajustarMinimo = () => {
    if (accionAjuste === 'agrandar') {
      const necesaria = diseno.escala * (minimoCm / medida.letraCm)
      cambiar({ escala: Math.min(100, Math.ceil(necesaria / 5) * 5) })
    } else if (accionAjuste === 'quitarAdorno') {
      cambiar({ adornoId: null })
    }
  }
  const cmTexto = (v) => v.toLocaleString('es-ES', { maximumFractionDigits: 1 })

  const lineasReales = lineasDelDiseno(diseno, plantillas)
  const lineasVista = lineasDelDiseno(diseno, plantillas, { usarEjemplos: true }).filter(Boolean)
  const lineasParaVista = lineasVista.length ? lineasVista : ['Tu texto']
  const lineasUsadas = lineasReales.filter(Boolean).length
  // Tamaño relativo de cada línea (los diseños de ejemplo pueden llevar la fecha más pequeña)
  const tamanosVista = diseno.modo === 'plantilla' && plantilla?.tamLineas
    ? lineasDelDiseno(diseno, plantillas, { usarEjemplos: true }).map((l, i) => (l ? plantilla.tamLineas[i] ?? 1 : null)).filter((x) => x != null)
    : []

  const precio = calcularPrecio(producto, { lineasUsadas, tamano, adorno, cantidad })

  // Validación (se muestra al intentar añadir)
  const errores = useMemo(() => {
    const e = {}
    const max = producto.texto.maxCaracteresLinea
    if (diseno.modo === 'plantilla' && plantilla) {
      for (const c of plantilla.campos) if (!(diseno.campos[c.id] || '').trim()) e[c.id] = `Escribe ${c.etiqueta.toLowerCase()}.`
      const larga = lineasReales.find((l) => l.length > max)
      if (larga) e.largo = `“${larga}” tiene ${larga.length} caracteres y en este objeto caben ${max} por línea. Acórtalo o prueba otro objeto.`
    } else if (!lineasReales[0]) {
      e.linea0 = 'Escribe el texto de la primera línea.'
    }
    if (!fecha) e.fecha = 'Indica para cuándo lo necesitas.'
    else if (fecha < fechaMin) e.fecha = `Necesito al menos ${config.diasMinimosEntrega} días. Elige el ${formatearFecha(fechaMin)} o después.`
    if (producto.medidas?.pedirMedidasObjeto && !medidasObjeto.trim()) e.objeto = 'Cuéntame qué objeto es y sus medidas.'
    return e
  }, [diseno, plantilla, lineasReales, fecha, fechaMin, medidasObjeto, producto, config.diasMinimosEntrega])
  const visibles = intento ? errores : {}

  const cambiar = (cambios) => { setDiseno((d) => ({ ...d, ...cambios })); setAnadido(false) }
  const elegirPlantilla = (p) => { setDiseno((d) => aplicarPlantilla(p, d)); setAnadido(false) }
  const ponerLibre = () => cambiar({
    modo: 'libre',
    plantillaId: null,
    lineas: diseno.modo === 'plantilla' ? lineasReales.slice(0, producto.texto.maxLineas).concat('', '').slice(0, 2) : diseno.lineas,
  })

  const descripcion = `Vista previa: ${lineasParaVista.join(', ')} en ${fuente.nombre}, color ${color?.nombre}${adorno ? `, con ${adorno.nombre.toLowerCase()}` : ''}.`

  const enviar = (ev) => {
    ev.preventDefault()
    setIntento(true)
    if (Object.keys(errores).length) {
      // Esperar a que se pinten los mensajes y llevar el foco al primer error.
      setTimeout(() => {
        const primero = document.querySelector('[aria-invalid="true"]') || document.querySelector('.campo__error')
        primero?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        primero?.focus?.({ preventScroll: true })
      }, 0)
      return
    }
    anadir({
      productoId: producto.id,
      producto: producto.nombre,
      imagen: producto.imagen,
      tipo: tipos.find((t) => t.id === tipoSel)?.nombre,
      lineas: lineasReales.filter(Boolean),
      diseno: plantilla && diseno.modo === 'plantilla' ? plantilla.nombre : null,
      fuente: fuente.nombre,
      color: color.nombre,
      adorno: adorno ? `${adorno.nombre} (${diseno.posicionAdorno})` : null,
      ajuste: describirAjuste(ajuste, conZona, lineasReales.filter(Boolean)),
      tamano: tamano?.nombre || null,
      variante: variante ? `${producto.variantes.nombre}: ${variante}` : null,
      altoLetraCm: producto.medidas ? altoLetra : null,
      objeto: producto.medidas ? medidasObjeto.trim() : null,
      medida: medida ? `letras de ~${cmTexto(medida.letraCm)} cm, diseño de ~${cmTexto(medida.anchoCm)} × ${cmTexto(medida.altoCm)} cm` : null,
      revisarTamano: textoPequeno,
      cantidad,
      fecha,
      precioUnidad: precio.unidad,
      total: precio.total,
    })
    setAnadido(true)
    setIntento(false)
  }

  return (
    <div className="ficha">
      <div className="ficha__previa">
        {producto.zonaTexto && producto.imagen ? (
          <VistaPrevia producto={producto} lineas={lineasParaVista} tamanos={tamanosVista} fuente={fuente} color={color} adorno={adorno} posicion={diseno.posicionAdorno} ajuste={ajuste} verZona={verZona} descripcion={descripcion} onMedida={setMedida} />
        ) : (
          <VistaMedidas lineas={lineasParaVista} tamanos={tamanosVista} fuente={fuente} color={color} adorno={adorno} posicion={diseno.posicionAdorno} alineaciones={diseno.alineaciones} altoLetraCm={altoLetra} descripcion={descripcion} onMedida={setMedida} />
        )}
        {conZona && medida && (
          <p className="medida-aprox">
            Letras de unos <strong>{cmTexto(medida.letraCm)} cm</strong> de alto · diseño de unos {cmTexto(medida.anchoCm)} × {cmTexto(medida.altoCm)} cm
          </p>
        )}
        <p className="nota-imagen">{producto.imagen ? config.avisoImagenes : 'Simulación orientativa de tamaño y forma.'}</p>
      </div>

      <form className="ficha__controles" onSubmit={enviar} noValidate>
        <header className="ficha__cabecera">
          <h1>{producto.nombre}</h1>
          <p>{producto.descripcion}</p>
          {producto.cuidados && <p className="cuidados"><strong>Cuidados:</strong> {producto.cuidados}</p>}
        </header>

        <Ejemplos plantillas={plantillasProducto} fuentes={fuentes} diseno={diseno} onElegir={elegirPlantilla} onLibre={ponerLibre} />

        <CamposTexto
          diseno={diseno}
          plantilla={plantilla}
          producto={producto}
          lineasFinales={lineasReales}
          lineasEjemplo={lineasParaVista}
          errores={visibles}
          onCampo={(k, v) => cambiar({ campos: { ...diseno.campos, [k]: v } })}
          onLinea={(i, v) => { const l = [...diseno.lineas]; l[i] = v; cambiar({ lineas: l }) }}
        />

        <SelectorFuente estilos={estilosFuente} fuentes={fuentes} valor={fuente.id} muestra={lineasParaVista[0].slice(0, 12)} onChange={(id) => cambiar({ fuenteId: id })} />

        <SelectorAjuste
          ajuste={ajuste}
          lineas={lineasParaVista}
          onChange={(c) => cambiar(c)}
          conZona={conZona}
          verZona={verZona}
          onVerZona={setVerZona}
        />

        {producto.tiposPermitidos && (
          <fieldset className="grupo-control">
            <legend>Tipo de vinilo</legend>
            <div className="posiciones">
              {producto.tiposPermitidos.map((t) => (
                <button key={t} type="button" className="chip" aria-pressed={tipoSel === t} onClick={() => setTipoSel(t)}>
                  {tipos.find((x) => x.id === t)?.nombre}
                </button>
              ))}
            </div>
            <p className="ayuda">{tipos.find((x) => x.id === tipoSel)?.descripcion}</p>
          </fieldset>
        )}

        <SelectorColor colores={permitidos} valor={color} onChange={(nombre) => cambiar({ colorNombre: nombre })} />

        <SelectorAdorno
          adornos={adornos}
          posiciones={config.posicionesAdorno}
          valor={diseno.adornoId}
          posicion={diseno.posicionAdorno}
          onChange={(id) => cambiar({ adornoId: id })}
          onPosicion={(p) => cambiar({ posicionAdorno: p })}
        />

        {producto.medidas && (
          <fieldset className="grupo-control">
            <legend>Medidas</legend>
            <div className="campo">
              <label htmlFor="alto-letra">Altura de las letras: <strong>{altoLetra} cm</strong></label>
              <input
                id="alto-letra"
                type="range"
                min={producto.medidas.altoLetraCm.min}
                max={producto.medidas.altoLetraCm.max}
                step="0.5"
                value={altoLetra}
                onChange={(e) => setAltoLetra(Number(e.target.value))}
              />
            </div>
            <div className="campo">
              <label htmlFor="objeto">¿Qué objeto es y cuánto mide?</label>
              <textarea
                id="objeto"
                rows="2"
                value={medidasObjeto}
                onChange={(e) => setMedidasObjeto(e.target.value)}
                placeholder="Ej.: camiseta negra talla M, espejo de 40 × 60 cm…"
                aria-invalid={!!visibles.objeto}
                aria-describedby={visibles.objeto ? 'objeto-err' : undefined}
              />
              {visibles.objeto && <p id="objeto-err" className="campo__error">{visibles.objeto}</p>}
            </div>
          </fieldset>
        )}

        {(producto.tamanos || producto.variantes) && (
          <fieldset className="grupo-control">
            <legend>Opciones</legend>
            {producto.tamanos && (
              <div className="campo">
                <span className="leyenda-sec" id="lbl-tamano">Tamaño</span>
                <div className="posiciones" role="group" aria-labelledby="lbl-tamano">
                  {producto.tamanos.map((t) => (
                    <button key={t.id} type="button" className="chip" aria-pressed={tamanoId === t.id} onClick={() => setTamanoId(t.id)}>{t.nombre}</button>
                  ))}
                </div>
              </div>
            )}
            {producto.variantes && (
              <div className="campo">
                <label htmlFor="variante">{producto.variantes.nombre}</label>
                <select id="variante" value={variante} onChange={(e) => setVariante(e.target.value)}>
                  {producto.variantes.opciones.map((o) => <option key={o}>{o}</option>)}
                </select>
              </div>
            )}
          </fieldset>
        )}

        <fieldset className="grupo-control grupo-control--fila">
          <legend className="sr-only">Cantidad y fecha</legend>
          <div className="campo">
            <span className="leyenda-sec" id="lbl-cantidad">Cantidad</span>
            <div className="cantidad" role="group" aria-labelledby="lbl-cantidad">
              <button type="button" className="icono-boton" aria-label="Quitar una unidad" disabled={cantidad <= 1} onClick={() => setCantidad((c) => Math.max(1, c - 1))}><Minus size={20} aria-hidden="true" /></button>
              <input
                id="cantidad"
                type="number"
                inputMode="numeric"
                min="1"
                max="500"
                value={cantidad}
                aria-label="Cantidad"
                onChange={(e) => setCantidad(Math.max(1, Math.min(500, Number(e.target.value) || 1)))}
              />
              <button type="button" className="icono-boton" aria-label="Añadir una unidad" onClick={() => setCantidad((c) => Math.min(500, c + 1))}><Plus size={20} aria-hidden="true" /></button>
            </div>
          </div>
          <div className="campo">
            <label htmlFor="fecha">¿Para cuándo lo necesitas?</label>
            <input
              id="fecha"
              type="date"
              min={fechaMin}
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              aria-invalid={!!visibles.fecha}
              aria-describedby={`fecha-ayuda${visibles.fecha ? ' fecha-err' : ''}`}
            />
            <p id="fecha-ayuda" className="ayuda">Mínimo {config.diasMinimosEntrega} días desde hoy.</p>
            {visibles.fecha && <p id="fecha-err" className="campo__error">{visibles.fecha}</p>}
          </div>
        </fieldset>

        {producto.tramosCantidad && (
          <p className="ayuda">Precio por unidad más bajo a partir de {producto.tramosCantidad.slice(1).map((t) => t.desde).join(' y ')} unidades.</p>
        )}

        {textoPequeno && (
          <div className="aviso aviso--atencion" role="status">
            <TriangleAlert size={20} aria-hidden="true" />
            <div className="aviso__cuerpo">
              <p>
                <strong>El texto queda muy pequeño</strong>: letras de unos {cmTexto(medida.letraCm)} cm.
                Para que el vinilo se corte y pele bien{producto.altoLetraMinCm ? ` en este ${producto.nombre.toLowerCase()}` : fuente.tamanoMinCm ? ` con la letra ${fuente.nombre}` : ''}, las letras deben medir al menos {cmTexto(minimoCm)} cm.
              </p>
              {accionAjuste ? (
                <button type="button" className="boton boton--principal boton--compacto" onClick={ajustarMinimo}>
                  {accionAjuste === 'agrandar' ? `Ajustar a ${cmTexto(minimoCm)} cm` : 'Quitar el adorno para ganar espacio'}
                </button>
              ) : (
                <p>
                  En este objeto no cabe con letras de {cmTexto(minimoCm)} cm. Acorta el texto, usa una sola línea
                  o prueba en un objeto más grande. Si lo pides así, lo reviso en la prueba de corte y te digo.
                </p>
              )}
            </div>
          </div>
        )}

        <ResumenPrecio precio={precio} cantidad={cantidad} />

        {config.avisoPrueba && (
          <p className="aviso aviso--info">
            <Scissors size={18} aria-hidden="true" />
            <span>{config.avisoPrueba}</span>
          </p>
        )}

        {anadido ? (
          <div className="anadido" role="status">
            <p><Check size={20} aria-hidden="true" /> Añadido a tu cesta.</p>
            <div className="anadido__acciones">
              <Link to="/cesta" className="boton boton--principal"><ShoppingBag size={20} aria-hidden="true" /> Ver mi cesta</Link>
              <Link to="/catalogo" className="boton boton--secundario">Seguir mirando</Link>
            </div>
          </div>
        ) : (
          <button type="submit" className="boton boton--principal boton--ancho">
            <ShoppingBag size={20} aria-hidden="true" /> Añadir a la cesta
          </button>
        )}

        <SelectorObjeto productos={productos} actual={producto.id} />
      </form>
    </div>
  )
}
