import { createFileRoute, Link, Outlet, redirect } from '@tanstack/react-router'
import { Activity, ClipboardList, LayoutDashboard, Plus, ToolCase, Users, Wrench } from 'lucide-react';
import { useState } from 'react';
import { getUserFromToken } from '../utils/auth';
import { LogoutButton } from '../features/auth/components/LogoutButton';
import { useAuthStore } from '../features/auth/store/useAuthStore';


export const Route = createFileRoute('/dashboard')({
    beforeLoad: () => {
        const token = localStorage.getItem('token')
        if (!token) {
            throw redirect({ to: '/' })
        }
    },
    component: DashBoardLayout
})

const navItems = [
    { to: '/dashboard', label: 'Repuestos', icon: LayoutDashboard, roles: ['Encargado', 'Mecanico'] },
    { to: '/dashboard/AddFormComponent', label: 'Agregar Repuesto', icon: Plus, roles: ['Encargado'] },
    { to: '/dashboard/InventoryShortage', label: 'Lista de faltantes', icon: ClipboardList, roles: ['Encargado', 'mecanico'] },
    { to: '/dashboard/UsersManagement', label: 'Gestión de usuarios', icon: Users, roles: ['Encargado'] },
    { to: '/dashboard/Orders', label: 'Ordenes', icon: ToolCase, roles: ['Encargado'] },
    { to: '/dashboard/ActivityLogs', label: 'Movimientos', icon: Activity, roles: ['Encargado'] },
    { to: '/dashboard/MecanicoOrdenes', label: 'Trabajos', icon: Wrench, roles: ['Encargado', "Mecanico"] },
];

function DashBoardLayout() {

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const user = getUserFromToken();
    const userRoles = user?.roles || [];
    console.log(userRoles)
    const userStore = useAuthStore((state) => state.user);
    const userToken = getUserFromToken();
    const currentUser = userStore || userToken;

    const nombreMostrar = currentUser?.nombre || currentUser?.username || 'Usuario';

    return (<div className='flex h-screen overflow-hidden'>
        {isMenuOpen && <div
            className="fixed inset-0 bg-black/60 z-40 md:hidden"
            onClick={() => setIsMenuOpen(false)}
        />}
        <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-zinc-900 border-r border-zinc-800 transition-transform duration-300
        ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:relative md:translate-x-0 shrink-0 flex flex-col
      `}>
            <div className="h-16 flex items-center px-6 border-b border-zinc-800">
                <span className="text-red-600 font-black tracking-tighter italic text-xl">RT STOCK</span>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                {navItems
                    .filter(item => item.roles.some(rol => userRoles.includes(rol)))
                    .map((item) => (
                        <Link
                            key={item.to}
                            to={item.to}
                            className="flex items-center gap-3 p-3 hover:bg-zinc-800 rounded-lg group transition-all"
                            activeProps={{ className: 'bg-zinc-800 text-red-500' }}
                        >
                            <item.icon size={20} className="text-zinc-500 group-hover:text-red-500 transition-colors" />
                            <span className="text-sm font-medium">{item.label}</span>
                        </Link>
                    ))}
            </nav>
            <div className="p-4 border-t border-zinc-800">
                <LogoutButton />
            </div>
        </aside>

        <div className="flex flex-col flex-1 min-w-0">
            <header className="h-16 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between px-4 md:px-8 shrink-0">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setIsMenuOpen(true)}
                        className="p-2 hover:bg-zinc-800 rounded-lg md:hidden"
                    >
                        <span className="text-2xl">☰</span>
                    </button>
                    <h1 className="text-sm font-medium text-zinc-400 md:text-base">Panel de Control</h1>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden sm:block text-right mr-2">
                        <p className="text-xs text-zinc-500">Técnico</p>
                        <p className="text-sm font-bold">{nombreMostrar}</p>
                    </div>
                    <div className="w-10 h-10 bg-zinc-800 border border-zinc-700 rounded-full flex items-center justify-center">
                        🛠️
                    </div>
                </div>
            </header>

            <main className="flex-1 p-6 md:p-8 overflow-y-auto">
                <Outlet />
            </main>

        </div>
    </div>)
}
