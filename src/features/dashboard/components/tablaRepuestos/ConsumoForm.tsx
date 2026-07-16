import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { PackageMinus, PackagePlus, AlertCircle } from 'lucide-react' 
import { ConstantesURL } from '../../../../constantes'

export const ConsumoForm = ({ repuesto, onSuccess }: { repuesto: any, onSuccess: () => void }) => {
    const queryClient = useQueryClient()
    const [cantidad, setCantidad] = useState<number>(1)
    const [tipoOperacion, setTipoOperacion] = useState<'retirar' | 'abastecer'>('retirar')
    const [errorBackend, setErrorBackend] = useState<string | null>(null)

    const stockMutation = useMutation({
        mutationFn: async (payload: { repuestoId: number; cantidad: number; usuarioId: number }) => {
            setErrorBackend(null) // Limpia errores previos al intentar
            const res = await fetch(`${ConstantesURL.stock}/ajustar`, { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })
            
            const data = await res.json()
            console.log(data)
            if (!res.ok) {
                throw new Error(data.message || 'Error al actualizar el stock')
            }
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['repuestos'] })
            onSuccess()
        },
        onError: (err: any) => {
            setErrorBackend(err.message)
        }
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const cantidadFinal = tipoOperacion === 'retirar' ? cantidad * -1 : cantidad
        stockMutation.mutate({
            repuestoId: repuesto?.id,
            cantidad: cantidadFinal,
            usuarioId: 1 // TODO: Reemplazar por el id de tu usuario logueado en el taller
        })
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className={`flex items-center gap-2 font-bold text-xs uppercase tracking-wider transition-colors ${
                tipoOperacion === 'retirar' ? 'text-red-500' : 'text-emerald-500'
            }`}>
                {tipoOperacion === 'retirar' ? <PackageMinus size={16} /> : <PackagePlus size={16} />}
                <span>{tipoOperacion === 'retirar' ? 'Retirar Stock (Consumo)' : 'Abastecer Caja (Compra)'}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
                <button type="button" onClick={() => { setTipoOperacion('retirar'); setErrorBackend(null); }}
                    className={`py-2 text-xs font-bold rounded-xl border ${tipoOperacion === 'retirar' ? 'bg-red-950/40 text-red-400 border-red-800' : 'bg-zinc-900 text-zinc-500 border-zinc-800'}`}>
                    🔴 Retirar
                </button>
                <button type="button" onClick={() => { setTipoOperacion('abastecer'); setErrorBackend(null); }}
                    className={`py-2 text-xs font-bold rounded-xl border ${tipoOperacion === 'abastecer' ? 'bg-emerald-950/40 text-emerald-400 border-emerald-800' : 'bg-zinc-900 text-zinc-500 border-zinc-800'}`}>
                    🟢 Abastecer
                </button>
            </div>
            <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800/80 grid grid-cols-2 gap-2 text-center">
                <div>
                    <p className="text-[10px] uppercase font-semibold text-zinc-500 tracking-wider">Stock Físico</p>
                    <p className="text-xl font-bold text-zinc-200 mt-1">{repuesto?.stockFisico} uds</p>
                </div>
                <div>
                    <p className="text-[10px] uppercase font-semibold text-zinc-500 tracking-wider">Disponible (Libre)</p>
                    <p className="text-xl font-bold text-orange-400 mt-1">{repuesto?.stockDisponible} uds</p>
                </div>
            </div>
            <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">
                    Cantidad a {tipoOperacion === 'retirar' ? 'retirar' : 'ingresar'}
                </label>
                <input 
                    type="number" 
                    min="1" 
                    max={tipoOperacion === 'retirar' ? (repuesto?.stockDisponible ?? 1) : (6 - (repuesto?.stockFisico ?? 0))}
                    value={cantidad}
                    onChange={(e) => setCantidad(Math.abs(parseInt(e.target.value) || 1))}
                    className="bg-zinc-800 border border-zinc-700 rounded-xl p-2.5 text-sm text-white outline-none focus:border-zinc-500 w-full"
                />
            </div>

            {errorBackend && (
                <div className="bg-red-950/30 border border-red-900 text-red-400 p-3 rounded-xl flex items-start gap-2 text-xs">
                    <AlertCircle size={16} className="shrink-0 mt-0.5" />
                    <span>{errorBackend}</span>
                </div>
            )}

            <button type="submit" disabled={stockMutation.isPending || (tipoOperacion === 'retirar' && repuesto?.stockDisponible === 0)}
                className={`w-full py-2.5 disabled:opacity-30 text-white rounded-xl text-xs font-bold ${tipoOperacion === 'retirar' ? 'bg-red-600' : 'bg-emerald-600'}`}>
                {stockMutation.isPending ? 'Procesando...' : tipoOperacion === 'retirar' ? 'Confirmar Retiro' : 'Confirmar Ingreso'}
            </button>
        </form>
    )
}