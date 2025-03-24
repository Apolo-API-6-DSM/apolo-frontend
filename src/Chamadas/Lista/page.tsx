import React, { useState } from 'react';
import CardChamados from '../CardChamados/CardChamados';
import Filtragem from '../Filtragem/Filtragem';

const mockData = [
  { id: 1, status: 'aberto', sentimento: '😡 Sentimento Negativo', dataInicio: '24/03/2025', dataFim: '25/03/2025', responsavel: 'João', tipo: 'Suporte' },
  { id: 2, status: 'pendente', sentimento: '😐 Sentimento Neutro', dataInicio: '24/03/2025', dataFim: '26/03/2025', responsavel: 'Maria', tipo: 'Alteração' },
  { id: 3, status: 'concluido', sentimento: '😊 Sentimento Positivo', dataInicio: '22/03/2025', dataFim: '23/03/2025', responsavel: 'Pedro', tipo: 'Atualização' }
];

const CallsList = () => {
  const [calls, setCalls] = useState(mockData);

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

  return (
    <div className="flex p-8 space-x-8 bg-white">
      <Filtragem onFilter={handleFilter} />
      <div className="w-full">
        {calls.length > 0 ? (
          calls.map((chamado) => <CardChamados key={chamado.id} chamado={chamado} />)
        ) : (
          <p className="text-gray-500">Nenhum chamado encontrado.</p>
        )}
      </div>
    </div>
  );
};

export default CallsList;
