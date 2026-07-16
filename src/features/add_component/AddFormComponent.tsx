import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { UbicacionComponent } from './UbicacionComponent'
import { ConstantesURL } from '../../constantes'
import { CategoriaSelectComponent } from './CategoriaSelectComponent'
import type { RepuestoForm } from '../../types/repuestoFormType'
import { NameFormComponent } from './NameFormComponent'
import { CodeReferenceComponent } from './CodeReferenceComponent'
import { SetStockComponent } from './SetStockComponent'
import { SubmitButtonForm } from './SubmitButton'
import { TitleFormComponent } from './TitleFormComponent'

export const AddFormComponent = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  // Estado local
  const [formData, setFormData] = useState<RepuestoForm>({
    nombreComponente: '',
    stockDisponible: 0,
    categoriaId: '' as number | '',
    codReferencia: '',
    ubicacionCajon: 0
  })

  const mutation = useMutation({
    mutationFn: async (nuevoRepuesto: typeof formData) => {
      const response = await fetch(`${ConstantesURL.repuesto}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Actualizar con token de usuario
        },
        body: JSON.stringify(nuevoRepuesto)
      })

      if (!response.ok) {
        throw new Error('No se pudo guardar el repuesto en el servidor de C#')
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['repuestos'] })
      queryClient.invalidateQueries({ queryKey: ['faltantes'] })
      navigate({ to: '/dashboard' as any })
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    mutation.mutate(formData)
  }

  return (
    <div className="max-w-2xl bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
      <TitleFormComponent/>
      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <NameFormComponent formData={formData} setFormData={setFormData} />
          <CodeReferenceComponent formData={formData} setFormData={setFormData} />
          <div className="flex flex-col gap-2">
            <CategoriaSelectComponent
              categoriaIdSeleccionada={formData.categoriaId}
              onCategoriaChange={(id) => setFormData({ ...formData, categoriaId: id })}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-zinc-950/50 rounded-2xl border border-zinc-800">
          <SetStockComponent formData={formData} setFormData={setFormData} />
        </div>
        <UbicacionComponent
          cajonIdSeleccionado={formData.ubicacionCajon}
          onCajonChange={(id) => setFormData({ ...formData, ubicacionCajon: id })}
        />
        <SubmitButtonForm />
      </form>
    </div>
  )
}
