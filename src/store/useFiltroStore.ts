import { create } from 'zustand'

interface FiltroState {
  terminoBusqueda: string;
  categoriaSeleccionada: number | null; 
  
  setTerminoBusqueda: (termino: string) => void;
  setCategoriaSeleccionada: (id: number | null) => void;
  limpiarFiltros: () => void;
}

export const useFiltroStore = create<FiltroState>((set) => ({
  terminoBusqueda: '',
  categoriaSeleccionada: null,

  setTerminoBusqueda: (termino) => set({ terminoBusqueda: termino }),
  setCategoriaSeleccionada: (id) => set({ categoriaSeleccionada: id }),
  limpiarFiltros: () => set({ terminoBusqueda: '', categoriaSeleccionada: null }),
}))