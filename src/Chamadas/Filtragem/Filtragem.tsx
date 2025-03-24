import React, { useState } from 'react';

const Filtragem = ({ onFilter }: { onFilter: (filters: any) => void }) => {
  const [filters, setFilters] = useState({
    status: '',
    responsavel: '',
    sentimento: '',
    dataInicio: '',
    dataFim: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onFilter(filters);
  };

  return (
    <div className="p-4 bg-filterBackground rounded-md w-80">
      <h3 className="text-lg font-bold mb-4 text-primary">FILTROS</h3>

      <label className="block mb-2 text-primary">Status:</label>
      <select
        name="status"
        className="w-full p-2 border border-gray-300 rounded"
        onChange={handleChange}
      >
        <option value="">Selecione status</option>
        <option value="aberto">Aberto</option>
        <option value="pendente">Pendente</option>
        <option value="concluido">Concluído</option>
      </select>

      <label className="block my-2 text-primary">Responsável:</label>
      <input
        name="responsavel"
        type="text"
        className="w-full p-2 border border-gray-300 rounded"
        onChange={handleChange}
      />

      <label className="block my-2 text-primary">Sentimento:</label>
      <input
        name="sentimento"
        type="text"
        className="w-full p-2 border border-gray-300 rounded"
        onChange={handleChange}
      />

      <label className="block my-2 text-primary">Data Início:</label>
      <input
        name="dataInicio"
        type="date"
        className="w-full p-2 border border-gray-300 rounded"
        onChange={handleChange}
      />

      <label className="block my-2 text-primary">Data Fim:</label>
      <input
        name="dataFim"
        type="date"
        className="w-full p-2 border border-gray-300 rounded"
        onChange={handleChange}
      />

      <button
        className="w-full mt-4 p-2 bg-primary text-white rounded hover:bg-opacity-90"
        onClick={handleSubmit}
      >
        Filtrar
      </button>
    </div>
  );
};

export default Filtragem;
