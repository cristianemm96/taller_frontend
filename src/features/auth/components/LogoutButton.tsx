import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../store/useAuthStore';

export const LogoutButton = () => {
    const queryClient = useQueryClient();
    const logout = useAuthStore((state) => state.logout);
    const handleLogout = () => {
        queryClient.cancelQueries();
        queryClient.clear();
        logout();
        window.location.replace('/')
    };

    return (
        <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-zinc-400 hover:text-red-400 bg-zinc-900 hover:bg-red-500/10 border border-zinc-800 hover:border-red-500/20 rounded-xl transition-all duration-200"
            title="Cerrar Sesión"
        >
            <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
            </svg>
            <span>Cerrar Sesión</span>
        </button>
    );
};