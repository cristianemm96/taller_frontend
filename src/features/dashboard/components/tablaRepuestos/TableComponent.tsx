import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Pencil, Loader2, Boxes } from 'lucide-react'
import { ConstantesURL } from '../../../../constantes'
import type { Repuesto } from '../../../../types/repuestoType'
import { DeleteButton } from './DeleteButton'
import { QuickActionModal } from './QuickActionModal'
import { useFiltroStore } from '../../../../store/useFiltroStore'
import { apiFetch } from '../../../../utils/api'

export const TableComponent = () => {
    const [repuestoAccionRapida, setRepuestoAccionRapida] = useState<Repuesto | null>(null)
    const termino = useFiltroStore((state) => state.terminoBusqueda)
    const categoriaId = useFiltroStore((state) => state.categoriaSeleccionada)
    const token = localStorage.getItem("token");

    const { data: respuesta, isLoading, isError } = useQuery({
        queryKey: ['repuestos'],
        queryFn: async () => {
            const response = await apiFetch(`${ConstantesURL.repuesto}`, {
                method: 'GET'
            });
            if (!response.ok) throw new Error('Error al traer los repuestos')
            return response.json()
        },
        enabled: !!token
    })

    const repuestosResp: Repuesto[] = respuesta?.elementos || []
    console.log(repuestosResp)
    const repuestosFiltrados = repuestosResp.filter((item) => {
        // Filtro por término de búsqueda
        const coincideTermino =
            item.nombreComponente.toLowerCase().includes(termino.toLowerCase()) ||
            (item.codReferencia && item.codReferencia.toLowerCase().includes(termino.toLowerCase()));
        const coincideCategoria = categoriaId === null || item.categoriaId === categoriaId;

        return coincideTermino && coincideCategoria;
    })

    if (isLoading) {
        return (
            <div className="w-full flex flex-col items-center justify-center py-16 gap-3 text-zinc-400">
                <Loader2 className="animate-spin text-orange-500" size={28} />
                <p className="text-sm">Cargando inventario del taller...</p>
            </div>
        )
    }

    if (isError) {
        return (
            <div className="w-full p-6 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm text-center">
                No se pudo establecer conexión con el servidor de stock.
            </div>
        )
    }

    return (
        <div className="w-full">
            <div className="overflow-x-auto">
                {repuestosFiltrados.length === 0 ? (
                    <div className="p-12 text-center text-zinc-500 text-sm border border-zinc-800 border-dashed rounded-xl">
                        No hay repuestos registrados todavía. ¡Ingresá uno nuevo arriba!
                    </div>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-zinc-800 bg-zinc-900/80 text-zinc-400 text-xs uppercase tracking-widest">
                                <th className="px-6 py-4 font-bold">Referencia</th>
                                <th className="px-6 py-4 font-bold">Componente</th>
                                <th className="px-6 py-4 font-bold">Categoría</th>
                                <th className="px-6 py-4 font-bold text-center">Stock</th>
                                <th className="px-6 py-4 font-bold text-center">Ubicación</th>
                                <th className="px-6 py-4 font-bold text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800/50 text-sm">
                            {repuestosFiltrados.map((item) => (
                                <tr key={item.id} className="hover:bg-zinc-800/30 transition-colors group">
                                    <td className="px-6 py-4 font-mono text-zinc-500">
                                        {item.codReferencia || 'S/R'}
                                    </td>
                                    <td className="px-6 py-4 font-medium text-white">
                                        {item.nombreComponente}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 rounded-md bg-zinc-800 border border-zinc-700 text-zinc-400 text-[11px]">
                                            {item?.nombreCategoria || `Cat ID: ${item.categoriaId}`}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`font-bold ${item.stockDisponible === 0 ? 'text-red-500' :
                                            item.stockDisponible <= 2 ? 'text-orange-500' : 'text-emerald-500'
                                            }`}>
                                            {item.stockDisponible}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center text-zinc-400 text-xs">
                                        {item.codigoCajon ? (
                                            <span>
                                                {item?.nombreEstanteria || 'Estante'} | {item.codigoCajon}
                                            </span>
                                        ) : (
                                            <span className="text-zinc-600 italic">Asignado (ID: {item.id})</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">

                                            <button
                                                onClick={() => setRepuestoAccionRapida(item)}
                                                className="p-1.5 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-emerald-500 transition-colors"
                                                title="Utilizar o Mover de lugar"
                                            >
                                                <Boxes size={16} />
                                            </button>
                                            <button className="p-1.5 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-orange-500 transition-colors">
                                                <Pencil size={16} />
                                            </button>
                                            <DeleteButton nombreComponente={item.nombreComponente} repuestoId={item.id} />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
            {repuestoAccionRapida && (
                <QuickActionModal
                    repuesto={{
                        id: repuestoAccionRapida.id,
                        nombreComponente: repuestoAccionRapida.nombreComponente,
                        stockDisponible: repuestoAccionRapida.stockDisponible,
                        stockFisico: repuestoAccionRapida.stockFisico,
                        cajonId: repuestoAccionRapida?.cajonId || 0,
                        estanteriaId: repuestoAccionRapida?.estanteriaId || 0
                    }}
                    onClose={() => setRepuestoAccionRapida(null)}
                />
            )}
        </div>
    )
}