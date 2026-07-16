import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Plus, X } from 'lucide-react';
import { FormNuevaEstanteria } from './FormNuevaEstanteria';
import { ConstantesURL } from '../../constantes';

type UbicacionProps = {
  cajonIdSeleccionado: number;
  onCajonChange: (id: number) => void; 
}

export const UbicacionComponent = ({ cajonIdSeleccionado, onCajonChange }: UbicacionProps) => {
  const [estanteriaId, setEstanteriaId] = useState<number | ''>('')
  const [mostrarModal, setMostrarModal] = useState(false)

  const { data: estanterias, isLoading: cargandoEstanterias } = useQuery({
    queryKey: ['estanterias'],
    queryFn: () => fetch(`${ConstantesURL.estanteria}`).then(res => res.json().then(data => data.elementos))
  })

  const { data: cajones, isLoading: cargandoCajones } = useQuery({
    queryKey: ['cajones', estanteriaId],
    queryFn: () => fetch(`${ConstantesURL.estanteria}/${estanteriaId}/cajones`).then(res => res.json()),
    enabled: estanteriaId !== ''
  })

  console.log(cajones)
  return (
    <div className="relative">
      <div className="grid grid-cols-2 gap-4 p-4 bg-zinc-950/40 border border-zinc-800 rounded-xl">
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">
            Estantería
          </label>
          <div className="flex gap-2">
            <select
              required
              value={estanteriaId}
              className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl p-2.5 text-sm text-zinc-200 outline-none focus:border-zinc-500 transition-colors"
              onChange={(e) => {
                const id = e.target.value ? Number(e.target.value) : ''
                setEstanteriaId(id)
                onCajonChange(0)
              }}
            >
              <option value="">{cargandoEstanterias ? 'Cargando...' : 'Seleccionar...'}</option>
              {estanterias?.map((est: { estanteriaId: number, nombre: string }) => (
                <option key={est.estanteriaId} value={est.estanteriaId}>{est.nombre}</option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setMostrarModal(true)}
              className="p-2.5 bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 hover:border-zinc-600 rounded-xl text-zinc-400 hover:text-zinc-200 transition-all flex items-center justify-center"
              title="Crear nueva estantería"
            >
              <Plus size={20} />
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">
            Cajón / Nivel
          </label>
          <select
            required
            disabled={!estanteriaId || cargandoCajones}
            value={cajonIdSeleccionado || ''}
            className="bg-zinc-800 border border-zinc-700 rounded-xl p-2.5 text-sm text-zinc-200 outline-none focus:border-zinc-500 disabled:opacity-40 w-full"
            onChange={(e) => onCajonChange(Number(e.target.value))}
          >
            <option value="">
              {!estanteriaId ? 'Elegí primero una estantería...' : cargandoCajones ? 'Cargando...' : 'Seleccionar...'}
            </option>
            {cajones?.map((cajon: { cajonId: number, codigo: string, cantidadRepuestos: number }) => {
              const tieneStock = cajon.cantidadRepuestos > 0;

              return (
                <option
                  key={cajon.cajonId}
                  value={cajon.cajonId}
                  className={tieneStock ? 'text-amber-400 bg-zinc-900' : 'text-emerald-400 bg-zinc-900'}
                >
                  {cajon.codigo} {tieneStock ? `⚠️ (Tiene ${cajon.cantidadRepuestos} repuestos)` : '🟢 (Vacío)'}
                </option>
              );
            })}
          </select>
        </div>

      </div>
      {mostrarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-6 relative animate-in fade-in zoom-in-95 duration-150">
            <button
              type="button"
              onClick={() => setMostrarModal(false)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              <X size={18} />
            </button>

            <div className="mb-4">
              <h3 className="text-sm font-bold text-zinc-200">Nueva Estantería</h3>
              <p className="text-xs text-zinc-500">Agregá un sector nuevo para organizar los repuestos.</p>
            </div>
            <FormNuevaEstanteria onSuccessClose={() => setMostrarModal(false)} />
          </div>
        </div>
      )}
    </div>
  )
}