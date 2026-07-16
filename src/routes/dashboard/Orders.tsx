import { createFileRoute } from '@tanstack/react-router'
import { OrdenesComponent } from '../../features/orders/OrdersComponent'

export const Route = createFileRoute('/dashboard/Orders')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div><OrdenesComponent/></div>
}
