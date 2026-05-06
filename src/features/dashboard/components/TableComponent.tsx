import { Eye, Pencil, Trash2 } from "lucide-react";


const componentesCoche = [
    { id: "MTR-001", nombre: "Bomba de Agua", categoria: "Motor", stock: 12, estado: "Disponible" },
    { id: "FRN-042", nombre: "Pastillas de Freno Delanteras", categoria: "Frenos", stock: 4, estado: "Crítico" },
    { id: "SUS-015", nombre: "Amortiguador Hidráulico", categoria: "Suspensión", stock: 0, estado: "Agotado" },
    { id: "MTR-009", nombre: "Correa de Distribución", categoria: "Motor", stock: 8, estado: "Disponible" },
    { id: "FRN-011", nombre: "Disco de Freno ventilado", categoria: "Frenos", stock: 6, estado: "Disponible" },
    { id: "SUS-088", nombre: "Bieleta de Barra Estabilizadora", categoria: "Suspensión", stock: 15, estado: "Disponible" },
];

export const TableComponent = () => {
    return (
        <div className="w-full">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-zinc-800 bg-zinc-900/80 text-zinc-400 text-xs uppercase tracking-widest">
                            <th className="px-6 py-4 font-bold">Referencia</th>
                            <th className="px-6 py-4 font-bold">Componente</th>
                            <th className="px-6 py-4 font-bold">Categoría</th>
                            <th className="px-6 py-4 font-bold text-center">Stock</th>
                            <th className="px-6 py-4 font-bold text-center">Ubicación</th>
                            <th className="px-6 py-4 font-bold text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/50 text-sm">
                        {componentesCoche.map((item) => (
                            <tr key={item.id} className="hover:bg-zinc-800/30 transition-colors group">
                                <td className="px-6 py-4 font-mono text-zinc-500">{item.id}</td>
                                <td className="px-6 py-4 font-medium text-white">{item.nombre}</td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 rounded-md bg-zinc-800 border border-zinc-700 text-zinc-400 text-[11px]">
                                        {item.categoria}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className={`font-bold ${item.stock === 0 ? 'text-red-500' :
                                            item.stock < 5 ? 'text-orange-500' : 'text-emerald-500'
                                        }`}>
                                        {item.stock}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span >
                                        Estante 1 | Cajon A
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-1.5 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white">
                                            <Eye size={16} />
                                        </button>
                                        <button className="p-1.5 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-orange-500">
                                            <Pencil size={16} />
                                        </button>
                                        <button className="p-1.5 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-red-500">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}