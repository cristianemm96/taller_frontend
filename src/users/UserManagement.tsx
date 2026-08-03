import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Loader2, UserPlus, Shield, UserCheck, UserMinus, Edit2, Trash2 } from 'lucide-react'
import { ConstantesURL } from '../constantes'
import { apiFetch } from '../../src/utils/api'
import { NewUserComponent } from './NewUserComponent' 

interface User {
  id?: number
  usuarioId?: number
  nombre?: string
  email?: string
  telefono?: string
  rol?: string
  estado?: string
}

export const UserManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { data: usuarios = [], isLoading, isError } = useQuery<User[]>({
    queryKey: ['usuarios'],
    queryFn: async () => {
      const res = await apiFetch(`${ConstantesURL.usuarios}`, { method: "GET" })
      if (!res.ok) throw new Error("Error al consultar usuarios")
      const respuesta = await res.json()

      if (Array.isArray(respuesta)) return respuesta
      if (Array.isArray(respuesta?.elementos)) return respuesta.elementos
      if (Array.isArray(respuesta?.data)) return respuesta.data
      return []
    }
  })

  if (isLoading) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-16 gap-3 text-zinc-400">
        <Loader2 className="animate-spin text-orange-500" size={28} />
        <p className="text-sm">Cargando usuarios...</p>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="w-full p-6 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm text-center">
        No se pudo establecer conexión con el servidor.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-zinc-100 font-mono tracking-tight">EQUIPO DEL TALLER</h2>
          <p className="text-zinc-500 text-sm">Administrá los permisos y el acceso de los mecánicos al sistema.</p>
        </div>

        <button
          className="flex items-center justify-center gap-2 bg-zinc-100 hover:bg-white text-black px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg"
          onClick={() => setIsModalOpen(true)}
        >
          <UserPlus size={20} />
          Nuevo Mecánico
        </button>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-left">
          <thead className="bg-zinc-800/50 border-b border-zinc-800">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase">Nombre / Email</th>
              <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase">Teléfono</th>
              <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase">Rol</th>
              <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase text-center">Estado</th>
              <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {usuarios.map((user: User, index: number) => {
              const userId = user.usuarioId || user.id || `user-${index}`
              const nombreUsuario = user.nombre || 'Sin Nombre'
              const inicial = nombreUsuario.charAt(0).toUpperCase()

              return (
                <tr key={userId} className="hover:bg-zinc-800/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center text-lg border border-zinc-700 text-zinc-200 font-bold">
                        {inicial}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-zinc-200">{nombreUsuario}</span>
                        <span className="text-xs text-zinc-500">{user.email || '—'}</span>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm text-zinc-300">
                    {user.telefono || <span className="text-zinc-600">—</span>}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Shield size={14} className={user.rol?.toLowerCase() === 'encargado' ? 'text-red-500' : 'text-zinc-400'} />
                      <span className="capitalize text-zinc-300">{user.rol || 'Mecánico'}</span>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase border ${
                        user.estado?.toLowerCase() === 'activo'
                          ? 'bg-green-500/10 text-green-500 border-green-500/20'
                          : 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20'
                      }`}>
                        {user.estado?.toLowerCase() === 'activo' ? <UserCheck size={12} /> : <UserMinus size={12} />}
                        {user.estado || 'Inactivo'}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 hover:bg-zinc-700 rounded-lg text-zinc-400 hover:text-white transition-colors">
                        <Edit2 size={16} />
                      </button>
                      <button className="p-2 hover:bg-red-500/10 rounded-lg text-zinc-600 hover:text-red-500 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="w-full max-w-md">
              <NewUserComponent onClose={() => setIsModalOpen(false)} />
            </div>
          </div>
        )}
      </div>

      <p className="text-[11px] text-zinc-600 italic px-2">
        * Solo los usuarios con rol de <strong>Encargado</strong> pueden modificar permisos o eliminar mecánicos.
      </p>
    </div>
  )
}