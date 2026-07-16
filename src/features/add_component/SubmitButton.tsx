import { Save } from "lucide-react"

export const SubmitButtonForm = ()=>{
    return(
        <div className="flex gap-4 pt-4">

          <button
            type="submit"
            className="flex-1 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold shadow-lg shadow-orange-500/20 transition-all flex items-center justify-center gap-2"
          >
            <Save size={18} />
            Guardar Repuesto
          </button>
        </div>
    )
}