'use client'
import { useState, useCallback, ChangeEvent, DragEvent } from 'react';
import { importAlternativoCSV, importJiraCSV } from '@/services/service';
import { useRouter } from 'next/navigation';

export default function ImportacaoPage() {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadPhase, setUploadPhase] = useState<'upload' | 'processing'>('upload');
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [selectedSource, setSelectedSource] = useState('jira');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');
  const [errors, setErrors] = useState({
    fileName: '',
    file: ''
  });

  const validateForm = () => {
    const newErrors = {
      fileName: '',
      file: ''
    };
    let isValid = true;

    if (!fileName.trim()) {
      newErrors.fileName = 'O nome do arquivo é obrigatório!';
      isValid = false;
    }

    if (!selectedFile) {
      newErrors.file = 'Selecione um arquivo para importar:';
      isValid = false;
    } else if (!(selectedFile.type === 'text/csv' || selectedFile.name.endsWith('.csv'))) {
      newErrors.file = 'O arquivo deve ser do tipo CSV.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFileName(e.target.value);
    if (errors.fileName) {
      setErrors(prev => ({ ...prev, fileName: '' }));
    }
  };

  const handleFileUpload = async () => {
    if (!validateForm()) return;
    
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadProgress(0);
    setUploadPhase('upload');
    setMessage(null);

    try {
      let result;
      
      if (selectedSource === 'jira') {
        result = await importJiraCSV(selectedFile, fileName, (progress, phase) => {
          setUploadProgress(progress);
          setUploadPhase(phase);
        });
      } else if (selectedSource === 'alternativo') {
        result = await importAlternativoCSV(selectedFile, fileName, (progress, phase) => {
          setUploadProgress(progress);
          setUploadPhase(phase);
        });
      }
      
      if (result?.success) {
        setMessage({
          text: `Importação concluída! ${result.data?.processedItems || 'Chamados'} processados.`,
          type: 'success',
        });
      } else {
        setMessage({
          text: result?.error || 'Erro na importação',
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
      setErrors(prev => ({ ...prev, file: '' }));
    } else {
      setErrors(prev => ({ ...prev, file: 'O arquivo deve ser do tipo CSV.' }));
    }
  }, []);

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && (file.type === 'text/csv' || file.name.endsWith('.csv'))) {
      setSelectedFile(file);
      setErrors(prev => ({ ...prev, file: '' }));
    } else {
      setSelectedFile(null);
      setErrors(prev => ({ ...prev, file: 'O arquivo deve ser do tipo CSV.' }));
    }
  };

  const handleSourceChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedSource(e.target.value);
  };

  const router = useRouter();

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
      <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
        Importar CSV
      </h3>
      
      <div className="space-y-6">
        <div>
          <label htmlFor="source-select" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            Selecione a fonte de importação:
          </label>
          <select 
            id="source-select" 
            value={selectedSource}
            onChange={handleSourceChange}
            className="w-full p-2 border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
          >
            <option value="jira">Jira</option>
            <option value="alternativo">Alternativo</option>
          </select>

          <div className="mt-4">
            <label htmlFor="file-name" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Digite o nome do arquivo que você está importando *
            </label>
            <input
              id="file-name"
              type="text"
              value={fileName}
              onChange={handleFileNameChange}
              placeholder="Ex: Importação Jira 2024"
              className={`w-full p-2 border rounded-lg dark:bg-gray-800 dark:text-white ${
                errors.fileName ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
              }`}
              required
            />
            {errors.fileName && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.fileName}</p>
            )}
          </div>
        </div>
        
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragging ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 
            errors.file ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
          }`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center space-y-3">
            <UploadIcon className="h-12 w-12 text-gray-400 dark:text-gray-500" />
            
            {selectedFile ? (
              <>
                <p className="text-gray-800 dark:text-gray-200 font-medium">
                  {selectedFile.name}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {formatFileSize(selectedFile.size)}
                </p>
              </>
            ) : (
              <>
                <p className="text-gray-600 dark:text-gray-400">
                  Arraste e solte seu arquivo CSV aqui.
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500">ou</p>
              </>
            )}
            
            <label className="cursor-pointer inline-flex items-center justify-center gap-2 rounded-full border border-transparent bg-[#00163B] px-4 py-2 text-sm font-medium text-white shadow-theme-xs hover:bg-[#001e4f] dark:bg-blue-700 dark:hover:bg-blue-800">
              Selecione um arquivo:
              <input
                type="file"
                accept=".csv"
                onChange={handleFileInputChange}
                className="hidden"
              />
            </label>
          </div>
          {errors.file && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.file}</p>
          )}
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleFileUpload}
            disabled={isUploading}
            className={`inline-flex items-center justify-center gap-2 rounded-full border border-transparent px-4 py-2 text-sm font-medium text-white shadow-theme-xs ${
              isUploading 
                ? 'bg-gray-400 cursor-not-allowed dark:bg-gray-600'
                : 'bg-[#00163B] hover:bg-[#001e4f] dark:bg-blue-700 dark:hover:bg-blue-800'
            }`}
          >
            {isUploading ? (
              <>
                <Spinner />
                {uploadPhase === 'upload' ? 'Enviando...' : 'Processando...'}
              </>
            ) : (
              'Enviar Arquivo'
            )}
          </button>
        </div>

        {isUploading && (
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-800 dark:text-gray-300">
                {uploadPhase === 'upload' ? 'Enviando arquivo...' : 'Processando dados...'}
              </span>
              <span className="text-sm font-medium text-gray-800 dark:text-gray-300">{uploadProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <div
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  uploadPhase === 'upload' ? 'bg-blue-600' : 'bg-green-600'
                }`}
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            {uploadPhase === 'upload' && selectedFile && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Enviando {formatFileSize(selectedFile.size)}...
              </p>
            )}
          </div>
        )}

        {message && (
          <div
            className={`p-4 rounded-lg ${
              message.type === 'success'
                ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300'
                : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300'
            }`}
          >
            {message.text}
          </div>
        )}

        {message?.type === 'success' && (
          <div className="flex justify-end">
            <button 
              onClick={() => router.push('/chamados/listagem')}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-transparent bg-[#00163B] px-4 py-2 text-sm font-medium text-white shadow-theme-xs hover:bg-[#001e4f] dark:bg-blue-700 dark:hover:bg-blue-800"
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

function Spinner() {
  return (
    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );
}