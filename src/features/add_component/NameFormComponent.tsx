import type { Dispatch, SetStateAction } from "react"
import type { RepuestoForm } from "../../types/repuestoFormType";

interface NameFormProps {
    formData: RepuestoForm;
    setFormData: Dispatch<SetStateAction<RepuestoForm>>;
}

export const NameFormComponent = ({ formData, setFormData }: NameFormProps) => {
    return (
        <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Nombre del Componente</label>
            <input
                type="text"
                placeholder="Ej: Bomba de agua Ford"
                className="bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-sm text-zinc-200 outline-none focus:border-orange-500 transition-all"
                onChange={(e) => setFormData({ ...formData, nombreComponente: e.target.value })}
            />
        </div>
    )

}