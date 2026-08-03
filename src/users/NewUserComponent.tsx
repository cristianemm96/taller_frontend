import React, { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { UserPlus, Eye, EyeOff, Loader2 } from 'lucide-react'
import { ConstantesURL } from '../constantes'
import type { Rol } from '../types/rol'
import { apiFetch } from '../utils/api'

export const NewUserComponent = ({ onClose }: { onClose: () => void }) => {
    const queryClient = useQueryClient()

    // Estados del Formulario
    const [nombre, setNombre] = useState('')
    const [telefono, setTelefono] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [rolId, setRolId] = useState<string | number>('')
    const [showPassword, setShowPassword] = useState(false)

    const { data: roles } = useQuery<Rol[]>({
        queryKey: ['roles'],
        queryFn: async () => {
            const res = await apiFetch(`${ConstantesURL.rol}`,
                {method:"GET"}
            )
            if (!res.ok) throw new Error('Error al traer roles')
            const resultado = await res.json()
            return resultado.elementos || resultado
        }
    })

    const crearUsuarioMutation = useMutation({
        mutationFn: async (nuevoUsuario: any) => {
            const res = await apiFetch(`${ConstantesURL.usuarios}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(nuevoUsuario)
            })
            if (!res.ok) {
                const errorData = await res.json()
                throw new Error(errorData.message || 'Error al registrar al mecánico')
            }
            return res.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['usuarios'] })
            onClose()
        },
        onError: (error: any) => {
            alert(`🚨 Error al registrar: ${error.message}`)
        }
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!nombre.trim() || !email.trim() || !password.trim()) return

        const payload = {
            nombre,
            email,
            telefono,
            password, 
            rolId,
            estado: 'activo' 
        }

        crearUsuarioMutation.mutate(payload)
    }

    return (
        <div className="max-w-md mx-auto space-y-6">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-6">
                <div>
                    <h2 className="text-lg font-black uppercase tracking-wider text-zinc-100 flex items-center gap-2">
                        <UserPlus className="text-orange-500" size={20} /> Registrar Mecánico
                    </h2>
                    <p className="text-[11px] text-zinc-500 uppercase tracking-widest mt-1">
                        Crea las credenciales de acceso para el personal.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-black tracking-widest text-zinc-400">Nombre Completo</label>
                        <input
                            type="text"
                            required
                            placeholder="Ej: Juan Gómez"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            className="w-full bg-zinc-950 border border-zinc-850 focus:border-zinc-700 outline-none rounded-xl px-4 py-2.5 text-xs text-zinc-100"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-black tracking-widest text-zinc-400">Telefono</label>
                        <input
                            type="text"
                            required
                            placeholder="Ej: 1122334488"
                            value={telefono}
                            onChange={(e) => setTelefono(e.target.value)}
                            className="w-full bg-zinc-950 border border-zinc-850 focus:border-zinc-700 outline-none rounded-xl px-4 py-2.5 text-xs text-zinc-100"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-black tracking-widest text-zinc-400">Correo Electrónico</label>
                        <input
                            type="email"
                            required
                            placeholder="juan.gomez@boxes.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-zinc-950 border border-zinc-850 focus:border-zinc-700 outline-none rounded-xl px-4 py-2.5 text-xs text-zinc-100"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-black tracking-widest text-zinc-400">Contraseña de Acceso</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                required
                                placeholder="Asigná una clave segura"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-zinc-950 border border-zinc-850 focus:border-zinc-700 outline-none rounded-xl pl-4 pr-10 py-2.5 text-xs text-zinc-100"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    {/* Rol (Select Estilizado) */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-black tracking-widest text-zinc-400">
                            Rol de Sistema
                        </label>
                        <select
                            required
                            value={rolId}
                            onChange={(e) => setRolId(e.target.value)}
                            className="w-full bg-zinc-950 border border-zinc-850 focus:border-zinc-700 outline-none rounded-xl px-4 py-2.5 text-xs text-zinc-100 font-bold uppercase tracking-wider cursor-pointer"
                        >
                            <option value="" disabled>Seleccioná un rol...</option>
                            {roles?.map((rol) => (
                                <option key={rol.rolId} value={rol.rolId}>
                                    {rol.nombre}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Botonera */}
                    <div className="pt-4 border-t border-zinc-800 flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-zinc-800 hover:bg-zinc-700 text-zinc-400 text-[10px] font-black uppercase tracking-widest px-4 py-2.5 rounded-xl transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={crearUsuarioMutation.isPending}
                            className="bg-orange-500 hover:bg-orange-400 text-white text-[10px] font-black uppercase tracking-widest px-5 py-2.5 rounded-xl shadow-lg transition-all disabled:opacity-50 flex items-center gap-2"
                        >
                            {crearUsuarioMutation.isPending ? (
                                <>
                                    <Loader2 className="animate-spin" size={14} /> Creando...
                                </>
                            ) : (
                                'Dar de Alta'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}