import type React from "react";
import { useState } from "react";

const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e?.currentTarget);
    const data = Object.fromEntries(formData);
}

export const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return (
        <div>
            <div className="flex justify-center">
                <label className="text-white text-sm font-medium mb-2 opacity-90 py-3">Iniciar sesion</label>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col justify-between h-full">
            <div className=" flex flex-col w-full min-h-[60px]">
                <label className="text-white text-sm font-medium mb-2 opacity-90 py-3">Email</label>
                <input type="email" value={email}
                    className=" px-5 rounded bg-zinc-800 min-h-[60px]"
                    onChange={(e) => {
                        setEmail(e.target.value)
                    }}
                    required
                />
            </div>
            <div className="flex flex-col w-full h-full min-h-[50px]">
                <label className="text-white text-sm font-medium mb-2 opacity-90 py-5">Password</label>
                <input type="password" value={password}
                    className="bg-zinc-800 py-5 px-5 border rounded min-h-[20px]"
                    onChange={(e) => {
                        setPassword(e.target.value)
                    }}
                    required
                />
            </div>
            <div className=" py-10 w-full items-center justify-center flex ">
                <button type="submit"  className="bg-orange-500 w-full h-15 rounded">Ingresar</button>
            </div>
        </form>
        </div>
        
    )
};

