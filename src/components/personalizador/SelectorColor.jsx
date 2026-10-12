export default function SelectorColor({ colores, valor, onChange }) {
  return (
    <fieldset className="grupo-control">
      <legend>Color del vinilo</legend>
      <div className="colores">
        {colores.map((c) => (
          <button
            key={c.id}
            type="button"
            className="color"
            aria-pressed={valor?.id === c.id}
            onClick={() => onChange(c.nombre)}
          >
            <span className="color__muestra" style={{ background: c.hex }} aria-hidden="true" />
            {c.nombre}
          </button>
        ))}
      </div>
    </fieldset>
  )
}
