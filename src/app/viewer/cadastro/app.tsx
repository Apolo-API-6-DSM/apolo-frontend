"use client";

import React, { useState, useEffect } from "react";

interface Viewer {
  nome: string;
  email: string;
  senha: string;
  status: "ativo" | "inativo";
}

interface Props {
  modo: "cadastro" | "atualizacao";
  dadosIniciais?: Viewer;
  onSubmit: (viewer: Viewer) => void;
}

const FormularioViewer: React.FC<Props> = ({ modo, dadosIniciais, onSubmit }) => {
  const [viewer, setViewer] = useState<Viewer>({
    nome: "",
    email: "",
    senha: "",
    status: "ativo",
  });

  useEffect(() => {
    if (dadosIniciais && modo === "atualizacao") {
      setViewer(dadosIniciais);
    }
  }, [dadosIniciais, modo]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setViewer((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(viewer);
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">
        {modo === "cadastro" ? "Cadastrar Viewer" : "Atualizar Viewer"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="nome"
          placeholder="Nome"
          value={viewer.nome}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-md bg-white shadow"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={viewer.email}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-md bg-white shadow"
          required
        />
        <input
          type="password"
          name="senha"
          placeholder="Senha"
          value={viewer.senha}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-md bg-white shadow"
          required={modo === "cadastro"} // Só obrigatório ao cadastrar
        />
        <select
          name="status"
          value={viewer.status}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-md bg-white shadow"
        >
          <option value="ativo">Ativo</option>
          <option value="inativo">Inativo</option>
        </select>
        <button
          type="submit"
          className="w-full bg-[#00163B] text-white py-2 rounded-md hover:bg-[#00194d] transition"
        >
          {modo === "cadastro" ? "Cadastrar" : "Atualizar"}
        </button>
      </form>
    </div>
  );
};

export default FormularioViewer;
