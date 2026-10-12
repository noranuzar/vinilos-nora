export default function SelectorFuente({ estilos, fuentes, valor, muestra, onChange }) {
  return (
    <fieldset className="grupo-control">
      <legend>Tipo de letra</legend>
      {estilos.map((e) => (
        <div key={e.id} className="fuentes__grupo">
          <p className="fuentes__estilo" aria-hidden="true">{e.nombre}</p>
          <div className="fuentes">
            {fuentes.filter((f) => f.estilo === e.id).map((f) => (
              <button
                key={f.id}
                type="button"
                className="fuente"
                aria-pressed={valor === f.id}
                aria-label={`${f.nombre}, estilo ${e.nombre.toLowerCase()}`}
                onClick={() => onChange(f.id)}
              >
                <span className="fuente__muestra" style={{ fontFamily: `"${f.familia}"`, fontWeight: f.peso }} aria-hidden="true">
                  {muestra}
                </span>
                <span className="fuente__nombre" aria-hidden="true">{f.nombre}</span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </fieldset>
  )
}
