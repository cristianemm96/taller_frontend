import { LoginForm } from "../features/auth/components/LoginForm"


export const LoginView = () => {
    return (
        <div className="min-h-screen flex items-center justify-center h-full">
            <div className="w-full max-w-[450px] min-h-[430px] p-8 rounded-2xl border border-zinc-800 shadow-2xl flex flex-col">
                <LoginForm />
            </div>
        </div>
    );
}