import type { Dispatch, SetStateAction } from "react";
import type { RepuestoForm } from "../../types/repuestoFormType";


interface SetStockProps {
    formData: RepuestoForm;
    setFormData: Dispatch<SetStateAction<RepuestoForm>>;
}


export const SetStockComponent = ({ formData, setFormData }: SetStockProps) => {
    return (
        <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Stock Inicial</label>
            <input
                type="number"
                className="bg-zinc-900 border border-zinc-700 rounded-lg p-2.5 text-sm text-zinc-200 outline-none"
                onChange={(e) => setFormData({ ...formData, stockDisponible: parseInt(e.target.value) })}
            />
        </div>
    )
}