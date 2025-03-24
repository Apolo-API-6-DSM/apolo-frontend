import React from 'react';

interface CardChamadosProps {
  chamado: {
    id: number;
    status: string;
    sentimento: string;
    dataInicio: string;
    dataFim: string;
    responsavel: string;
    tipo: string;
  };
}

const CardChamados: React.FC<CardChamadosProps> = ({ chamado }) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'aberto':
        return 'bg-yellow-500';
      case 'pendente':
        return 'bg-orange-500';
      case 'concluido':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="bg-cardBackground p-4 rounded-md shadow mb-4">
      <h4 className="text-lg font-bold text-primary">Chamado {chamado.id}</h4>
      <div className="flex items-center space-x-2 mt-2">
        <span className={`text-white px-3 py-1 rounded ${getStatusColor(chamado.status)}`}>
          {chamado.status.toUpperCase()}
        </span>
        <span className="text-sm text-red-500">{chamado.sentimento}</span>
      </div>
      <p className="text-sm mt-2">Data Início: {chamado.dataInicio}</p>
      <p className="text-sm">Data Fim: {chamado.dataFim}</p>
      <p className="text-sm">Responsável: {chamado.responsavel}</p>
      <p className="text-sm">Tipo: {chamado.tipo}</p>

      <button className="mt-4 px-4 py-2 bg-primary text-white rounded">Ver Mais</button>
    </div>
  );
};

export default CardChamados;
