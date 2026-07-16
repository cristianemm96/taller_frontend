import { X } from 'lucide-react'
import { ConsumoForm } from './ConsumoForm'
import { UbicacionForm } from './UbicacionForm'

interface QuickActionModalProps {
    repuesto: {
        id: number
        nombreComponente: string
        stockDisponible: number
        stockFisico: number
        cajonId: number
        estanteriaId: number
    }
    onClose: () => void
}

export const QuickActionModal = ({ repuesto, onClose }: QuickActionModalProps) => {
    return (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
                <div className="bg-zinc-800/50 p-4 border-b border-zinc-800 flex items-center justify-between">
                    <div>
                        <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Operación Rápida de Inventario</h3>
                        <p className="text-sm font-bold text-zinc-100 mt-0.5">{repuesto.nombreComponente}</p>
                    </div>
                    <button onClick={onClose} className="p-1 hover:bg-zinc-700 rounded-lg text-zinc-400 hover:text-white transition-colors">
                        <X size={18} />
                    </button>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8 divide-y md:divide-y-0 md:divide-x divide-zinc-800">
                    <div className="pb-6 md:pb-0">
                        <ConsumoForm repuesto={repuesto} onSuccess={onClose} />
                    </div>
                    <div className="pt-6 md:pt-0 md:pl-8">
                        <UbicacionForm repuesto={repuesto} onSuccess={onClose} />
                    </div>

                </div>
            </div>
        </div>
    )
}