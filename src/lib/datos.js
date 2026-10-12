// Capa de acceso a datos.
// v1: lee el JSON local. v2: sustituir el cuerpo de cargarCatalogo()
// por consultas a Supabase devolviendo la MISMA forma de objeto.
// Ningún componente lee el JSON directamente: todos pasan por aquí.
import catalogo from '../data/catalogo.json'

export async function cargarCatalogo() {
  const productos = catalogo.productos.filter((p) => p.activo)
  return {
    config: catalogo.config,
    ocasiones: [...catalogo.ocasiones].sort((a, b) => a.orden - b.orden),
    tipos: catalogo.tipos,
    estilosFuente: catalogo.estilosFuente,
    fuentes: catalogo.fuentes,
    colores: catalogo.colores,
    adornos: catalogo.adornos,
    plantillas: catalogo.plantillas,
    productos,
    galeria: catalogo.galeria,
  }
}
