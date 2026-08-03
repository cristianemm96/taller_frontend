import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Wrench, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { ConstantesURL } from '../../constantes';
import { apiFetch } from '../../utils/api';
import { useAuthStore } from '../auth/store/useAuthStore';

export const MecanicoVista = () => {
  const queryClient = useQueryClient();
  const user = useAuthStore((state)=> state.user);
  const rawId = user?.id ?? (user as any)?.usuarioId;
  const mecanicoId = rawId ? Number(rawId) : null;

  const { data: ordenes = [], isLoading, isError } = useQuery({
    queryKey: ['ordenes', 'mecanico', mecanicoId],
    queryFn: async () => {
      const res = await apiFetch(`${ConstantesURL.ordenes}/mecanico/${mecanicoId}`, { 
        method: "GET" 
      });
      if (!res.ok) throw new Error('Error al obtener las tareas asignadas');
      
      return res.json();
    },
    enabled: !!mecanicoId && mecanicoId > 0,
  });
  

  const finalizarOrdenMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiFetch(`${ConstantesURL.ordenes}/${id}/finalizar`, {
        method: 'POST', 
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || errorData || 'Error al finalizar la orden');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ordenes'] });
      queryClient.invalidateQueries({ queryKey: ['repuestos'] });
    },
  });

  const getEstadoBadge = (estado: string) => {
    switch (estado?.toLowerCase()) {
      case 'en proceso':
        return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'finalizada':
      case 'completada':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      default:
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    }
  };

  if (isLoading) {
    return (
      <div className="text-zinc-500 p-6 text-xs font-bold font-mono uppercase tracking-widest animate-pulse">
        Cargando órdenes de trabajo en pista...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 text-center text-red-400 flex items-center justify-center gap-2 text-sm font-semibold">
        <AlertCircle size={18} /> No se pudieron obtener las tareas asignadas.
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center border-b border-zinc-800 pb-5">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Wrench className="text-amber-500" /> Mis Trabajos Asignados
          </h1>
          <p className="text-sm text-zinc-400">Órdenes de trabajo del turno actual.</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-xl text-right">
          <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-black block">
            Asignadas
          </span>
          <span className="text-lg font-bold text-white">{ordenes.length} Órdenes</span>
        </div>
      </div>

      {ordenes.map((orden: any) => {
        const esFinalizada = orden.estado?.toLowerCase() === 'finalizada';
        const estaCargandoEstaOrden = 
          finalizarOrdenMutation.isPending && 
          finalizarOrdenMutation.variables === orden.id;

        return (
          <div key={orden.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
            
            {/* Header Card */}
            <div className="flex justify-between items-center">
              <span className="text-amber-500 font-bold">OT #{orden.id}</span>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getEstadoBadge(orden.estado)}`}>
                {orden.estado}
              </span>
            </div>

            <p className="text-zinc-200 font-medium">{orden.descripcionTrabajo}</p>

            {/* Repuestos Requeridos */}
            {orden.detalles && orden.detalles.length > 0 && (
              <div className="pt-4 border-t border-zinc-800 space-y-2">
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                  Repuestos requeridos
                </p>

                {orden.detalles.map((detalle: any) => (
                  <div
                    key={detalle.id}
                    className="flex items-center justify-between text-xs bg-zinc-950/70 p-2.5 rounded-lg border border-zinc-800"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-zinc-200">
                        {detalle.repuesto?.nombreComponente ?? 'Repuesto sin nombre'}
                      </span>
                      <span className="text-[11px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 font-mono">
                        x{detalle.cantidad}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {detalle.repuesto?.cajon?.estanteria && (
                        <span className="bg-zinc-800 text-zinc-300 border border-zinc-700 font-mono font-bold text-[11px] px-2 py-0.5 rounded">
                          🏢 {detalle.repuesto.cajon.estanteria.nombre || `Est. #${detalle.repuesto.cajon.estanteria.estanteriaId}`}
                        </span>
                      )}

                      <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono font-bold text-[11px] px-2 py-0.5 rounded">
                        📍 Cajón: {detalle.repuesto?.cajon?.codigo ?? `#${detalle.repuesto?.cajonId}`}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Footer / Botón de Acción */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-zinc-500">
                {new Date(orden.fechaCreacion).toLocaleDateString()}
              </span>

              {esFinalizada ? (
                <span className="flex items-center gap-1.5 text-xs font-bold text-green-400 bg-green-500/10 border border-green-500/20 px-3 py-1.5 rounded-xl">
                  <CheckCircle2 size={16} /> Trabajo Concluido
                </span>
              ) : (
                <button
                  onClick={() => finalizarOrdenMutation.mutate(orden.id)}
                  disabled={finalizarOrdenMutation.isPending}
                  className="bg-green-600 hover:bg-green-500 disabled:bg-zinc-800 text-white font-semibold text-sm px-4 py-2 rounded-xl transition flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed"
                >
                  {estaCargandoEstaOrden ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Finalizando...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={16} />
                      <span>Finalizar Trabajo</span>
                    </>
                  )}
                </button>
              )}
            </div>

          </div>
        );
      })}
    </div>
  );
};