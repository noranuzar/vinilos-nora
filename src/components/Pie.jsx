import { Link } from 'react-router-dom'
import { CalendarClock, Smartphone, Truck, MessageCircle, Scissors } from 'lucide-react'
import { useCatalogo } from '../context/CatalogoContext'
import { enlaceWhatsApp } from '../lib/whatsapp'
import Logo from './Logo'

export default function Pie() {
  const { config } = useCatalogo()
  const telefono = config.whatsapp.replace(/^34/, '').replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3')

  return (
    <footer className="pie">
      <div className="contenedor">
        <div className="pie__rejilla">
          <div>
            <h2 className="pie__logo"><Logo variante="claro" /></h2>
            <p>{config.lema}.</p>
            <a
              className="boton boton--principal"
              href={enlaceWhatsApp(config.whatsapp, 'Hola Nora, tengo una consulta sobre un regalo personalizado.')}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle size={20} aria-hidden="true" />
              Escríbeme: {telefono}
            </a>
          </div>

          <div>
            <h2>Cómo trabajo</h2>
            <ul>
              <li><CalendarClock size={18} aria-hidden="true" />Pedidos con al menos {config.diasMinimosEntrega} días de antelación.</li>
              {config.avisoPrueba && <li><Scissors size={18} aria-hidden="true" /><span>{config.avisoPrueba}</span></li>}
              <li><Smartphone size={18} aria-hidden="true" />Pago por {config.pago.join(', ')} al confirmar el pedido.</li>
              <li>
                <Truck size={18} aria-hidden="true" />
                <span>
                  Recogida en Madrid gratis o envío por Correos, que se cobra aparte según la tarifa oficial.
                </span>
              </li>
            </ul>
          </div>

          <div>
            <h2>Tienda</h2>
            <ul>
              <li><Link to="/catalogo">Catálogo</Link></li>
              <li><Link to="/trabajos">Trabajos reales</Link></li>
              <li><Link to="/cesta">Mi cesta</Link></li>
            </ul>
          </div>
        </div>

        <p className="pie__aviso">{config.avisoDerechos}</p>
        <p className="pie__legal">© {new Date().getFullYear()} {config.nombreTienda} · Madrid</p>
      </div>
    </footer>
  )
}
