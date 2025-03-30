'use client'
import { useState, useCallback, ChangeEvent, DragEvent } from 'react';
import { importJiraCSV } from '@/services/service';
import { useRouter } from 'next/navigation';

export default function ImportacaoPage() {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadPhase, setUploadPhase] = useState<'upload' | 'processing'>('upload');
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [selectedSource, setSelectedSource] = useState('jira');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);
    setUploadPhase('upload');
    setMessage(null);
    setSelectedFile(file);

    try {
      const result = await importJiraCSV(file, (progress, phase) => {
        setUploadProgress(progress);
        setUploadPhase(phase);
      });
      
      if (result.success) {
        setMessage({
          text: `Importação concluída! ${result.data?.processedItems || 'Chamados'} processados.`,
          type: 'success',
        });
      } else {
        setMessage({
          text: result.error || 'Erro na importação',
          type: 'error',
        });
      }
    } catch (error) {
      console.error('Erro na importação:', error);
      setMessage({
        text: 'Erro inesperado na importação',
        type: 'error',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragEnter = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && (file.type === 'text/csv' || file.name.endsWith('.csv'))) {
      setSelectedFile(file);
      handleFileUpload(file);
    } else {
      setMessage({ text: 'Por favor, selecione um arquivo CSV válido', type: 'error' });
    }
  }, []);

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && (file.type === 'text/csv' || file.name.endsWith('.csv'))) {
      setSelectedFile(file);
      handleFileUpload(file);
    }
  };

  const handleSourceChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedSource(e.target.value);
  };

  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-md p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Importar CSV</h1>
        
        <div className="mb-6">
          <label htmlFor="source-select" className="block text-sm font-medium text-gray-700 mb-2">
            Selecione a fonte de importação
          </label>
          <select 
            id="source-select" 
            value={selectedSource}
            onChange={handleSourceChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="jira">Jira</option>
            <option value="alternativo">Alternativo</option>
          </select>
        </div>
        
        <div
          className={`border-2 border-dashed rounded-lg p-12 text-center mb-6 transition-colors ${
            isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
          }`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center space-y-2">
            <UploadIcon className="h-12 w-12 text-gray-400" />
            <p className="text-gray-600">
              Arraste e solte seu arquivo CSV aqui
            </p>
            <p className="text-sm text-gray-500">ou</p>
            <label className="cursor-pointer bg-[#00163B] hover:bg-[#001e4f] text-white px-4 py-2 rounded-md transition-colors">
              Selecione um arquivo
              <input
                type="file"
                accept=".csv"
                onChange={handleFileInputChange}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {isUploading && (
          <div className="mb-6">
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">
                {uploadPhase === 'upload' ? 'Enviando arquivo...' : 'Processando dados...'}
              </span>
              <span className="text-sm font-medium">{uploadProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  uploadPhase === 'upload' ? 'bg-blue-600' : 'bg-green-600'
                }`}
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            {uploadPhase === 'upload' && selectedFile && (
              <p className="text-xs text-gray-500 mt-1">
                Enviando {formatFileSize(selectedFile.size)}...
              </p>
            )}
          </div>
        )}

        {message && (
          <div
            className={`p-4 rounded-lg mb-6 ${
              message.type === 'success'
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {message.text}

            
          </div>
        )}

        {message?.type === 'success' && (
            <div className="flex justify-center">
            <button 
              onClick={() => router.push('/chamados')}
              className="cursor-pointer bg-[#00163B] hover:bg-[#001e4f] text-white px-4 py-2 rounded-md transition-colors"
            >
              Ver Chamados
            </button>
            </div>
        )}
      </div>
    </div>
  );
}

function UploadIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" x2="12" y1="3" y2="15" />
    </svg>
  );
}