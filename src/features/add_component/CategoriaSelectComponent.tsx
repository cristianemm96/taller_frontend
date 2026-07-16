import { useQuery } from '@tanstack/react-query'
import { ConstantesURL } from '../../constantes'

interface CategoriaSelectProps {
  categoriaIdSeleccionada: number | ''
  onCategoriaChange: (id: number) => void
}

export const CategoriaSelectComponent = ({ 
  categoriaIdSeleccionada, 
  onCategoriaChange 
}: CategoriaSelectProps) => {
  const { data: categorias, isLoading: cargandoCategorias } = useQuery({
    queryKey: ['categorias'],
    queryFn: () => fetch(`${ConstantesURL.categoria}`)
                    .then(res => res.json())
                    .then(data => data.elementos)
  })

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">
        Categoría
      </label>
      <select
        required
        value={categoriaIdSeleccionada}
        className="bg-zinc-800 border border-zinc-700 rounded-xl p-2.5 text-sm text-zinc-200 outline-none focus:border-zinc-500 transition-colors w-full"
        onChange={(e) => onCategoriaChange(Number(e.target.value))}
      >
        <option value="">
          {cargandoCategorias ? 'Cargando categorías...' : 'Seleccionar...'}
        </option>
        {categorias?.map((cat: { categoriaId: number, nombreCategoria: string }) => (
          <option key={cat.categoriaId} value={cat.categoriaId}>
            {cat.nombreCategoria}
          </option>
        ))}
      </select>
    </div>
  )
}