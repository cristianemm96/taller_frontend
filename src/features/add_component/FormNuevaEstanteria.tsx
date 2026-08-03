import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import { ConstantesURL } from '../../constantes'
import { apiFetch } from '../../utils/api'

type FormProps = {
  onSuccessClose: () => void // Avisa al modal que se cierre al terminar
}

export const FormNuevaEstanteria = ({ onSuccessClose }: FormProps) => {
  const queryClient = useQueryClient()
  const [nombre, setNombre] = useState('')

  const mutation = useMutation({
    mutationFn: async (nombreEstanteria: string) => {
      const res = await apiFetch(`${ConstantesURL.estanteria}`, {
        method: 'POST',
        body: JSON.stringify({ nombre: nombreEstanteria })
      })
      if (!res.ok) throw new Error('No se pudo crear')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['estanterias'] })
      onSuccessClose() 
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!nombre.trim()) return
    mutation.mutate(nombre)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-zinc-900 rounded-xl border border-zinc-800">
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
          Nombre de la Estantería
        </label>
        <input 
          type="text"
          required
          placeholder="Ej: Estantería C"
          className="bg-zinc-800 border border-zinc-700 rounded-xl p-2.5 text-sm text-zinc-200 outline-none focus:border-zinc-500"
          onChange={(e) => setNombre(e.target.value)}
        />
      </div>
      <button 
        type="submit" 
        disabled={mutation.isPending}
        className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2"
      >
        <Plus size={16} />
        {mutation.isPending ? 'Creando...' : 'Crear Estantería'}
      </button>
    </form>
  )
}