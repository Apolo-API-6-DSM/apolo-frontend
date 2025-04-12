"use client";

import React, { useState, useEffect } from 'react';
import CardChamados from '../../Components/Chamadas/CardChamados/CardChamados';
import { fetchTickets } from '../../services/service';

interface Chamado {
  id: number;
  status: string;
  sentimento_cliente: string;
  responsavel: string;
  tipo_importacao: string;
  data_abertura: string;
  ultima_atualizacao: string;
  titulo?: string;
  id_importado?: string;
  tipo_documento?: string;
}

const tamanhoPagina = 10;

const ListaChamado = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [calls, setCalls] = useState<Chamado[]>([]);
  const [allCalls, setAllCalls] = useState<Chamado[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagina, setPagina] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  const totalPaginas = Math.ceil(calls.length / tamanhoPagina);

  useEffect(() => {
    fetchChamados();
  }, []);

  const fetchChamados = async () => {
    setIsLoading(true);
    try {
      const result = await fetchTickets();
      if (result.success) {
        setAllCalls(result.data);
        setCalls(result.data);
        setError(null);
      } else {
        throw new Error(result.error);
      }
    } catch (err: any) {
      setError(err.message || 'Falha ao carregar os chamados. Por favor, tente novamente.');
      console.error('Erro ao buscar chamados:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPaginas) {
      setPagina(newPage);
    }
  };

  const handleFilter = async (filters: any) => {
    setIsLoading(true);
    try {
      let filteredData: Chamado[] = [...allCalls];

      if (filters.status) {
        filteredData = filteredData.filter(chamado =>
          chamado.status?.toLowerCase().includes(filters.status.toLowerCase())
        );
      }

      if (filters.sentimento_cliente) {
        filteredData = filteredData.filter(chamado =>
          chamado.sentimento_cliente?.toLowerCase().includes(filters.sentimento_cliente.toLowerCase())
        );
      }

      if (filters.tipo_importacao) {
        filteredData = filteredData.filter(chamado =>
          chamado.tipo_importacao?.toLowerCase().includes(filters.tipo_importacao.toLowerCase())
        );
      }

      if (filters.dataInicio || filters.dataFim) {
        filteredData = filteredData.filter(chamado => {
          let matchesFilter = true;

          if (filters.dataInicio && chamado.data_abertura) {
            const filterDate = new Date(filters.dataInicio);
            const chamadoDate = new Date(chamado.data_abertura);
            matchesFilter = matchesFilter && chamadoDate >= filterDate;
          }

          if (filters.dataFim && chamado.ultima_atualizacao) {
            const filterDate = new Date(filters.dataFim);
            const chamadoDate = new Date(chamado.ultima_atualizacao);
            matchesFilter = matchesFilter && chamadoDate <= filterDate;
          }

          return matchesFilter;
        });
      }

      if (filters.responsavel) {
        filteredData = filteredData.filter(chamado =>
          chamado.responsavel?.toLowerCase().includes(filters.responsavel.toLowerCase())
        );
      }

      setCalls(filteredData);
      setPagina(1);
      setError(null);
    } catch (err) {
      setError('Falha ao aplicar filtros. Por favor, tente novamente.');
      console.error('Erro ao filtrar chamados:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setCalls(allCalls);
      return;
    }

    const searchLower = searchTerm.toLowerCase();
    const searchedCalls = allCalls.filter((chamado) =>
      chamado.responsavel?.toLowerCase().includes(searchLower) ||
      chamado.sentimento_cliente?.toLowerCase().includes(searchLower) ||
      chamado.tipo_importacao?.toLowerCase().includes(searchLower) ||
      chamado.status?.toLowerCase().includes(searchLower) ||
      chamado.titulo?.toLowerCase().includes(searchLower)
    );

    setCalls(searchedCalls);
    setPagina(1);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Navbar */}
      <nav className="bg-navy-900 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <button className="text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="text-xl font-bold">APOLO</div>
        </div>
      </nav>

      {/* Main container */}
      <div className="container mx-auto px-4 py-6">
        {/* Search bar */}
        <div className="flex items-center mb-6">
          <div className="bg-white rounded-md flex items-center p-2 shadow-sm flex-grow mr-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="outline-none flex-grow"
              placeholder="Digite aqui o que você procura (Busca semântica)"
            />
            <button 
              className="p-1 ml-2 hover:bg-gray-100 rounded" 
              onClick={handleSearch}
              aria-label="Buscar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>

          {/* View mode toggle */}
          <div className="flex">
            <button 
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-gray-800 text-white' : 'bg-gray-200'} rounded-l`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-gray-800 text-white' : 'bg-gray-200'} rounded-r`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Chamados list */}
        {isLoading ? (
          <div className="text-center py-8">
            <p>Carregando chamados...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">
            <p>{error}</p>
            <button 
              onClick={fetchChamados}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Tentar novamente
            </button>
          </div>
        ) : calls.length > 0 ? (
          <>
            <div className="space-y-4">
              {calls
                .slice((pagina - 1) * tamanhoPagina, pagina * tamanhoPagina)
                .map((chamado) => (
                  <CardChamados 
                    key={chamado.id} 
                    chamado={{
                      id: typeof chamado.id_importado === 'string' ? parseInt(chamado.id_importado, 10) || chamado.id : chamado.id,
                      status: chamado.status,
                      sentimento: chamado.sentimento_cliente || '',
                      dataInicio: chamado.data_abertura || '',
                      dataFim: chamado.ultima_atualizacao || '',
                      responsavel: chamado.responsavel || '',
                      tipo: chamado.tipo_importacao || '',
                      tipo_documento: chamado.tipo_documento || '',
                      titulo: chamado.titulo || ''
                    }} 
                  />
                ))}
            </div>

            {/* Paginação */}
            {calls.length > tamanhoPagina && (
              <div className="flex justify-center mt-8">
                <nav className="flex items-center space-x-1">
                  <button
                    onClick={() => handlePageChange(1)}
                    className={`px-3 py-1 rounded ${pagina === 1 ? 'bg-blue-600 text-white' : 'hover:bg-gray-200'}`}
                    disabled={pagina === 1}
                  >
                    1
                  </button>
                  
                  {pagina > 3 && <span className="px-2">...</span>}
                  {pagina > 2 && (
                    <button
                      onClick={() => handlePageChange(pagina - 1)}
                      className="px-3 py-1 rounded hover:bg-gray-200"
                    >
                      {pagina - 1}
                    </button>
                  )}
                  
                  {pagina !== 1 && pagina !== totalPaginas && (
                    <button className="px-3 py-1 rounded bg-blue-600 text-white">
                      {pagina}
                    </button>
                  )}
                  
                  {pagina < totalPaginas - 1 && (
                    <button
                      onClick={() => handlePageChange(pagina + 1)}
                      className="px-3 py-1 rounded hover:bg-gray-200"
                    >
                      {pagina + 1}
                    </button>
                  )}
                  
                  {pagina < totalPaginas - 2 && <span className="px-2">...</span>}
                  {totalPaginas > 1 && (
                    <button
                      onClick={() => handlePageChange(totalPaginas)}
                      className={`px-3 py-1 rounded ${pagina === totalPaginas ? 'bg-blue-600 text-white' : 'hover:bg-gray-200'}`}
                      disabled={pagina === totalPaginas}
                    >
                      {totalPaginas}
                    </button>
                  )}

                  <button
                    onClick={() => handlePageChange(pagina + 1)}
                    disabled={pagina >= totalPaginas}
                    className="px-2 py-1 rounded hover:bg-gray-200"
                    aria-label="Próxima página"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </nav>
              </div>
            )}
          </>
        ) : (
          <p className="text-gray-500 text-center mt-4">
            Nenhum chamado encontrado com os filtros aplicados.
          </p>
        )}
      </div>
    </div>
  );
};

export default ListaChamado;
