import type { Dispatch, SetStateAction } from "react";
import type { RepuestoForm } from "../../types/repuestoFormType";

interface CodeReferenceProps {
    formData: RepuestoForm;
    setFormData: Dispatch<SetStateAction<RepuestoForm>>;
}

export const CodeReferenceComponent = ({formData, setFormData}: CodeReferenceProps) => {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">
                Código / Referencia
            </label>
            <input
                required
                type="text"
                placeholder="Ej: RE-4502-X"
                value={formData.codReferencia}
                className="bg-zinc-800 border border-zinc-700 rounded-xl p-2.5 text-sm text-zinc-200 outline-none focus:border-zinc-500 transition-colors w-full placeholder:text-zinc-600"
                onChange={(e) => setFormData({ ...formData, codReferencia: e.target.value })}
            />
        </div>
    )
}