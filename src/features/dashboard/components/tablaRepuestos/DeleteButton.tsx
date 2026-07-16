import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Trash2 } from 'lucide-react'
import { ConstantesURL } from '../../../../constantes'

interface DeleteButtonProps {
    repuestoId: number
    nombreComponente: string
}

export const DeleteButton = ({ repuestoId, nombreComponente }: DeleteButtonProps) => {
    const queryClient = useQueryClient()

    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            const res = await fetch(`${ConstantesURL.repuesto}/${id}`, {
                method: 'DELETE',
            })
            if (!res.ok) throw new Error('No se pudo eliminar el repuesto')
            return res.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['repuestos'] })
            queryClient.invalidateQueries({ queryKey: ['faltantes'] })
        },
        onError: (err) => {
            alert(`Error al eliminar: ${(err as Error).message}`)
        }
    })

    const handleEliminar = () => {
        const confirmar = window.confirm(`¿Estás seguro de que querés eliminar "${nombreComponente}"?`)
        if (confirmar) {
            deleteMutation.mutate(repuestoId)
        }
    }

    return (
        <button 
            onClick={handleEliminar}
            disabled={deleteMutation.isPending}
            className="p-1.5 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-red-500 transition-colors disabled:opacity-30"
            title="Eliminar repuesto"
        >
            <Trash2 size={16} />
        </button>
    )
}