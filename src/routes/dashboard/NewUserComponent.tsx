import { createFileRoute } from '@tanstack/react-router'
import { FormNewUser } from './users/NewUser'

export const Route = createFileRoute('/dashboard/NewUserComponent')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div className='align-content: center;'>
    <FormNewUser/>
  </div>
}
