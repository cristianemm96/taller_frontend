import { FileDown, AlertTriangle } from 'lucide-react';

const faltantes = [
    { id: 'FRN-042', nombre: 'Pastillas de Freno Ford Focus', stock: 1, stockMinimo: 4, ubicacion: 'A-2' },
    { id: 'MTR-005', nombre: 'Aceite 10W40 (1L)', stock: 2, stockMinimo: 10, ubicacion: 'B-5' },
    { id: 'SUS-012', nombre: 'Amortiguador Delantero', stock: 0, stockMinimo: 2, ubicacion: 'C-1' },
];

export const InventoryShortage = () => {
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-zinc-100">Reposición de Stock</h2>
                    <p className="text-zinc-500 text-sm">Listado de repuestos por debajo del stock mínimo de seguridad.</p>
                </div>
                <button className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-red-900/20">
                    <FileDown size={20} />
                    Generar Orden de Compra
                </button>
            </div>
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-zinc-800/50 border-b border-zinc-800">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase">Repuesto</th>
                            <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase">Ubicación</th>
                            <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase text-center">Actual</th>
                            <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase text-center">Estado</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800">
                        {faltantes.map((item) => (
                            <tr key={item.id} className="hover:bg-zinc-800/30 transition-colors">
                                <td className="px-6 py-4 font-medium text-zinc-200">{item.nombre}</td>
                                <td className="px-6 py-4 font-mono text-xs text-zinc-500">{item.ubicacion}</td>
                                <td className="px-6 py-4 text-center font-bold text-zinc-300">{item.stock} / {item.stockMinimo}</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center justify-center gap-2 text-red-500 text-xs font-bold bg-red-500/10 py-1 px-3 rounded-full border border-red-500/20">
                                        <AlertTriangle size={14} />
                                        {item.stock === 0 ? 'AGOTADO' : 'BAJO STOCK'}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};