import React, { useState } from 'react';
import CardChamados from '../CardChamados/CardChamados';
import Filtragem from '../Filtragem/Filtragem';
import { FaSearch } from "react-icons/fa";

const mockData = [
    { id: 1, status: 'aberto', sentimento: '😡 Sentimento Negativo', dataInicio: '24/03/2025', dataFim: '25/03/2025', responsavel: 'João', tipo: 'Suporte' },
    { id: 2, status: 'pendente', sentimento: '😐 Sentimento Neutro', dataInicio: '24/03/2025', dataFim: '26/03/2025', responsavel: 'Maria', tipo: 'Alteração' },
    { id: 3, status: 'concluido', sentimento: '😊 Sentimento Positivo', dataInicio: '22/03/2025', dataFim: '23/03/2025', responsavel: 'Pedro', tipo: 'Atualização' }
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
        <div className="p-8 bg-white min-h-screen">
            <div className="flex mb-8">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-[947px] p-2 border border-gray-300 rounded-l-md"
                />
                <button
                    onClick={handleSearch}
                    className="bg-cardBackground text-primary px-4 rounded-r-md"
                >
                    <FaSearch />
                </button>
            </div>

            <div className="flex space-x-8">
                <Filtragem onFilter={handleFilter} />
                <div className="w-full">
                    {calls.length > 0 ? (
                        calls.map((chamado) => <CardChamados key={chamado.id} chamado={chamado} />)
                    ) : (
                        <p className="text-gray-500">Nenhum chamado encontrado.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ListaChamado;
