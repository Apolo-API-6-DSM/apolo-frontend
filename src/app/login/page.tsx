"use client";

import React, { useState } from "react";

const Login = () => {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Login enviado:", { email, senha });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#00163B]">
            <div className="flex flex-col md:flex-row items-center justify-between gap-10 px-6 py-12">
                <div className="text-center md:text-left">
                    <img src="/assets/logo.png" className="w-96" alt="Logo Apolo" />
                </div>

                <div className="bg-gray-200 w-[531px] rounded-lg shadow-md p-8">
                    <h2 className="text-center text-xl font-bold mb-6">LOGIN</h2>
                    <form onSubmit={handleLogin} className="flex flex-col items-center space-y-4">
                        <input
                            type="email"
                            placeholder="email"
                            className="w-[464px] p-2 border border-gray-300 rounded-md bg-white shadow"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="senha"
                            className="w-[464px] p-2 border border-gray-300 rounded-md bg-white shadow"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            required
                        />
                        <button
                            type="submit"
                            className="w-[179px] bg-[#00163B] text-white py-2 rounded-md hover:bg-[#00194d] transition"
                        >
                            ENTRAR
                        </button>
                    </form>
                </div>

            </div>
        </div>
    );
};

export default Login;
