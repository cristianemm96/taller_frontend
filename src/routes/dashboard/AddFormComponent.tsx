import { createFileRoute } from '@tanstack/react-router'
import { AddFormComponent } from '../../features/add_component/AddFormComponent'

export const Route = createFileRoute('/dashboard/AddFormComponent')({
  component: agregarRepuestoPage
})


function agregarRepuestoPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-zinc-100">Gestión de Inventario</h1>
        <p className="text-zinc-500 text-sm">
          Completá los campos para dar de alta un nuevo componente en la estantería.
        </p>
      </div>

      <div className="flex justify-center w-full">
        <AddFormComponent />
      </div>
    </div>
  )
}