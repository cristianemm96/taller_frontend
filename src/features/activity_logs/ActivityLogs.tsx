import { Package, UserPlus, Trash2, Edit3, ArrowRightLeft } from 'lucide-react'

const logs = [
  {
    id: 1,
    type: 'stock_update',
    user: 'Cristian',
    action: 'agregó 20 unidades de',
    target: 'Bomba de Agua Fiat',
    time: '10:45 AM',
    icon: Package,
    color: 'text-green-500',
    bg: 'bg-green-500/10'
  },
  {
    id: 2,
    type: 'movement',
    user: 'Roberto',
    action: 'movió de A-1 a B-3 el repuesto',
    target: 'Filtro de Aire Universal',
    time: '09:30 AM',
    icon: ArrowRightLeft,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10'
  },
  {
    id: 3,
    type: 'delete',
    user: 'Cristian',
    action: 'eliminó permanentemente',
    target: 'Usuario: Juan Pérez',
    time: 'Ayer',
    icon: Trash2,
    color: 'text-red-500',
    bg: 'bg-red-500/10'
  }
]

export const ActivityLogs = () => {
  return (
    <div className="max-w-3xl space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-zinc-100">Registro de Actividad</h2>
        <button className="text-xs text-orange-500 hover:underline">Limpiar historial</button>
      </div>

      <div className="relative space-y-4 before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-zinc-800 before:via-zinc-800 before:to-transparent">
        {logs.map((log) => (
          <div key={log.id} className="relative flex items-start gap-4 group">
            <div className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-full border border-zinc-800 shrink-0 ${log.bg} ${log.color}`}>
              <log.icon size={18} />
            </div>
            <div className="flex flex-col bg-zinc-900/50 border border-zinc-800 p-4 rounded-xl flex-1 group-hover:border-zinc-700 transition-colors">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-bold text-zinc-200">{log.user}</span>
                <span className="text-[10px] text-zinc-500 font-mono uppercase">{log.time}</span>
              </div>
              <p className="text-sm text-zinc-400">
                {log.action} <span className="text-zinc-200 font-medium italic">"{log.target}"</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}