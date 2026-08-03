import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Clock, CheckCircle2, User, Wrench, Trash2, Package } from 'lucide-react'
import { PlanificadorSetUpModal } from './PlanificadorSetUpModal'
import { ConstantesURL } from '../../constantes'
import { apiFetch } from '../../utils/api'

export const OrdenesComponent = () => {
    const queryClient = useQueryClient()
    const [modalAbierto, setModalAbierto] = useState(false)
    const token = localStorage.getItem("token")

    const { data: ordenes, isLoading } = useQuery({
        queryKey: ['ordenes'],
        queryFn: async () => {
            const res = await apiFetch(`${ConstantesURL.ordenes}`, { method: "GET" })
            if (!res.ok) throw new Error('Error al cargar órdenes de boxes')
            return res.json()
        },
        enabled: !!token
    })

    // Mutación para Finalizar Orden (Mandar a Pista)
    const finalizarMutation = useMutation({
        mutationFn: async (id: number) => {
            const res = await apiFetch(`${ConstantesURL.ordenes}/${id}/finalizar`, {
                method: 'POST'
            })
            if (!res.ok) throw new Error('No se pudo finalizar el setup')
            return res.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['ordenes'] })
            queryClient.invalidateQueries({ queryKey: ['repuestos'] }) 
        }
    })

    // Mutación para Eliminar/Cancelar Orden (Liberar stock reservado)
    const eliminarMutation = useMutation({
        mutationFn: async (id: number) => {
            const res = await apiFetch(`${ConstantesURL.ordenes}/${id}`, {
                method: 'DELETE'
            })
            if (!res.ok) {
                const err = await res.json().catch(() => ({}))
                throw new Error(err.message || 'No se pudo eliminar la orden')
            }
            return res.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['ordenes'] })
            queryClient.invalidateQueries({ queryKey: ['repuestos'] })
        }
    })

    const handleEliminar = (id: number) => {
        if (confirm(`¿Estás seguro de cancelar la Orden ORD-${String(id).padStart(4, '0')}? Los repuestos reservados se liberarán.`)) {
            eliminarMutation.mutate(id)
        }
    }

    if (isLoading) return <div className="text-zinc-500 p-6 text-xs font-bold font-mono uppercase tracking-widest animate-pulse">Alineando neumáticos...</div>

    const ordenesAbiertas = ordenes?.filter((o: any) => o.estado === 'Abierta') || []
    const ordenesFinalizadas = ordenes?.filter((o: any) => o.estado === 'Finalizada') || []

    return (
        <div className="p-6 space-y-6 bg-zinc-950 min-h-screen text-white">
            {/* HEADER DE LA VISTA */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-lg font-black uppercase tracking-wider text-zinc-100 flex items-center gap-2">
                        <Wrench size={18} className="text-emerald-500" />
                        Órdenes de Trabajo
                    </h1>
                    <p className="text-[11px] text-zinc-500 mt-0.5 uppercase tracking-wider font-medium">
                        Configuración de setups, mecánicos y reservas de componentes.
                    </p>
                </div>

                <button
                    onClick={() => setModalAbierto(true)}
                    className="flex items-center gap-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-950 font-black text-[11px] uppercase tracking-wider px-4 py-2.5 rounded-xl transition-all shadow-lg"
                >
                    <Plus size={14} strokeWidth={3} />
                    <span>Planificar Tarea</span>
                </button>
            </div>

            {/* ÓRDENES EN BOXES (ABIERTAS) */}
            <div className="space-y-3">
                <div className="flex items-center gap-2 text-[10px] font-black text-orange-400 uppercase tracking-widest px-1">
                    <Clock size={12} />
                    <span>En Boxes (Abiertas)</span>
                    <span className="bg-orange-500/10 border border-orange-500/20 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold text-orange-400">
                        {ordenesAbiertas.length}
                    </span>
                </div>

                {ordenesAbiertas.length === 0 ? (
                    <div className="border border-dashed border-zinc-800 rounded-2xl p-8 text-center text-zinc-600 text-xs uppercase font-mono tracking-wider">
                        No hay coches trabajando en boxes actualmente.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {ordenesAbiertas.map((orden: any) => {
                            const mecanico = orden.mecanicoAsignado?.usuario;
                            const nombreMecanico = mecanico?.nombre || 'Sin Asignar';

                            return (
                                <div key={orden.id} className="bg-zinc-900 border border-zinc-800/80 rounded-2xl p-4 flex flex-col justify-between hover:border-zinc-700 transition-all shadow-md group">
                                    <div className="space-y-3">
                                        {/* HEADER DE CARD */}
                                        <div className="flex justify-between items-center">
                                            <span className="bg-zinc-950 text-zinc-400 border border-zinc-800 px-2 py-0.5 rounded text-[9px] font-mono font-bold">
                                                ORD-{String(orden.id).padStart(4, '0')}
                                            </span>
                                            
                                            <div className="flex items-center gap-2">
                                                <span className="text-[9px] font-mono text-zinc-500">
                                                    {new Date(orden.fechaCreacion).toLocaleDateString()}
                                                </span>

                                                {/* BOTÓN BORRAR / CANCELAR */}
                                                <button
                                                    onClick={() => handleEliminar(orden.id)}
                                                    disabled={eliminarMutation.isPending}
                                                    title="Cancelar orden y liberar repuestos"
                                                    className="p-1 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                                                >
                                                    <Trash2 size={13} />
                                                </button>
                                            </div>
                                        </div>

                                        {/* DESCRIPCIÓN */}
                                        <p className="text-xs font-bold text-zinc-200 leading-snug group-hover:text-white transition-colors">
                                            {orden.descripcionTrabajo}
                                        </p>

                                        {/* MECÁNICO A CARGO */}
                                        <div className="flex items-center gap-1.5 text-[10px] bg-zinc-950 border border-zinc-800 px-2.5 py-1.5 rounded-lg text-zinc-300 font-mono">
                                            <User size={12} className="text-emerald-500" />
                                            <span className="text-zinc-500">Mecánico:</span>
                                            <span className="font-bold text-zinc-200">{nombreMecanico}</span>
                                        </div>

                                        {/* LISTADO DE REPUESTOS SOLICITADOS */}
                                        {orden.detalles && orden.detalles.length > 0 && (
                                            <div className="space-y-1 pt-1">
                                                <p className="text-[9px] font-mono uppercase tracking-wider text-zinc-500 flex items-center gap-1">
                                                    <Package size={10} /> Componentes requeridos:
                                                </p>
                                                <div className="bg-zinc-950/60 border border-zinc-800/50 rounded-lg p-2 divide-y divide-zinc-800/40">
                                                    {orden.detalles.map((det: any) => (
                                                        <div key={det.id} className="py-1 first:pt-0 last:pb-0 flex justify-between items-center text-[10px]">
                                                            <span className="text-zinc-300 truncate max-w-[170px]">
                                                                {det.repuesto?.nombreComponente || `ID: ${det.repuestoId}`}
                                                            </span>
                                                            <span className="font-mono text-emerald-400 font-bold bg-zinc-900 border border-zinc-800 px-1.5 py-0.2 rounded">
                                                                x{det.cantidad}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* BOTÓN MANDAR A PISTA */}
                                    <div className="mt-5 pt-3 border-t border-zinc-800/40 flex justify-end">
                                        <button
                                            onClick={() => finalizarMutation.mutate(orden.id)}
                                            disabled={finalizarMutation.isPending}
                                            className="bg-emerald-600/10 hover:bg-emerald-600 border border-emerald-500/20 hover:border-emerald-500 text-emerald-400 hover:text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl transition-all disabled:opacity-50"
                                        >
                                            {finalizarMutation.isPending ? 'Cerrando...' : 'Mandar a Pista 🏁'}
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>

            {/* HISTORIAL (FINALIZADAS) */}
            {ordenesFinalizadas.length > 0 && (
                <div className="space-y-3 pt-6 border-t border-zinc-900/80">
                    <div className="flex items-center gap-2 text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">
                        <CheckCircle2 size={12} />
                        <span>Historial en Pista (Finalizadas)</span>
                    </div>

                    <div className="bg-zinc-900 border border-zinc-800/60 rounded-xl divide-y divide-zinc-800/40 overflow-hidden">
                        {ordenesFinalizadas.map((orden: any) => {
                            const mecanico = orden.mecanicoAsignado?.usuario;
                            const nombreMecanico = mecanico?.nombre || 'Sin Asignar';

                            return (
                                <div key={orden.id} className="p-3.5 flex justify-between items-center text-xs hover:bg-zinc-900/50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <span className="text-zinc-600 font-mono text-[10px] font-bold">
                                            #{String(orden.id).padStart(4, '0')}
                                        </span>
                                        <div>
                                            <p className="font-semibold text-zinc-300">{orden.descripcionTrabajo}</p>
                                            <span className="text-[10px] text-zinc-500 font-mono flex items-center gap-1">
                                                <User size={10} /> {nombreMecanico}
                                            </span>
                                        </div>
                                    </div>
                                    <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-mono font-bold uppercase tracking-wider">
                                        Terminado
                                    </span>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            <PlanificadorSetUpModal
                isOpen={modalAbierto}
                onClose={() => setModalAbierto(false)}
            />
        </div>
    )
}