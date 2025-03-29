"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import DetalhesChamado from "@/Components/Chamadas/Detalhes/DetalhesChamados";
import { fetchTicketById } from "@/services/service";

const ChamadoPage = () => {
  const { id } = useParams(); // Obtém o ID corretamente
  const [chamado, setChamado] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const loadChamado = async () => {
      const result = await fetchTicketById(id as string);

      if (result.success) {
        setChamado(result.data);
      } else {
        setError(result.error);
      }

      setIsLoading(false);
    };

    loadChamado();
  }, [id]);

  if (isLoading) return <p>Carregando...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!chamado) return <p className="text-gray-500">Chamado não encontrado.</p>;

  return <DetalhesChamado chamado={chamado} />;
};

export default ChamadoPage;
