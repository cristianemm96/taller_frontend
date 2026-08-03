import { createFileRoute } from '@tanstack/react-router'
import { MecanicoVista } from '../../features/orders_mecanico/MecanicoVista' 

export const Route = createFileRoute('/dashboard/MecanicoOrdenes')({
  component: MecanicoTareasComponent,
})

function MecanicoTareasComponent() {
  return <MecanicoVista />
}