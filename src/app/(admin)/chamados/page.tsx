"use client";

import React, { useState, useEffect } from 'react';
import CardChamados from '@/components/chamados/cardChamados/CardChamados';
import Filtragem from '@/components/chamados/filtragem/Filtragem';
import Filtros from '@/components/chamados/filtragem/Filtragem';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useModal } from '@/hooks/useModal'; // Importe o hook useModal
import { Modal } from '@/components/ui/modal'; // Importe o componente Modal
import Button from '@/components/ui/button/Button'; // Importe o componente Button (se estiver usando)
import { ListBulletIcon, Squares2X2Icon } from '@heroicons/react/24/outline';
import { fetchTicketByNomeArquivoId, fetchTickets } from '@/services/service';


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

interface FilterState {
  status: string;
  dataInicio: string;
  dataFim: string;
  sentimento_cliente: string;
  tipo_importacao: string;
  responsavel: string;
}

const tamanhoPagina = 5; // Quantidade de chamados por página

// Base URL para o backend NestJS
const API_BASE_URL = 'http://localhost:3003';

const ListaChamado = () => {
  const searchParams = useSearchParams();
  const nomeArquivoId = searchParams.get('nomeArquivoId');
  
    const [filterValues, setFilterValues] = useState<FilterState>({ // Estado dentro do componente
      status: '',
      dataInicio: '',
      dataFim: '',
      sentimento_cliente: '',
      tipo_importacao: '',
      responsavel: ''
    });
  const [isLoading, setIsLoading] = useState(true);
  const [calls, setCalls] = useState<Chamado[]>([]);
  const [allCalls, setAllCalls] = useState<Chamado[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagina, setPagina] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const totalPaginas = Math.ceil(calls.length / tamanhoPagina);
  const hasMorePages = pagina < totalPaginas;

  const pathname = usePathname();
  const { isOpen: isFilterModalOpen, openModal: openFilterModal, closeModal: closeFilterModal } = useModal(false);

  useEffect(() => {
    console.log('nomeArquivoId:', nomeArquivoId);
    fetchChamados();
  }, [nomeArquivoId]);

  const fetchChamados = async () => {
    console.log('Iniciando fetchChamados, nomeArquivoId:', nomeArquivoId);
    setIsLoading(true);
    try {
      let response;
      
      if (nomeArquivoId) {
        // Busca chamados específicos do nome_arquivo
        const result = await fetchTicketByNomeArquivoId(Number(nomeArquivoId));
        if (result.success) {
          response = result.data;
        } else {
          throw new Error(result.error);
        }
      } else {
        // Busca todos os chamados
        const result = await fetchTickets();
        if (result.success) {
          response = result.data;
        } else {
          throw new Error(result.error);
        }
      }
      
      setAllCalls(response);
      setCalls(response);
      setError(null);
    } catch (err) {
      setError(nomeArquivoId 
        ? 'Falha ao carregar chamados deste arquivo. Por favor, tente novamente.'
        : 'Falha ao carregar todos os chamados. Por favor, tente novamente.');
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
            'aberto': ['aberto', 'em andamento', 'em aberto'],
            'pendente': ['pendente', 'aguardando pelo suporte', 'itens pendentes'],
            'concluido': ['concluido', 'concluído', 'concluída', 'resolvido', 'fechado', 'cancelado']
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
    <div className="space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        {nomeArquivoId && (
          <div className="mb-4 p-3 bg-blue-50 text-blue-800 rounded-lg dark:bg-blue-900/20 dark:text-blue-200">
            Exibindo chamados do arquivo ID: {nomeArquivoId}
            <button 
              onClick={() => window.location.href = '/chamados'}
              className="ml-2 text-blue-600 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-100"
            >
              (Ver todos os chamados)
            </button>
          </div>
        )}

        {/* Restante do JSX permanece igual */}
        <div className="flex space-x-4 mb-6">
          <Link
            href={`/chamados/${nomeArquivoId ? `?nomeArquivoId=${nomeArquivoId}` : ''}`}
            className={`px-4 py-2 rounded-lg ${pathname === '/chamados' ? 'bg-[#00163B] text-white' : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600'}`}
          >
            <ListBulletIcon className="h-5 w-5" aria-label="Visualização em lista" />
          </Link>
        <Link
          href={`/chamados/listagem${nomeArquivoId ? `?nomeArquivoId=${nomeArquivoId}` : ''}`}
          className={`px-4 py-2 rounded-lg ${pathname === '/chamados/listagem' ? 'bg-[#00163B] text-white' : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600'}`}
        >
          {/* Você pode usar o mesmo ícone de lista aqui, ou outro que represente essa seção */}
          <ListBulletIcon className="h-5 w-5" aria-label="Listagem" />
        </Link>
        <Link
          href={`/chamados/cards${nomeArquivoId ? `?nomeArquivoId=${nomeArquivoId}` : ''}`}
          className={`px-4 py-2 rounded-lg ${pathname === '/chamados/cards' ? 'bg-[#00163B] text-white' : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600'}`}
        >
          <Squares2X2Icon className="h-5 w-5" aria-label="Visualização em cards" />
        </Link>
        </div>
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          {nomeArquivoId ? 'Chamados do Arquivo' : 'Todos os Chamados'}
        </h3>

          {/* Botão para abrir o modal de filtros */}
        <div className="mb-6 flex items-center gap-4">
          <Button onClick={openFilterModal} size="sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filtrar
          </Button>
        </div>

          {/* Modal de Filtros */}
          <Modal isOpen={isFilterModalOpen} onClose={closeFilterModal} className="max-w-[600px] p-5 lg:p-10">
            <h4 className="font-semibold text-gray-800 mb-7 text-title-sm dark:text-white/90">
              Filtrar Chamados
            </h4>
            <Filtros 
              onFilter={handleFilter} 
              initialFilters={filterValues} 
              setFilters={setFilterValues}
              hasNomeArquivoId={!!nomeArquivoId} // Passa true se estiver filtrado por arquivo
            />
            <div className="flex items-center justify-end w-full gap-3 mt-8">
              <Button size="sm" variant="outline" onClick={closeFilterModal}>
                Fechar
              </Button>
            </div>
          </Modal>

            {isLoading ? (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">Carregando chamados...</p>
              </div>
            ) : error ? (
              <div className="rounded-lg bg-red-100 p-4 text-red-700 dark:bg-red-900/20 dark:text-red-300">
                <p>{error}</p>
                <button 
                  onClick={fetchChamados}
                  className="mt-2 inline-flex items-center justify-center gap-2 rounded-full border border-transparent bg-[#00163B] px-4 py-2 text-sm font-medium text-white shadow-theme-xs hover:bg-[#001e4f] dark:bg-blue-700 dark:hover:bg-blue-800"
                >
                  Tentar novamente
                </button>
              </div>
            ) : calls.length > 0 ? (
              <>
                <div className="space-y-4">
                  {chamadosPaginados.map((chamado) => (
                    <CardChamados 
                      key={chamado.id} 
                      chamado={{
                        id: chamado.id_importado || chamado.id.toString(),
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

                {calls.length > tamanhoPagina && (
                  <div className="flex justify-end">
                    <div className="flex items-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2 dark:border-gray-700 dark:bg-gray-800">
                      <button
                        onClick={() => handlePageChange(pagina - 1)}
                        disabled={pagina <= 1}
                        className={`px-3 py-1 rounded-md ${
                          pagina <= 1 
                            ? "text-gray-400 cursor-not-allowed dark:text-gray-500" 
                            : "text-blue-500 hover:bg-blue-100 dark:hover:bg-gray-700"
                        }`}
                      >
                        Anterior
                      </button>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {pagina} de {totalPaginas}
                      </span>
                      <button
                        onClick={() => handlePageChange(pagina + 1)}
                        disabled={!hasMorePages}
                        className={`px-3 py-1 rounded-md ${
                          !hasMorePages 
                            ? "text-gray-400 cursor-not-allowed dark:text-gray-500" 
                            : "text-blue-500 hover:bg-blue-100 dark:hover:bg-gray-700"
                        }`}
                      >
                        Próximo
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="rounded-lg bg-gray-100 p-4 text-center text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                Nenhum chamado encontrado com os filtros aplicados.
              </div>
            )}
      </div>
    </div>
  );
};

export default ListaChamado;