"use client";

import React, { useState, useEffect } from 'react';
import { fetchTickets, Chamado } from '@/services/service';

export default function ResponsaveisAtivosCard() {
    const [totalResponsaveis, setTotalResponsaveis] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const result = await fetchTickets();
                if (result.success) {
                    processResponsaveisData(result.data);
                    setError(null);
                } else {
                    throw new Error(result.error || 'Erro ao buscar os dados.');
                }
            } catch (err: unknown) {
                console.error('Erro ao buscar chamados:', err);
                const errorMessage = err instanceof Error ? err.message : 'Falha ao carregar os dados.';
                setError(errorMessage);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const processResponsaveisData = (data: Chamado[]) => {
        const responsaveisUnicos = new Set<string>();

        data.forEach(chamado => {
            if (chamado.responsavel && chamado.responsavel.trim() !== '') {
                responsaveisUnicos.add(chamado.responsavel.trim());
            }
        });

        setTotalResponsaveis(responsaveisUnicos.size);
    };

    if (isLoading) {
        return (
            <div className="bg-white dark:bg-gray-800 text-center rounded-md p-3 border border-gray-200 dark:border-gray-700 cursor-pointer hover:shadow-md transition-shadow duration-150 flex flex-col gap-2">
                <h3 className="text-sm dark:text-white font-medium text-gray-500">Responsáveis Ativos</h3>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white dark:bg-gray-800 text-center rounded-md p-3 border border-gray-200 dark:border-gray-700 cursor-pointer hover:shadow-md transition-shadow duration-150 flex flex-col gap-2">
                <h3 className="text-sm dark:text-white font-medium text-gray-500">Responsáveis Ativos</h3>
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-md p-3 border border-gray-200 dark:border-gray-700 cursor-pointer hover:shadow-md transition-shadow duration-150 flex flex-col gap-2">
            <h3 className="text-sm dark:text-white font-medium text-gray-500">Responsáveis Ativos</h3>
            <p className="text-3xl font-bold text-black-600 dark:text-red-400">{totalResponsaveis}</p>
        </div>
    );
}
