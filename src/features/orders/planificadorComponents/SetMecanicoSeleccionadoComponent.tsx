import { useQuery } from "@tanstack/react-query"
import type { Usuario } from "../../../types/usuarioType"
import { ConstantesURL } from "../../../constantes"

interface SetMecanicosProps {
    mecanicoSeleccionado: Usuario | null
    setMecanicoSeleccionado: React.Dispatch<React.SetStateAction<Usuario | null>>
}

export const SetMecanicoSeleccionadoComponent = ({ mecanicoSeleccionado, setMecanicoSeleccionado }: SetMecanicosProps) => {
    const {data: usuarios} = useQuery({
        queryKey:['usuarios'],
        queryFn: async()=>{
            const res = await fetch(`${ConstantesURL.usuarios}`)
            return res.json();
        }
    })
    
    return (
        <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-black tracking-widest text-zinc-400">Mecánico Asignado</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {usuarios?.map((u: Usuario) => {
                    const seleccionado = u.id == mecanicoSeleccionado?.id
                    return (
                        <button
                            type="button"
                            key={u.id}
                            onClick={() => {
                                setMecanicoSeleccionado(u)
                            }}
                            className={`p-2.5 rounded-xl border text-[11px] font-bold uppercase transition-all tracking-wide text-left ${seleccionado
                                ? 'bg-zinc-100 text-zinc-950 border-white font-black'
                                : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:border-zinc-700'
                                }`}
                        >
                            {u.nombre}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}