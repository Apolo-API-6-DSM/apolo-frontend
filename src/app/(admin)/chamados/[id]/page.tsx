"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import DetalhesChamadoJira from "@/components/chamados/detalhes/DetalhesChamadosJira";
import DetalhesChamadoAlternativo from "@/components/chamados/detalhes/DetalhesChamadosAlternativo";
import { fetchTicketById } from "@/services/service";

const ChamadoPage = () => {
  const { id } = useParams();
  const [chamado, setChamado] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadChamado = async () => {
      try {
        console.log(`Buscando chamado com ID: ${id}`);
        const result = await fetchTicketById(id as string);
        console.log("Resultado da API:", result);
        
        if (result.success) {
          // Verifique a estrutura dos dados recebidos
          console.log("Dados completos recebidos:", result.data);
          setChamado(result.data.chamado || result.data); // Ajuste para acessar a propriedade correta
        } else {
          setError(result.error || "Erro desconhecido");
        }
      } catch (err) {
        console.error("Erro ao carregar chamado:", err);
        setError("Erro ao carregar os dados do chamado");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      loadChamado();
    } else {
      setError("ID do chamado não fornecido");
      setIsLoading(false);
    }
  }, [id]);

  if (isLoading) return <div className="p-6">Carregando chamado...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (!chamado) return <div className="p-6">Chamado não encontrado</div>;

  console.log("Dados sendo passados para DetalhesChamado:", chamado);
  console.log(chamado.tipo_importacao)
  if (chamado.tipo_importacao === "Jira"){
    return <DetalhesChamadoJira chamado={chamado} />;
  } else {
    return <DetalhesChamadoAlternativo chamado={chamado} />;
  }
};

export default ChamadoPage;