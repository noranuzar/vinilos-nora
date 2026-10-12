// Traduce el nombre de icono guardado en el JSON a un icono real.
// Si en v2 se añade una ocasión con un icono desconocido, se usa Sparkles.
import {
  Cake, Gem, Baby, Flower2, TreePine, GraduationCap, PartyPopper,
  Briefcase, Sticker, Shirt, Sparkles,
} from 'lucide-react'

const ICONOS = {
  cake: Cake,
  gem: Gem,
  baby: Baby,
  flower: Flower2,
  tree: TreePine,
  graduation: GraduationCap,
  party: PartyPopper,
  briefcase: Briefcase,
  sticker: Sticker,
  shirt: Shirt,
}

export default function Icono({ nombre, size = 22 }) {
  const Componente = ICONOS[nombre] || Sparkles
  return <Componente size={size} aria-hidden="true" strokeWidth={1.8} />
}
