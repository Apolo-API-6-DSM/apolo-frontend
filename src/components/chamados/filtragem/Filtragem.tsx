"use client";

import React, { useState, useEffect } from "react";

interface FilterState {
  status: string;
  dataInicio: string;
  dataFim: string;
  sentimento_cliente: string;
  tipo_importacao: string;
  responsavel: string;
}

interface FiltrosProps {
  onFilter: (filters: FilterState) => void;
  initialFilters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
}

const Filtros = ({ onFilter, initialFilters, setFilters }: FiltrosProps) => {
  const [filters, setInternalFilters] = useState(initialFilters);

  useEffect(() => {
    setInternalFilters(initialFilters);
  }, [initialFilters]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInternalFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setFilters(prev => ({ // Atualiza o estado no componente pai imediatamente
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilter(filters);
  };

  const handleReset = () => {
    const resetValues = {
      status: '',
      dataInicio: '',
      dataFim: '',
      sentimento_cliente: '',
      tipo_importacao: '',
      responsavel: ''
    };
    setInternalFilters(resetValues);
    setFilters(resetValues);
    onFilter(resetValues); // Aplica o filtro vazio para mostrar todos
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
      <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
        Filtros
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Status:</label>
          <select
            name="status"
            className="w-full p-2 border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
            onChange={handleChange}
            value={filters.status}
          >
            <option value="">Selecione status</option>
            <option value="aberto">Aberto</option>
            <option value="pendente">Pendente</option>
            <option value="concluido">Concluído</option>
          </select>
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Responsável:</label>
          <input
            type="text"
            name="responsavel"
            className="w-full p-2 border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
            onChange={handleChange}
            value={filters.responsavel}
            placeholder="Filtrar por responsável"
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Sentimento:</label>
          <input
            type="text"
            name="sentimento_cliente"
            className="w-full p-2 border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
            onChange={handleChange}
            value={filters.sentimento_cliente}
            placeholder="Filtrar por sentimento"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Data Início:</label>
            <input
              type="date"
              name="dataInicio"
              className="w-full p-2 border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
              onChange={handleChange}
              value={filters.dataInicio}
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Data Término:</label>
            <input
              type="date"
              name="dataFim"
              className="w-full p-2 border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
              onChange={handleChange}
              value={filters.dataFim}
            />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-full border border-transparent bg-[#00163B] px-4 py-2 text-sm font-medium text-white shadow-theme-xs hover:bg-[#001e4f] dark:bg-blue-700 dark:hover:bg-blue-800"
          >
            Aplicar Filtros
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
          >
            Limpar
          </button>
        </div>
      </form>
    </div>
  );
};

export default Filtros;