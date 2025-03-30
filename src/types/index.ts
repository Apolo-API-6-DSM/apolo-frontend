export interface Comentario {
    usuario: string;
    hora: string;
    mensagem: string;
  }
  
  export interface Chamado {
    id: string;
    id_importado: string;
    status: string;
    sentimento_cliente: string;
    responsavel: string;
    tipo_importacao: string;
    tipo_documento: string;
    data_abertura: string;
    ultima_atualizacao: string;
    titulo: string;
    mensagem_limpa: string;
    comentarios?: Comentario[];
  }