"use client";

import React, { useState } from 'react';
import CardChamados from '@/Chamadas/CardChamados/CardChamados';
import Filtragem from '@/Chamadas/Filtragem/Filtragem';
import Navbar from '@/Components/NavBar';

const mockData = [
  { id: 1, status: 'aberto', sentimento: 'Sentimento Negativo', dataInicio: '2025-03-24', dataFim: '2025-03-25', responsavel: 'João', tipo: 'Suporte' },
  { id: 2, status: 'pendente', sentimento: 'Sentimento Neutro', dataInicio: '2025-03-24', dataFim: '2025-03-26', responsavel: 'Maria', tipo: 'Alteração' },
  { id: 3, status: 'concluido', sentimento: 'Sentimento Positivo', dataInicio: '2025-03-22', dataFim: '2025-03-23', responsavel: 'Pedro', tipo: 'Atualização' }
];

const ListaChamado = () => {
  const [calls, setCalls] = useState(mockData);
  const [searchTerm, setSearchTerm] = useState('');

  const handleFilter = (filters: any) => {
    const filtered = mockData.filter((chamado) => {
      return (
        (filters.status ? chamado.status === filters.status : true) &&
        (filters.responsavel ? chamado.responsavel.includes(filters.responsavel) : true) &&
        (filters.sentimento ? chamado.sentimento.includes(filters.sentimento) : true) &&
        (filters.dataInicio ? chamado.dataInicio >= filters.dataInicio : true) &&
        (filters.dataFim ? chamado.dataFim <= filters.dataFim : true)
      );
    });
    setCalls(filtered);
  };

  const handleSearch = () => {
    const searchedCalls = mockData.filter((chamado) =>
      chamado.responsavel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chamado.sentimento.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chamado.tipo.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setCalls(searchedCalls);
  };

  return (
    <>
      <Navbar />
      <div className="p-8 bg-gray-200 min-h-screen">
        <div className="flex items-center mt-14 w-[947px] bg-white p-2 border border-gray-300 rounded-md">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full outline-none px-2"
            placeholder="Pesquisar por responsável, sentimento ou tipo..." />
          <button
            onClick={handleSearch}
            className="bg-blue-100 w-[46px] text-white p-2 rounded-md hover:bg-opacity-80 transition flex items-center"
          >
            <img src="/lupa.svg" />
          </button>
        </div>

        <div className="flex mt-4 space-x-8">
          <Filtragem onFilter={handleFilter} />

          <div className="w-full">
            {calls.length > 0 ? (
              calls.map((chamado) => <CardChamados key={chamado.id} chamado={chamado} />)
            ) : (
              <p className="text-gray-500 text-center mt-4">Nenhum chamado encontrado.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ListaChamado;
