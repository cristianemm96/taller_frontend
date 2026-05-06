import { createFileRoute } from '@tanstack/react-router'
import { UserManagement } from '../../users/UserManagement'

export const Route = createFileRoute('/dashboard/UsersManagement')({
  component: UsersManagementPage,
})

function UsersManagementPage() {
  return (
    <div>
      <UserManagement />
    </div>
  )
}
