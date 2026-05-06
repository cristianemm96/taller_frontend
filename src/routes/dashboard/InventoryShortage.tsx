import { createFileRoute } from '@tanstack/react-router'
import { InventoryShortage } from '../../features/list_generator/InventoryShortage'

export const Route = createFileRoute('/dashboard/InventoryShortage')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <h2>Generar listado</h2>
      <InventoryShortage/>
    </div>
    )
}
