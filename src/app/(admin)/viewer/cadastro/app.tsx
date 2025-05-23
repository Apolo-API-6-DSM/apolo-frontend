"use client";

import React, { useState } from "react";

interface Usuario {
  nome: string;
  email: string;
  senha: string;
  perfil: "admin" | "viewer";
}

interface Props {
  onSubmit: (usuario: Usuario) => void;
}

const CadastroUsuario: React.FC<Props> = ({ onSubmit }) => {
  const [usuario, setUsuario] = useState<Usuario>({
    nome: "",
    email: "",
    senha: "",
    perfil: "viewer",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setUsuario((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(usuario);
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Cadastrar Usuário</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="nome"
          placeholder="Nome"
          value={usuario.nome}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-md bg-white shadow"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={usuario.email}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-md bg-white shadow"
          required
        />
        <input
          type="password"
          name="senha"
          placeholder="Senha"
          value={usuario.senha}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-md bg-white shadow"
          required
        />
        <select
          name="perfil"
          value={usuario.perfil}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-md bg-white shadow"
        >
          <option value="viewer">Viewer</option>
          <option value="admin">Admin</option>
        </select>
        <button
          type="submit"
          className="w-full bg-[#00163B] text-white py-2 rounded-md hover:bg-[#00194d] transition"
        >
          Cadastrar
        </button>
      </form>
    </div>
  );
};

export default CadastroUsuario;
