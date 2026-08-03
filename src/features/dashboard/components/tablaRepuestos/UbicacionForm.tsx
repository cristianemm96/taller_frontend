import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { MapPin, Loader2 } from 'lucide-react'
import { ConstantesURL } from '../../../../constantes'
import { apiFetch } from '../../../../utils/api'

export const UbicacionForm = ({ repuesto, onSuccess }: { repuesto: any, onSuccess: () => void }) => {
    const queryClient = useQueryClient()

    const { data: estanterias = [], isLoading } = useQuery<any[]>({
        queryKey: ['estanterias-mapa'],
        queryFn: async () => {
            const res = await apiFetch(`${ConstantesURL.estanteria}/mapa`,
                { method: 'GET' }
            )
            return res.json()
        }
    })

    console.log(estanterias)

    const [estanteId, setEstanteId] = useState<number>(repuesto.estanteriaId)
    const [cajonId, setCajonId] = useState<number>(repuesto.cajonId)

    useEffect(() => {
        const selected = estanterias.find(e => e.estanteriaId === estanteId)
        if (selected && selected.cajones.length > 0 && estanteId !== repuesto.estanteriaId) {
            setCajonId(selected.cajones[0].id)
        }
    }, [estanteId, estanterias])

    const cajonesDisponibles = estanterias.find(e => e.estanteriaId === estanteId)?.cajones || []

    const moverMutation = useMutation({
        mutationFn: async () => {
            const res = await apiFetch(`${ConstantesURL.stock}/${repuesto.id}/mover`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    NuevoCajonId: Number(cajonId),
                    UsuarioId: 1
                })
            })
            if (!res.ok) throw new Error('Error al mover')
            return res.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['repuestos'] })
            onSuccess()
        }
    })

    if (isLoading) return <div className="text-zinc-500 text-xs text-center py-8"><Loader2 className="animate-spin inline mr-2" /> Cargando mapa...</div>

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 text-emerald-500 font-bold text-xs uppercase tracking-wider">
                <MapPin size={16} />
                <span>Mudar Ubicación</span>
            </div>

            <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">Estantería</label>
                <select
                    value={estanteId}
                    onChange={(e) => setEstanteId(Number(e.target.value))}
                    className="bg-zinc-800 border border-zinc-700 rounded-xl p-2.5 text-sm text-zinc-200 outline-none focus:border-emerald-500 w-full"
                >
                    {estanterias.map(e => <option key={e.estanteriaId} value={e.estanteriaId}>{e.nombre}</option>)}
                </select>
            </div>

            <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">Cajón</label>
                <select
                    value={cajonId}
                    onChange={(e) => setCajonId(Number(e.target.value))}
                    className="bg-zinc-800 border border-zinc-700 rounded-xl p-2.5 text-sm text-zinc-200 outline-none focus:border-emerald-500 w-full"
                >
                    {cajonesDisponibles.map((c: any) => <option key={c.codigo} value={c.cajonId}>{c.codigo}</option>)}
                </select>
            </div>

            <button
                onClick={() => moverMutation.mutate()}
                disabled={cajonId === repuesto.cajonId || moverMutation.isPending}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition-colors"
            >
                {moverMutation.isPending ? 'Mudando...' : 'Confirmar Nuevo Estante'}
            </button>
        </div>
    )
}