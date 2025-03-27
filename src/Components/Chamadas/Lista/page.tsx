"use client";

import React, { useState } from 'react';
import CardChamados from '../CardChamados/CardChamados';
import Filtragem from '../Filtragem/Filtragem';
import Navbar from '@/Components/NavBar';

const mockData = [
  { id: 1, status: 'aberto', sentimento: 'Sentimento Negativo', dataInicio: '2025-03-24', dataFim: '2025-03-25', responsavel: 'João', tipo: 'Suporte' },
  { id: 2, status: 'pendente', sentimento: 'Sentimento Neutro', dataInicio: '2025-03-24', dataFim: '2025-03-26', responsavel: 'Maria', tipo: 'Alteração' },
  { id: 3, status: 'concluido', sentimento: 'Sentimento Positivo', dataInicio: '2025-03-22', dataFim: '2025-03-23', responsavel: 'Pedro', tipo: 'Atualização' },
  { id: 4, status: 'pendente', sentimento: 'Sentimento Negativo', dataInicio: '2025-03-21', dataFim: '2025-03-22', responsavel: 'Ana', tipo: 'Correção' },
  { id: 5, status: 'aberto', sentimento: 'Sentimento Neutro', dataInicio: '2025-03-20', dataFim: '2025-03-21', responsavel: 'Carlos', tipo: 'Suporte' },
  { id: 6, status: 'pendente', sentimento: 'Sentimento Negativo', dataInicio: '2025-03-20', dataFim: '2025-03-21', responsavel: 'Nicole', tipo: 'Alteração' },
  { id: 7, status: 'pendente', sentimento: 'Sentimento Neutro', dataInicio: '2025-03-24', dataFim: '2025-03-26', responsavel: 'Melissa', tipo: 'Alteração' },
  { id: 8, status: 'concluido', sentimento: 'Sentimento Positivo', dataInicio: '2025-03-22', dataFim: '2025-03-23', responsavel: 'Carolina', tipo: 'Atualização' },
  { id: 9, status: 'pendente', sentimento: 'Sentimento Negativo', dataInicio: '2025-03-21', dataFim: '2025-03-22', responsavel: 'David', tipo: 'Correção' },
  { id: 10, status: 'aberto', sentimento: 'Sentimento Neutro', dataInicio: '2025-03-20', dataFim: '2025-03-21', responsavel: 'Paulo', tipo: 'Suporte' },
  { id: 11, status: 'aberto', sentimento: 'Sentimento Neutro', dataInicio: '2025-03-20', dataFim: '2025-03-21', responsavel: 'Carlos', tipo: 'Suporte' },
  { id: 12, status: 'pendente', sentimento: 'Sentimento Negativo', dataInicio: '2025-03-20', dataFim: '2025-03-21', responsavel: 'Nicole', tipo: 'Alteração' },
  { id: 13, status: 'pendente', sentimento: 'Sentimento Neutro', dataInicio: '2025-03-24', dataFim: '2025-03-26', responsavel: 'Melissa', tipo: 'Alteração' },
  { id: 14, status: 'concluido', sentimento: 'Sentimento Positivo', dataInicio: '2025-03-22', dataFim: '2025-03-23', responsavel: 'Carolina', tipo: 'Atualização' },
  { id: 15, status: 'pendente', sentimento: 'Sentimento Negativo', dataInicio: '2025-03-21', dataFim: '2025-03-22', responsavel: 'David', tipo: 'Correção' },
];

const tamanhoPagina = 5; // Quantidade de chamados por página

const ListaChamado = () => {
  const [calls, setCalls] = useState(mockData);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagina, setPagina] = useState(1);

  const totalPaginas = Math.ceil(calls.length / tamanhoPagina);
  const hasMorePages = pagina < totalPaginas;

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPaginas) {
      setPagina(newPage);
    }
  };

  const handleFilter = (filters: any) => {
    const filtered = mockData.filter((chamado) => (
      (filters.status ? chamado.status === filters.status : true) &&
      (filters.responsavel ? chamado.responsavel.includes(filters.responsavel) : true) &&
      (filters.sentimento ? chamado.sentimento.includes(filters.sentimento) : true) &&
      (filters.dataInicio ? chamado.dataInicio >= filters.dataInicio : true) &&
      (filters.dataFim ? chamado.dataFim <= filters.dataFim : true)
    ));
    setCalls(filtered);
    setPagina(1);
  };

  const handleSearch = () => {
    const searchedCalls = mockData.filter((chamado) =>
      chamado.responsavel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chamado.sentimento.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chamado.tipo.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setCalls(searchedCalls);
    setPagina(1);
  };

  const chamadosPaginados = calls.slice((pagina - 1) * tamanhoPagina, pagina * tamanhoPagina);

  return (
    <>
      <Navbar />
      <div className="p-8 bg-gray-200 min-h-screen">
      <div className="flex items-center justify-center w-full mt-14 p-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-[947px] bg-white border h-[37px] border-gray-300 rounded-md outline-none px-2"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-100 w-[46px] outline-none px-2 border-gray-300 ml-4 text-white p-2 rounded-md hover:bg-opacity-80 transition flex items-center"
          >
            <img src="/lupa.svg" />
          </button>
        </div>

        <div className="flex mt-4 space-x-8">
          <Filtragem onFilter={handleFilter} />

          <div className="w-full flex flex-col space-y-4">
            {chamadosPaginados.length > 0 ? (
              chamadosPaginados.map((chamado) => (
                <CardChamados key={chamado.id} chamado={chamado} />
              ))
            ) : (
              <p className="text-gray-500 text-center mt-4">Nenhum chamado encontrado.</p>
            )}

            {calls.length > tamanhoPagina && (
              <div className="flex justify-end mt-4">
                <div className="bg-white px-4 py-2 rounded-md shadow-md flex gap-2 items-center">
                  <button
                    onClick={() => handlePageChange(pagina - 1)}
                    disabled={pagina <= 1}
                    className={`px-3 py-1 rounded-md ${pagina <= 1 ? "text-gray-400 cursor-not-allowed" : "text-blue-500 hover:bg-blue-100"}`}
                  >
                    Anterior
                  </button>
                  <span className="text-gray-700 font-medium">{pagina} de {totalPaginas}</span>
                  <button
                    onClick={() => handlePageChange(pagina + 1)}
                    disabled={!hasMorePages}
                    className={`px-3 py-1 rounded-md ${!hasMorePages ? "text-gray-400 cursor-not-allowed" : "text-blue-500 hover:bg-blue-100"}`}
                  >
                    Próximo
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ListaChamado;
