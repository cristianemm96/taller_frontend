import { useState } from 'react'
import { UserPlus, Shield, Trash2, Edit2, UserCheck, UserMinus } from 'lucide-react'

// Tipado para mayor seguridad
type User = {
  id: string;
  nombre: string;
  email: string;
  rol: 'encargado' | 'mecanico';
  estado: 'activo' | 'inactivo';
  ultimoAcceso: string;
}

const initialUsers: User[] = [
  { id: '1', nombre: 'Cristian', email: 'cristian@taller.com', rol: 'encargado', estado: 'activo', ultimoAcceso: 'Hoy, 10:30' },
  { id: '2', nombre: 'Roberto', email: 'roberto.mecanica@gmail.com', rol: 'mecanico', estado: 'activo', ultimoAcceso: 'Ayer, 18:15' },
  { id: '3', nombre: 'Juan', email: 'juan.p@taller.com', rol: 'mecanico', estado: 'inactivo', ultimoAcceso: 'Hace 5 días' },
]

export const UserManagement = () => {
  const [users] = useState<User[]>(initialUsers)

  return (
    <div className="space-y-6">
      {/* HEADER DE GESTIÓN */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-zinc-100 font-mono tracking-tight">EQUIPO DEL TALLER</h2>
          <p className="text-zinc-500 text-sm">Administrá los permisos y el acceso de los mecánicos al sistema.</p>
        </div>

        <button className="flex items-center justify-center gap-2 bg-zinc-100 hover:bg-white text-black px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg">
          <UserPlus size={20} />
          Nuevo Mecánico
        </button>
      </div>

      {/* TABLA DE USUARIOS */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-left">
          <thead className="bg-zinc-800/50 border-b border-zinc-800">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase">Usuario / Email</th>
              <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase">Rol</th>
              <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase text-center">Estado</th>
              <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {users.map((user: User) => (
              <tr key={user.id} className="hover:bg-zinc-800/30 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center text-lg border border-zinc-700">
                      {user.nombre.charAt(0)}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-zinc-200">{user.nombre}</span>
                      <span className="text-xs text-zinc-500">{user.email}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Shield size={14} className={user.rol === 'encargado' ? 'text-red-500' : 'text-zinc-400'} />
                    <span className="capitalize text-zinc-300">{user.rol}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-center">
                    <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase border ${
                      user.estado === 'activo' 
                      ? 'bg-green-500/10 text-green-500 border-green-500/20' 
                      : 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20'
                    }`}>
                      {user.estado === 'activo' ? <UserCheck size={12}/> : <UserMinus size={12}/>}
                      {user.estado}
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
            ))}
          </tbody>
        </table>
      </div>
      
      <p className="text-[11px] text-zinc-600 italic px-2">
        * Solo los usuarios con rol de <strong>Encargado</strong> pueden modificar permisos o eliminar mecánicos.
      </p>
    </div>
  )
}