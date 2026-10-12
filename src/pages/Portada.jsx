import { Link } from 'react-router-dom'
import { Scissors, Sparkles, MessageCircle, Smartphone, Truck } from 'lucide-react'
import { useCatalogo } from '../context/CatalogoContext'
import Buscador from '../components/Buscador'
import AccesosOcasion from '../components/AccesosOcasion'
import AccesosTipo from '../components/AccesosTipo'
import Destacados from '../components/Destacados'

export default function Portada() {
  const { config } = useCatalogo()

  return (
    <>
      <section className="hero" aria-labelledby="titulo-hero">
        <div className="contenedor">
          <div className="hero__tarjeta">
            <span className="hero__tijera" aria-hidden="true"><Scissors size={22} /></span>
            <p className="etiqueta"><Sparkles size={14} aria-hidden="true" />Hecho a mano en Madrid</p>
            <h1 id="titulo-hero">
              Regalos con <em>tu nombre</em>, tu frase y tu fecha
            </h1>
            <p className="hero__sub">
              Elige el producto, escribe tu texto y mira cómo queda antes de pedirlo.
              Recibo tu pedido por WhatsApp y te confirmo plazo y precio.
            </p>

            <Buscador />

            <div className="hero__acciones">
              <Link to="/catalogo" className="boton boton--principal">Ver todos los regalos</Link>
              <Link to="/trabajos" className="boton boton--secundario">Trabajos reales</Link>
            </div>

            <ul className="ventajas">
              <li><MessageCircle size={20} aria-hidden="true" />Pedido por WhatsApp</li>
              <li><Smartphone size={20} aria-hidden="true" />Pago con {config.pago.join(', ')}</li>
              <li><Truck size={20} aria-hidden="true" />Recogida en Madrid o envío</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="seccion" aria-labelledby="titulo-ocasiones">
        <div className="contenedor">
          <h2 id="titulo-ocasiones" className="seccion__titulo">¿Para qué ocasión?</h2>
          <p className="seccion__intro">Ideas pensadas para cada momento.</p>
          <AccesosOcasion />
        </div>
      </section>

      <Destacados />

      <section className="seccion" aria-labelledby="titulo-tipos">
        <div className="contenedor">
          <h2 id="titulo-tipos" className="seccion__titulo">¿Qué tipo de vinilo?</h2>
          <p className="seccion__intro">Si ya sabes sobre qué lo quieres, empieza por aquí.</p>
          <AccesosTipo />
        </div>
      </section>

      <section className="seccion" aria-labelledby="titulo-pasos">
        <div className="contenedor">
          <h2 id="titulo-pasos" className="seccion__titulo">Así de fácil</h2>
          <p className="seccion__intro">Sin registros ni pagos en la web.</p>
          <ol className="pasos">
            <li className="paso">
              <h3>Elige tu regalo</h3>
              <p>Busca por ocasión o por producto.</p>
            </li>
            <li className="paso">
              <h3>Personalízalo</h3>
              <p>Escribe tu texto, elige letra y color, y mira cómo queda.</p>
            </li>
            <li className="paso">
              <h3>Envíame el pedido</h3>
              <p>Se abre WhatsApp con todo listo. Te confirmo y pagas con Bizum.</p>
            </li>
          </ol>
        </div>
      </section>
    </>
  )
}
