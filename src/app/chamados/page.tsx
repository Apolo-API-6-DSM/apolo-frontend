"use client";

import React, { useState, useEffect, useRef } from 'react';
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

interface FilterState {
  status: string;
  sentimento_cliente: string;
  tipo_importacao: string;
  responsavel: string;
  dataInicio: string;
  dataFim: string;
}

const tamanhoPagina = 10;

const ListaChamado = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [calls, setCalls] = useState<Chamado[]>([]);
  const [allCalls, setAllCalls] = useState<Chamado[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagina, setPagina] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  
  // Estado para armazenar as opções únicas para os selects
  const [statusOptions, setStatusOptions] = useState<string[]>([]);
  const [sentimentoOptions, setSentimentoOptions] = useState<string[]>([]);
  const [tipoOptions, setTipoOptions] = useState<string[]>([]);
  
  const [filters, setFilters] = useState<FilterState>({
    status: '',
    sentimento_cliente: '',
    tipo_importacao: '',
    responsavel: '',
    dataInicio: '',
    dataFim: '',
  });

  const totalPaginas = Math.ceil(calls.length / tamanhoPagina);

  useEffect(() => {
    fetchChamados();

    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setShowFilterDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Extrair opções únicas dos dados carregados
  useEffect(() => {
    if (allCalls.length > 0) {
      // Extrair valores únicos para status
      const uniqueStatus = Array.from(new Set(
        allCalls.map(call => call.status).filter(Boolean)
      )).sort();
      setStatusOptions(uniqueStatus);
      
      // Extrair valores únicos para sentimento
      const uniqueSentimentos = Array.from(new Set(
        allCalls.map(call => call.sentimento_cliente).filter(Boolean)
      )).sort();
      setSentimentoOptions(uniqueSentimentos);
      
      // Extrair valores únicos para tipo
      const uniqueTipos = Array.from(new Set(
        allCalls.map(call => call.tipo_importacao).filter(Boolean)
      )).sort();
      setTipoOptions(uniqueTipos);
    }
  }, [allCalls]);

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

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value
    }));
  };

  const applyFilters = () => {
    handleFilter(filters);
    setShowFilterDropdown(false);
  };

  const clearFilters = () => {
    setFilters({
      status: '',
      sentimento_cliente: '',
      tipo_importacao: '',
      responsavel: '',
      dataInicio: '',
      dataFim: '',
    });
    setCalls(allCalls);
    setShowFilterDropdown(false);
  };

  const handleFilter = async (filters: FilterState) => {
    setIsLoading(true);
    try {
      let filteredData: Chamado[] = [...allCalls];

      if (filters.status) {
        filteredData = filteredData.filter(chamado =>
          chamado.status?.toLowerCase() === filters.status.toLowerCase()
        );
      }

      if (filters.sentimento_cliente) {
        filteredData = filteredData.filter(chamado =>
          chamado.sentimento_cliente?.toLowerCase() === filters.sentimento_cliente.toLowerCase()
        );
      }

      if (filters.tipo_importacao) {
        filteredData = filteredData.filter(chamado =>
          chamado.tipo_importacao?.toLowerCase() === filters.tipo_importacao.toLowerCase()
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
        {/* Search bar and Filter button */}
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

          {/* Filter Dropdown */}
          <div className="relative" ref={filterRef}>
            <button 
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className="p-2 bg-gray-200 hover:bg-gray-300 rounded flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filtros
            </button>
            
            {showFilterDropdown && (
              <div className="absolute right-0 mt-2 bg-white rounded-md shadow-lg w-64 z-10 p-4" onClick={(e) => e.stopPropagation()}>
                <h3 className="font-semibold text-gray-800 mb-3">Filtrar por:</h3>
                
                {/* Status Select */}
                <div className="mb-3">
                  <label className="block text-sm text-gray-600 mb-1">Status:</label>
                  <select
                    name="status"
                    value={filters.status}
                    onChange={handleFilterChange}
                    className="w-full p-2 border rounded"
                  >
                    <option value="">Todos os status</option>
                    {statusOptions.map((option, index) => (
                      <option key={index} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
                
                {/* Sentimento Select */}
                <div className="mb-3">
                  <label className="block text-sm text-gray-600 mb-1">Sentimento:</label>
                  <select
                    name="sentimento_cliente"
                    value={filters.sentimento_cliente}
                    onChange={handleFilterChange}
                    className="w-full p-2 border rounded"
                  >
                    <option value="">Todos os sentimentos</option>
                    {sentimentoOptions.map((option, index) => (
                      <option key={index} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
                
                {/* Tipo Select */}
                <div className="mb-3">
                  <label className="block text-sm text-gray-600 mb-1">Tipo:</label>
                  <select
                    name="tipo_importacao"
                    value={filters.tipo_importacao}
                    onChange={handleFilterChange}
                    className="w-full p-2 border rounded"
                  >
                    <option value="">Todos os tipos</option>
                    {tipoOptions.map((option, index) => (
                      <option key={index} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
                
                {/* Responsável Input (mantido como texto) */}
                <div className="mb-3">
                  <label className="block text-sm text-gray-600 mb-1">Responsável:</label>
                  <input
                    type="text"
                    name="responsavel"
                    value={filters.responsavel}
                    onChange={handleFilterChange}
                    className="w-full p-2 border rounded"
                    placeholder="Digite o responsável"
                  />
                </div>
                
                {/* Data Início */}
                <div className="mb-3">
                  <label className="block text-sm text-gray-600 mb-1">Data Início:</label>
                  <input
                    type="date"
                    name="dataInicio"
                    value={filters.dataInicio}
                    onChange={handleFilterChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                
                {/* Data Fim */}
                <div className="mb-4">
                  <label className="block text-sm text-gray-600 mb-1">Data Fim:</label>
                  <input
                    type="date"
                    name="dataFim"
                    value={filters.dataFim}
                    onChange={handleFilterChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                
                {/* Botões de ação */}
                <div className="flex justify-between">
                  <button 
                    onClick={clearFilters}
                    className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded"
                  >
                    Limpar
                  </button>
                  <button 
                    onClick={applyFilters}
                    className="px-3 py-1 bg-blue-600 text-white hover:bg-blue-700 rounded"
                  >
                    Aplicar
                  </button>
                </div>
              </div>
            )}
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