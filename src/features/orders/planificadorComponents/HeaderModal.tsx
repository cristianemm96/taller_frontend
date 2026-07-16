import { X } from "lucide-react"

interface CloseModalButtonProps {
    onClose: () => void
}

export const HeaderModal = ({ onClose }: CloseModalButtonProps) => {
    return (
        <div className="p-5 border-b border-zinc-800 flex justify-between items-center bg-zinc-900 sticky top-0 z-10">
            <div>
                <h2 className="text-sm font-black uppercase tracking-wider">Crear orden de trabajo</h2>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-0.5">Asignación de repuestos y mecánicos.</p>
            </div>
            <button onClick={onClose} className="p-1.5 hover:bg-zinc-800 rounded-lg text-zinc-500 hover:text-zinc-300 transition-colors">
                <X size={16} />
            </button>
        </div>
    )

}