"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const Login = () => {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const router = useRouter();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Login enviado:", { email, senha });
        // Redireciona para a rota home após o login
        router.push("/home");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#00163B]">
            <div className="flex flex-col md:flex-row items-center justify-between gap-10 px-6 py-12">
                <div className="text-center md:text-left">
                    <img 
                        src="/assets/logo.png" 
                        className="w-80 max-w-full" 
                        alt="Logo Apolo" 
                    />
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-white/[0.03] lg:p-10 w-full max-w-[531px]">
                    <h2 className="text-center text-xl font-semibold text-gray-800 dark:text-white/90 mb-6">
                        LOGIN
                    </h2>
                    <form onSubmit={handleLogin} className="space-y-5">
                        <div>
                            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                placeholder="Digite seu email"
                                className="w-full p-3 border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        
                        <div>
                            <label htmlFor="senha" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                Senha
                            </label>
                            <input
                                id="senha"
                                type="password"
                                placeholder="Digite sua senha"
                                className="w-full p-3 border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                required
                            />
                        </div>

                        <div className="flex justify-center pt-2">
                            <button
                                type="submit"
                                className="inline-flex items-center justify-center gap-2 rounded-full border border-transparent bg-[#00163B] px-6 py-3 text-sm font-medium text-white shadow-theme-xs hover:bg-[#001e4f] dark:bg-blue-700 dark:hover:bg-blue-800"
                            >
                                ENTRAR
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;