import Buscador from '../components/Buscador'
import AccesosSeccion from '../components/AccesosSeccion'
import AccesosTipo from '../components/AccesosTipo'

export default function Portada() {

  return (
    <>
      <section className="hero hero--foto" aria-labelledby="titulo-hero">
        <div className="contenedor">
          <h1 id="titulo-hero">Tú lo imaginas. <em>Yo lo hago vinilo.</em></h1>
          <p className="hero__sub">Elige un diseño, personalízalo y descubre cómo quedaría.</p>
          <a href="#secciones" className="boton boton--principal hero__boton"
            onClick={(e) => { e.preventDefault(); document.getElementById('secciones')?.scrollIntoView({ behavior: 'smooth' }) }}>
            Empieza a crear
          </a>
          <picture>
            <source type="image/webp" srcSet="/img/portada/taller-480.webp 480w, /img/portada/taller-960.webp 960w" sizes="(min-width: 760px) 560px, 100vw" />
            <img className="hero__foto" src="/img/portada/taller-960.jpg" width="960" height="1200" fetchPriority="high"
              alt="Mesa de taller con bobinas de vinilo de colores, herramientas y plantas, con luz natural" />
          </picture>
        </div>
      </section>

      <section className="seccion" id="secciones" aria-labelledby="titulo-ocasiones">
        <div className="contenedor">
          <h2 id="titulo-ocasiones" className="seccion__titulo">¿Qué quieres crear?</h2>
          <p className="seccion__intro">Elige una idea y hazla tuya.</p>
          <AccesosSeccion />
          <Buscador />
        </div>
      </section>


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
              <h3>Elige un diseño</h3>
              <p>Busca por sección o por tema.</p>
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
