import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Trash2 } from 'lucide-react'
import { ConstantesURL } from '../../constantes'
import { SetDescriptionOrder } from './planificadorComponents/SetDescriptionOrder'
import { HeaderModal } from './planificadorComponents/HeaderModal'
import { SetMecanicoSeleccionadoComponent } from './planificadorComponents/SetMecanicoSeleccionadoComponent'
import { apiFetch } from '../../utils/api'

interface PlanificadorProps {
    isOpen: boolean
    onClose: () => void
}

interface DetalleItem {
    repuestoId: number
    cantidad: number
    nombreComponente?: string
    stockMaximo?: number
}

interface Usuario {
    id: number,
    nombre: string
}

export const PlanificadorSetUpModal = ({ isOpen, onClose }: PlanificadorProps) => {
    const queryClient = useQueryClient()
    const [descripcion, setDescripcion] = useState('')
    const [mecanicoSeleccionado, setMecanicoSeleccionado] = useState<Usuario | null>(null)
    const [detalles, setDetalles] = useState<DetalleItem[]>([])
    const token = localStorage.getItem("token")
    const { data: repuestos } = useQuery({
        queryKey: ['repuestos'],
        queryFn: async () => {
            const res = await apiFetch(`${ConstantesURL.repuesto}`,
                {method: "GET"}
            )
            return res.json()
        },
        enabled: !!token
    })
    const crearOrdenMutation = useMutation({
        mutationFn: async (nuevaOrden: any) => {
            const res = await apiFetch(`${ConstantesURL.ordenes}`, {
                method: 'POST',
                body: JSON.stringify(nuevaOrden)
            })
            if (!res.ok) {
                const errorData = await res.json()
                throw new Error(errorData.message || 'Error al procesar la orden en boxes')
            }
            return res.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['ordenes'] })
            queryClient.invalidateQueries({ queryKey: ['repuestos'] }) 
            onClose()
            setDescripcion('')
            setMecanicoSeleccionado(null)
            setDetalles([])
        },
        onError: (error: any) => {
            alert(`Error: ${error.message}`)
        }
    })

    if (!isOpen) return null
    // Funciones para gestionar las filas de repuestos requeridos
    const agregarFilaRepuesto = () => {
        setDetalles([...detalles, { repuestoId: 0, cantidad: 1 }])
    }

    const eliminarFilaRepuesto = (index: number) => {
        setDetalles(detalles.filter((_, i) => i !== index))
    }

    const cambiarRepuestoFila = (index: number, id: number) => {
        const repuestoElegido = repuestos?.elementos.find((r: any) => r.id === id)
        const nuevosDetalles = [...detalles]
        nuevosDetalles[index] = {
            repuestoId: id,
            cantidad: 1,
            nombreComponente: repuestoElegido?.nombreComponente,
            stockMaximo: repuestoElegido?.stockDisponible 
        }
        setDetalles(nuevosDetalles)
    }

    const cambiarCantidadFila = (index: number, cant: number) => {
        const nuevosDetalles = [...detalles]
        nuevosDetalles[index].cantidad = cant
        setDetalles(nuevosDetalles)
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        const idMecanico = mecanicoSeleccionado?.id || mecanicoSeleccionado?.id || 0

        const payload = {
            descripcionTrabajo: descripcion,
            mecanicoId: Number(idMecanico), 
            detalles: detalles
                .filter(d => d.repuestoId > 0)
                .map(d => ({ 
                    repuestoId: d.repuestoId, 
                    cantidad: d.cantidad 
                }))
        }
        crearOrdenMutation.mutate(payload)
    }

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto text-white flex flex-col">
                <HeaderModal onClose={onClose}/>
                <form onSubmit={handleSubmit} className="p-5 space-y-5 flex-1">
                    <SetDescriptionOrder descripcion={descripcion} setDescripcion={setDescripcion}/>
                    <SetMecanicoSeleccionadoComponent mecanicoSeleccionado={mecanicoSeleccionado} setMecanicoSeleccionado={setMecanicoSeleccionado}/>
                    <div className="space-y-2 pt-2 border-t border-zinc-800/60">
                        <div className="flex justify-between items-center">
                            <label className="text-[10px] uppercase font-black tracking-widest text-zinc-400">Paquete de Repuestos a Reservar</label>
                            <button
                                type="button"
                                onClick={agregarFilaRepuesto}
                                className="text-[10px] font-black uppercase bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                            >
                                <Plus size={12} /> Añadir Repuesto
                            </button>
                        </div>

                        {detalles.length === 0 ? (
                            <div className="bg-zinc-950 border border-zinc-850 rounded-xl p-6 text-center text-zinc-600 text-[11px] font-mono uppercase tracking-wider">
                                No se asignaron repuestos para este trabajo. Saldrá a pista sin piezas nuevas.
                            </div>
                        ) : (
                            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                                {detalles.map((detalle, index) => (
                                    <div key={index} className="flex gap-2 items-center bg-zinc-950 p-2 rounded-xl border border-zinc-850/80">

                                        {/* Selector de repuesto */}
                                        <select
                                            value={detalle.repuestoId}
                                            onChange={(e) => cambiarRepuestoFila(index, Number(e.target.value))}
                                            className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs font-semibold text-zinc-200 outline-none"
                                        >
                                            <option value={0}>-- Seleccionar Componente --</option>
                                            {repuestos?.elementos.map((r: any) => (
                                                <option key={r.id} value={r.id} disabled={r.stockDisponible <= 0}>
                                                    {r.nombreComponente} (Disponibles: {r.stockDisponible})
                                                </option>
                                            ))}
                                        </select>

                                        {/* Selector de cantidad*/}
                                        <div className="w-24">
                                            <input
                                                type="number"
                                                min={1}
                                                max={detalle.stockMaximo || 99}
                                                value={detalle.cantidad}
                                                onChange={(e) => cambiarCantidadFila(index, Number(e.target.value))}
                                                className="w-full bg-zinc-900 border border-zinc-800 text-center rounded-lg p-2 text-xs font-bold text-zinc-200"
                                            />
                                        </div>

                                        {/* Botón para remover fila */}
                                        <button
                                            type="button"
                                            onClick={() => eliminarFilaRepuesto(index)}
                                            className="p-2 hover:bg-zinc-800/80 text-red-400 hover:text-red-300 rounded-lg transition-colors"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Botones de Acción Final */}
                    <div className="pt-4 border-t border-zinc-800 flex justify-end gap-2 bg-zinc-900 sticky bottom-0">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-zinc-800 hover:bg-zinc-700 text-zinc-400 text-[10px] font-black uppercase tracking-widest px-4 py-2.5 rounded-xl transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={crearOrdenMutation.isPending}
                            className="bg-orange-500 hover:bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest px-5 py-2.5 rounded-xl shadow-lg transition-all disabled:opacity-50"
                        >
                            {crearOrdenMutation.isPending ? 'Congelando Stock...' : 'Confirmar y Reservar Setup'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

