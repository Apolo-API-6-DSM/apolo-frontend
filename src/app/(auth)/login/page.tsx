"use client"; 

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Image from "next/image";
import { auth } from "@/services/auth";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
        await auth.login(email, senha);
        router.push("/");
        } catch (err) {
        setError("Erro ao fazer login");
        console.error("Login error:", err);
        } finally {
        setLoading(false);
        }
    };
  
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#00163B] to-[#00308F]">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 lg:gap-24">
                    <div className="text-center md:text-left mb-8 md:mb-0">
                        <h1 className="text-2xl md:text-3xl font-bold text-white mt-4">Bem-vindo ao Sistema</h1>
                        <p className="text-white/80 mt-2">Faça login para acessar sua conta</p>
                        <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 mx-auto">
                            <Image 
                                src="/images/logo.png" 
                                alt="Logo Apolo" 
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>
                    </div>

                    <div className="bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden">
                        <div className="p-8">
                            <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">LOGIN</h2>
                            {error && (
                                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                                    {error}
                                </div>
                            )}
                            <form onSubmit={handleLogin} className="space-y-6">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                        E-mail
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        placeholder="seu@email.com"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                
                                <div>
                                    <label htmlFor="senha" className="block text-sm font-medium text-gray-700 mb-1">
                                        Senha
                                    </label>
                                    <input
                                        id="senha"
                                        type="password"
                                        placeholder="••••••••"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                        value={senha}
                                        onChange={(e) => setSenha(e.target.value)}
                                        required
                                    />
                                </div>
                                
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-gradient-to-r from-[#00163B] to-[#00308F] text-white py-3 px-4 rounded-lg font-medium hover:opacity-90 transition-opacity shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {loading ? "CARREGANDO..." : "ENTRAR"}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;