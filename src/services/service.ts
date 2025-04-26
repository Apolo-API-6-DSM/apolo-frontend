import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003',
});

export const importJiraCSV = async (
  file: File, 
  onProgress?: (progress: number, phase: 'upload' | 'processing') => void
) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const uploadResponse = await api.post('/importacao/jira', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.min(
            80, // Limita a 80% para a fase de upload
            Math.round((progressEvent.loaded * 100) / progressEvent.total)
          );
          onProgress(progress, 'upload');
        }
      },
    });

    if (onProgress) {
      for (let progress = 81; progress <= 100; progress++) {
        await new Promise(resolve => setTimeout(resolve, 50 + Math.random() * 100));
        onProgress(progress, 'processing');
      }
    }

    return {
      success: true,
      data: uploadResponse.data,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || 'Erro ao importar arquivo',
    };
  }
};

export const fetchTickets = async () => {
  try {
    const response = await api.get('/chamados');
    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || 'Erro ao buscar chamados',
    };
  }
};

export const fetchTicketById = async (id: string) => {
  console.log(`Buscando chamado ${id}...`);
  try {
    const response = await api.get(`/chamados/${id}`);
    console.log("Resposta da API:", response.data);
    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    console.error("Erro na requisição:", error);
    return {
      success: false,
      error: error.response?.data?.message || 'Erro ao buscar o chamado',
    };
  }
};


export interface Chamado {
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
// Utility function to format status
export const formatStatus = (status: string): string => {
  if (!status) return 'Não definido';
  
  // Formatação para primeira letra maiúscula
  let formattedStatus = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  
  // Casos específicos
  if (formattedStatus.toLowerCase().includes('cancelado')) {
    formattedStatus = 'Cancelado';
  }
  
  if (formattedStatus.toLowerCase().includes('concluido')) {
    formattedStatus = 'Concluído';
  }
  
  if (formattedStatus.toLowerCase().includes('concluída')) {
    formattedStatus = 'Concluído';
  }
  
  return formattedStatus;
};