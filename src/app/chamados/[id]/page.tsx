"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import DetalhesChamado from "@/Components/Chamadas/Detalhes/DetalhesChamados";

const API_BASE_URL = "http://localhost:3003";

const ChamadoPage = () => {
  const params = useParams(); // Obtém os parâmetros corretamente
  const [chamado, setChamado] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!params?.id) return;

    const fetchChamado = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/chamados/${params.id}`);
        if (!response.ok) throw new Error("Erro ao buscar chamado");

        const data = await response.json();
        setChamado(data);
      } catch (err) {
        setError("Falha ao carregar detalhes do chamado.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchChamado();
  }, [params?.id]); // Garante que params.id esteja definido antes da chamada

  if (isLoading) return <p>Carregando...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!chamado) return <p className="text-gray-500">Chamado não encontrado.</p>;

  return <DetalhesChamado chamado={chamado} />;
};

export default ChamadoPage;
