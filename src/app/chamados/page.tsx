"use client";

import React, { useState, useEffect } from 'react';
import CardChamados from '../../components/Chamadas/CardChamados/CardChamados';
import Filtragem from '../../components/Chamadas/Filtragem/Filtragem';
import Navbar from '@/components/NavBar';
import Filtros from '../../components/Chamadas/Filtragem/Filtragem';

// Atualizada interface para corresponder ao seu modelo Prisma
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

const tamanhoPagina = 5; // Quantidade de chamados por página

// Base URL para o backend NestJS
const API_BASE_URL = 'http://localhost:3003';

const ListaChamado = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [calls, setCalls] = useState<Chamado[]>([]);
  const [allCalls, setAllCalls] = useState<Chamado[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagina, setPagina] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const totalPaginas = Math.ceil(calls.length / tamanhoPagina);
  const hasMorePages = pagina < totalPaginas;

  useEffect(() => {
    fetchChamados();
  }, []);

  const fetchChamados = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/chamados`);
      if (!response.ok) {
        throw new Error('Erro ao carregar chamados');
      }
      
      const data = await response.json();      
      console.log('Dados recebidos do backend:', data);
      if (data.length > 0) {
        console.log('Exemplo de datas no primeiro chamado:');
        console.log('data_abertura:', data[0].data_abertura);
        console.log('ultima_atualizacao:', data[0].ultima_atualizacao);
      }
      
      setAllCalls(data);
      setCalls(data);
      setError(null);
    } catch (err) {
      setError('Falha ao carregar os chamados. Por favor, tente novamente.');
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
      let filteredData: Chamado[] = [...allCalls]; // Começa com todos os chamados
      
      // Aplica cada filtro sequencialmente
      if (filters.status) {
        const normalizedStatus = filters.status.toLowerCase();
        filteredData = filteredData.filter(chamado => {
          const chamadoStatus = chamado.status?.toLowerCase() || '';
          
          // Mapeamento de status equivalentes
          const statusMap: Record<string, string[]> = {
            'aberto': ['aberto', 'em andamento'],
            'pendente': ['pendente', 'aguardando pelo suporte', 'itens pendentes'],
            'concluido': ['concluido', 'concluído', 'concluída', 'resolvido', 'fechado']
          };
          
          // Verifica se o status do chamado corresponde ao filtro
          return statusMap[normalizedStatus]?.includes(chamadoStatus) || chamadoStatus === normalizedStatus;
        });
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
      (chamado.responsavel?.toLowerCase().includes(searchLower)) ||
      (chamado.sentimento_cliente?.toLowerCase().includes(searchLower)) ||
      (chamado.tipo_importacao?.toLowerCase().includes(searchLower)) ||
      (chamado.status?.toLowerCase().includes(searchLower))
    );
    
    setCalls(searchedCalls);
    setPagina(1);
  };

  const chamadosPaginados = calls.slice((pagina - 1) * tamanhoPagina, pagina * tamanhoPagina);

  const adaptChamadoForCard = (chamado: Chamado) => {
    // Função para formatar a data em um formato legível (dd/mm/aaaa)
    const formatDate = (dateString: string | null | undefined) => {
      if (!dateString) return 'Não definida';
      
      try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Data inválida';
        
        return date.toLocaleDateString('pt-BR');
      } catch (error) {
        console.error('Erro ao formatar data:', dateString, error);
        return 'Erro na data';
      }
    };

    return {
      id: chamado.id_importado,
      status: chamado.status || 'Não definido',
      sentimento: chamado.sentimento_cliente || 'Não disponível',
      dataInicio: formatDate(chamado.data_abertura),
      dataFim: formatDate(chamado.ultima_atualizacao),
      responsavel: chamado.responsavel || 'Não atribuído',
      tipo: chamado.tipo_importacao || 'Não categorizado',
      titulo: chamado.titulo || 'Sem título',
      tipo_documento: chamado.tipo_documento || 'Sem título'
    };
  };

  return (
    <>
      <div className="p-8 bg-gray-200 min-h-screen">
        <div className="flex items-center justify-center w-full mt-14 p-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-[947px] bg-white border h-[37px] border-gray-300 rounded-md outline-none px-2"
            placeholder="Pesquisar por responsável, sentimento ou tipo..."
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button
            onClick={handleSearch}
            className="bg-blue-100 w-[46px] outline-none px-2 border-gray-300 ml-4 text-white p-2 rounded-md hover:bg-opacity-80 transition flex items-center"
          >
            <img src="/lupa.svg" alt="Pesquisar" />
          </button>
        </div>
  
        <div className="flex mt-4 space-x-8">
          {/* Componente de Filtros atualizado */}
          <Filtros onFilter={handleFilter} />
  
          <div className="w-full flex flex-col space-y-4">
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
                {/* Lista de chamados paginados */}
                {calls
                  .slice((pagina - 1) * tamanhoPagina, pagina * tamanhoPagina)
                  .map((chamado) => (
                    <CardChamados 
                      key={chamado.id} 
                      chamado={{
                        id: chamado.id_importado || chamado.id,
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
                  ))
                }
  
                {/* Paginação */}
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
                      <span className="text-gray-700 font-medium">
                        {pagina} de {totalPaginas}
                      </span>
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
              </>
            ) : (
              <p className="text-gray-500 text-center mt-4">
                Nenhum chamado encontrado com os filtros aplicados.
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ListaChamado;