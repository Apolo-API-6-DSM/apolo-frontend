"use client";

import React, { useState } from "react";

const Filtragem = ({ onFilter }: { onFilter: (filters: any) => void }) => {
  const [filters, setFilters] = useState({
    status: "",
    responsavel: "",
    sentimento: "",
    dataInicio: "",
    dataFim: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onFilter(filters);
  };

  return (
    <div className="p-6 bg-gray-200 h-[481px] rounded-md w-80 shadow-md border border-gray-300">
      <h3 className="text-lg text-center font-bold mb-4 text-primary">FILTROS</h3>
      <div className="mb-4">
        <label className="block text-sm font-semibold text-primary mb-1">Status:</label>
        <select
          name="status"
          className="w-full p-2 border border-gray-300 rounded-md bg-white"
          onChange={handleChange}
        >
          <option value="">Selecione status</option>
          <option value="aberto">Aberto</option>
          <option value="pendente">Pendente</option>
          <option value="concluido">Concluído</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-semibold text-primary mb-1">Responsável:</label>
        <input
          name="responsavel"
          type="text"
          className="w-full bg-white p-2 border border-gray-300 rounded-md"
          placeholder="Escreva nome do responsável..."
          onChange={handleChange}
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-semibold text-primary mb-1">Sentimento:</label>
        <input
          name="sentimento"
          type="text"
          className="w-full bg-white p-2 border border-gray-300 rounded-md"
          placeholder="Escreva o sentimento..."
          onChange={handleChange}
        />
      </div>
      <div className="flex gap-2">
        <div className="w-1/2">
          <label className="block text-sm font-semibold text-primary mb-1">Data Início:</label>
          <input
            name="dataInicio"
            type="date"
            className="w-full bg-white p-2 border border-gray-300 rounded-md"
            onChange={handleChange}
          />
        </div>
        <div className="w-1/2">
          <label className="block text-sm font-semibold text-primary mb-1">Data Fim:</label>
          <input
            name="dataFim"
            type="date"
            className="w-full bg-white p-2 border border-gray-300 rounded-md"
            onChange={handleChange}
          />
        </div>
      </div>
      <button
        className="w-full mt-4 p-2 bg-blue-950 text-white rounded-[10px] hover:bg-opacity-90 transition"
        onClick={handleSubmit}
      >
        FILTRAR
      </button>
    </div>
  );
};

export default Filtragem;
