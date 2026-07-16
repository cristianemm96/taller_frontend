import { useState } from 'react'
import { UserPlus, Shield, Eye, EyeOff, Save} from 'lucide-react'

export const FormNewUser = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    rol: 'mecanico'
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Enviando nuevo usuario a NestJS:", formData)
  }

  return (
    <div className="max-w-xl bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="bg-zinc-800/40 p-6 border-b border-zinc-800 flex items-center gap-3">
        <div className="p-2 bg-zinc-800 rounded-lg text-zinc-200 border border-zinc-700">
          <UserPlus size={22} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-zinc-100">Registrar Miembro del Equipo</h2>
          <p className="text-xs text-zinc-500">Asigná las credenciales y el rol de acceso al sistema.</p>
        </div>
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Nombre</label>
            <input 
              type="text"
              required
              placeholder="Ej: Juan"
              className="bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-sm text-zinc-200 outline-none focus:border-zinc-500 transition-colors"
              onChange={(e) => setFormData({...formData, nombre: e.target.value})}
            />
          </div>
          
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Apellido</label>
            <input 
              type="text"
              required
              placeholder="Ej: Pérez"
              className="bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-sm text-zinc-200 outline-none focus:border-zinc-500 transition-colors"
              onChange={(e) => setFormData({...formData, apellido: e.target.value})}
            />
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Correo Electrónico</label>
          <input 
            type="email"
            required
            placeholder="juan.perez@taller.com"
            className="bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-sm text-zinc-200 outline-none focus:border-zinc-500 transition-colors"
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Contraseña Provisoria</label>
          <div className="relative">
            <input 
              type={showPassword ? 'text' : 'password'}
              required
              placeholder="Mínimo 6 caracteres"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 pr-10 text-sm text-zinc-200 outline-none focus:border-zinc-500 transition-colors"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-1/2 -translate-y-1/2 right-3 text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-1.5 p-4 bg-zinc-950/40 border border-zinc-800 rounded-xl">
          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1">
            <Shield size={12} /> Rol de Acceso
          </label>
          <select 
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-2.5 text-sm text-zinc-200 outline-none focus:border-zinc-500 cursor-pointer"
            value={formData.rol}
            onChange={(e) => setFormData({...formData, rol: e.target.value})}
          >
            <option value="mecanico">Mecánico (Solo lectura y movimientos básicos)</option>
            <option value="encargado">Encargado (Control total, usuarios y stock)</option>
          </select>
        </div>
        <div className="flex gap-3 pt-2">
          <button 
            type="button"
            className="flex-1 py-3 border border-zinc-800 hover:bg-zinc-800 rounded-xl text-sm font-medium text-zinc-400 transition-colors"
          >
            Cancelar
          </button>
          <button 
            type="submit"
            className="flex-1 py-3 bg-zinc-100 hover:bg-white text-black font-bold rounded-xl text-sm transition-all shadow-lg flex items-center justify-center gap-2"
          >
            <Save size={16} />
            Crear Usuario
          </button>
        </div>

      </form>
    </div>
  )
}