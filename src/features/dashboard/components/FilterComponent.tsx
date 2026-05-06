import { ChevronDown, Search, SlidersHorizontal } from "lucide-react"
import { useState } from "react";

export const FilterComponent = () => {
  const [showFilters, setShowFilters] = useState(false);
  return (
    <div className="w-full px-4 sm:px-6">
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 -translate-y-1/2 left-3 text-zinc-500" size={18} />
          <input
            type="text"
            placeholder="Buscar..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-3 pl-10 pr-4 text-sm outline-none focus:border-orange-500"
          />
        </div>
        <div className="relative">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center justify-center gap-2 py-3 px-4 rounded-lg border w-full md:w-44 transition-all
          ${showFilters ? 'bg-orange-500 border-orange-400 text-white' : 'bg-zinc-900 border-zinc-800 text-zinc-400'}`}
          >
            <SlidersHorizontal size={18} />
            <span className="text-sm font-bold">Filtros</span>
            <ChevronDown size={16} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
          {showFilters && (
            <div className="absolute top-full right-0 left-0 md:left-auto md:w-64 z-50 mt-2 bg-zinc-900 border border-zinc-800 rounded-xl p-4 shadow-2xl">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-center md:text-left">
                  Categoría
                </label>
                <select className="w-full bg-zinc-800 border border-zinc-700 rounded-md p-2.5 text-sm text-zinc-200 outline-none">
                  <option value="">Todas</option>
                  <option value="motor">Motor</option>
                  <option value="frenos">Frenos</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}