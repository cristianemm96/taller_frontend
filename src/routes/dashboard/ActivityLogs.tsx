import { createFileRoute } from '@tanstack/react-router'
import { ActivityLogs } from '../../features/activity_logs/ActivityLogs'

export const Route = createFileRoute('/dashboard/ActivityLogs')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <ActivityLogs/>
    </div>
  )
}