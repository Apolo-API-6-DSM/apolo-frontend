"use client";

import React, { useState } from "react";

const Filtros = ({ onFilter }: { onFilter: (filters: any) => void }) => {
  const [filters, setFilters] = useState({
    status: '',
    dataInicio: '',
    dataFim: '',
    sentimento_cliente: '',
    tipo_importacao: '',
    responsavel: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilter(filters);
  };

  const handleReset = () => {
    setFilters({
      status: '',
      dataInicio: '',
      dataFim: '',
      sentimento_cliente: '',
      tipo_importacao: '',
      responsavel: ''
    });
    onFilter({});
  };

  return (
    <form onSubmit={handleSubmit}>

      <div className="p-6 bg-gray-200 rounded-md w-80 shadow-md border border-gray-300">
        <h3 className="text-lg text-center font-bold mb-4 text-primary">FILTROS</h3>
        
          <div className="mb-4">
            <label className="block text-sm font-semibold text-primary mb-1">Status:</label>
            <select
              name="status"
              className="w-full p-2 border border-gray-300 rounded-md bg-white"
              onChange={handleChange}
              value={filters.status}
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
              type="text"
              name="responsavel"
              className="w-full p-2 border border-gray-300 rounded-md bg-white"
              onChange={handleChange}
              value={filters.responsavel}
              placeholder="Filtrar por responsável"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-primary mb-1">Sentimento:</label>
            <input
              type="text"
              name="sentimento_cliente"
              className="w-full p-2 border border-gray-300 rounded-md bg-white"
              onChange={handleChange}
              value={filters.sentimento_cliente}
              placeholder="Filtrar por sentimento"
            />
          </div>

          <div className="flex gap-2">
            <div className="w-1/2">
              <label className="block text-sm font-semibold text-primary mb-1">Data Início:</label>
              <input
                type="date"
                name="dataInicio"
                className="w-full p-2 border border-gray-300 rounded-md bg-white"
                onChange={handleChange}
                value={filters.dataInicio}
              />
            </div>

            <div className="w-1/2">
              <label className="block text-sm font-semibold text-primary mb-1">Data Término:</label>
              <input
                type="date"
                name="dataFim"
                className="w-full p-2 border border-gray-300 rounded-md bg-white"
                onChange={handleChange}
                value={filters.dataFim}
              />
            </div>
          </div>
          <br></br>
          <div className="flex space-x-2">
            <button 
              type="submit"
              className="flex-1 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
            >
              Aplicar Filtros
            </button>
            <button 
              type="button"
              onClick={handleReset}
              className="flex-1 bg-gray-500 text-white py-2 rounded-md hover:bg-gray-600 transition"
            >
              Limpar
            </button>
          </div>
        </div>
      </form>
  );
};

export default Filtros;