export interface Repuesto {
    id: number
    nombreComponente: string
    codReferencia: string
    stockDisponible: number
    stockFisico: number
    categoriaId: number
    nombreCategoria: string 
    nombreEstanteria: string
    cajonId: number
    estanteriaId: number
    codigoCajon: string
}