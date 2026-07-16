import type { Dispatch, SetStateAction } from "react"


interface SetDescriptionProps {
    descripcion: string
    setDescripcion: Dispatch<SetStateAction<string>>
}

export const SetDescriptionOrder = ({ descripcion, setDescripcion }: SetDescriptionProps) => {
    return (
        <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-black tracking-widest text-zinc-400">Descripción del Trabajo</label>
            <input
                type="text"
                required
                placeholder="Ej: Revisión de Embrague y Setup de Suspensión Post-Clasificación"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-zinc-700 outline-none rounded-xl px-4 py-2.5 text-xs font-medium text-zinc-100 placeholder-zinc-600 transition-colors" />
        </div>
    )
}