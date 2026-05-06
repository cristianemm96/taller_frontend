import { useState } from 'react'
import { PackagePlus, Save } from 'lucide-react'

export const AddFormComponent = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    categoria: '',
    stock: 0,
    ubicacion: {
      estanteria: '',
      cajon: 1
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Enviando a NestJS:", formData)
  }

  return (
    <div className="max-w-2xl bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
      <div className="bg-zinc-800/50 p-6 border-b border-zinc-800 flex items-center gap-3">
        <div className="p-2 bg-orange-500/10 rounded-lg text-orange-500">
          <PackagePlus size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-zinc-100">Nuevo Repuesto</h2>
          <p className="text-sm text-zinc-500">Ingresá los datos técnicos y su ubicación en el taller.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        
        {/* Sección: Información General */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Nombre del Componente</label>
            <input 
              type="text"
              placeholder="Ej: Bomba de agua Ford"
              className="bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-sm text-zinc-200 outline-none focus:border-orange-500 transition-all"
              onChange={(e) => setFormData({...formData, nombre: e.target.value})}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Categoría</label>
            <select 
              className="bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-sm text-zinc-200 outline-none focus:border-orange-500"
              onChange={(e) => setFormData({...formData, categoria: e.target.value})}
            >
              <option value="">Seleccionar...</option>
              <option value="motor">Motor</option>
              <option value="frenos">Frenos</option>
              <option value="suspension">Suspensión</option>
            </select>
          </div>
        </div>

        {/* Sección: Stock y Ubicación (La parte técnica) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-zinc-950/50 rounded-2xl border border-zinc-800">
          
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Stock Inicial</label>
            <input 
              type="number"
              className="bg-zinc-900 border border-zinc-700 rounded-lg p-2.5 text-sm text-zinc-200 outline-none"
              onChange={(e) => setFormData({...formData, stock: parseInt(e.target.value)})}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Estantería</label>
            <select 
              className="bg-zinc-900 border border-zinc-700 rounded-lg p-2.5 text-sm text-zinc-200 outline-none"
              onChange={(e) => setFormData({
                ...formData, 
                ubicacion: {...formData.ubicacion, estanteria: e.target.value}
              })}
            >
              <option value="">Cualquiera</option>
              {['A', 'B', 'C', 'D'].map(letra => (
                <option key={letra} value={letra}>Estante {letra}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Cajón (1-5)</label>
            <input 
              type="number"
              min="1"
              max="5"
              className="bg-zinc-900 border border-zinc-700 rounded-lg p-2.5 text-sm text-zinc-200 outline-none"
              onChange={(e) => setFormData({
                ...formData, 
                ubicacion: {...formData.ubicacion, cajon: parseInt(e.target.value)}
              })}
            />
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="flex gap-4 pt-4">
          <button 
            type="button"
            className="flex-1 px-6 py-3 border border-zinc-800 rounded-xl text-zinc-400 hover:bg-zinc-800 transition-all font-medium"
          >
            Cancelar
          </button>
          <button 
            type="submit"
            className="flex-1 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold shadow-lg shadow-orange-500/20 transition-all flex items-center justify-center gap-2"
          >
            <Save size={18} />
            Guardar Repuesto
          </button>
        </div>

      </form>
    </div>
  )
}