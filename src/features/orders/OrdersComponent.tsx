import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Clock, CheckCircle2, User, Wrench } from 'lucide-react'
import { PlanificadorSetUpModal } from './PlanificadorSetUpModal'
import { ConstantesURL } from '../../constantes'

export const OrdenesComponent = () => {
    const queryClient = useQueryClient()
    const [modalAbierto, setModalAbierto] = useState(false)
    const { data: ordenes, isLoading } = useQuery({
        queryKey: ['ordenes'],
        queryFn: async () => {
            const res = await fetch(`${ConstantesURL.ordenes}`)
            if (!res.ok) throw new Error('Error al cargar órdenes de boxes')
            return res.json()
        }
    })

    const finalizarMutation = useMutation({
        mutationFn: async (id: number) => {
            const res = await fetch(`http://localhost:5000/api/ordenes/${id}/finalizar`, {
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

    if (isLoading) return <div className="text-zinc-500 p-6 text-xs font-bold font-mono uppercase tracking-widest animate-pulse">Alineando neumáticos...</div>

    // Clasificamos los trabajos
    const ordenesAbiertas = ordenes?.filter((o: any) => o.estado === 'Abierta') || []
    const ordenesFinalizadas = ordenes?.filter((o: any) => o.estado === 'Finalizada') || []

    return (
        <div className="p-6 space-y-6 bg-zinc-950 min-h-screen text-white">
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
                        {ordenesAbiertas.map((orden: any) => (
                            <div key={orden.id} className="bg-zinc-900 border border-zinc-800/80 rounded-2xl p-4 flex flex-col justify-between hover:border-zinc-700 transition-all shadow-md group">
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="bg-zinc-950 text-zinc-500 border border-zinc-800 px-2 py-0.5 rounded text-[9px] font-mono font-bold">
                                            ORD-{String(orden.id).padStart(4, '0')}
                                        </span>
                                        <span className="text-[9px] font-mono text-zinc-500">
                                            {new Date(orden.fechaCreacion).toLocaleDateString()}
                                        </span>
                                    </div>

                                    <p className="text-xs font-bold text-zinc-200 leading-snug group-hover:text-white transition-colors">
                                        {orden.descripcionTrabajo}
                                    </p>
                                    <div className="flex flex-wrap gap-1 pt-2">
                                        {orden.mecanicosAsignados?.map((m: any) => (
                                            <span key={m.id} className="flex items-center gap-1 text-[9px] bg-zinc-950 border border-zinc-800 px-2 py-0.5 rounded-lg text-zinc-400 font-mono">
                                                <User size={8} className="text-zinc-600" />
                                                {m.usuario?.nombre || `MEC-${m.usuarioId}`}
                                            </span>
                                        ))}
                                    </div>
                                </div>

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
                        ))}
                    </div>
                )}
            </div>
            {ordenesFinalizadas.length > 0 && (
                <div className="space-y-3 pt-6 border-t border-zinc-900/80">
                    <div className="flex items-center gap-2 text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">
                        <CheckCircle2 size={12} />
                        <span>Historial en Pista (Finalizadas)</span>
                    </div>

                    <div className="bg-zinc-900 border border-zinc-800/60 rounded-xl divide-y divide-zinc-800/40 overflow-hidden">
                        {ordenesFinalizadas.map((orden: any) => (
                            <div key={orden.id} className="p-3.5 flex justify-between items-center text-xs hover:bg-zinc-900/50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <span className="text-zinc-600 font-mono text-[10px] font-bold">
                                        #{String(orden.id).padStart(4, '0')}
                                    </span>
                                    <p className="font-semibold text-zinc-400">{orden.descripcionTrabajo}</p>
                                </div>
                                <span className="text-[10px] bg-zinc-950 text-zinc-500 border border-zinc-800/80 px-2 py-0.5 rounded font-mono font-bold uppercase tracking-wider">
                                    Terminado
                                </span>
                            </div>
                        ))}
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