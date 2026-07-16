import { PackagePlus } from "lucide-react"

export const TitleFormComponent = () => {
    return (
        <div className="bg-zinc-800/50 p-6 border-b border-zinc-800 flex items-center gap-3">
            <div className="p-2 bg-orange-500/10 rounded-lg text-orange-500">
                <PackagePlus size={24} />
            </div>
            <div>
                <h2 className="text-xl font-bold text-zinc-100">Nuevo Repuesto</h2>
                <p className="text-sm text-zinc-500">Ingresá los datos del repuesto y su ubicación en el taller.</p>
            </div>
        </div>
    )
}