'use client'
import { useState, ChangeEvent, DragEvent } from 'react';

type ProcessedFile = {
  id: number;
  name: string;
  headers: string[];
  data: string[][];
};

export default function UploadCSV() {
  const [data, setData] = useState<string[][]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedType, setSelectedType] = useState<'alternativo' | 'jira' | ''>('');
  const [processedFiles, setProcessedFiles] = useState<ProcessedFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<ProcessedFile | null>(null);

  const handleFileUpload = (file: File) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        processCSV(text, file.name);
      };
      reader.readAsText(file);
    }
  };

  const processCSV = (csvText: string, fileName: string) => {
    const rows = csvText.split('\n');
    const headers = rows[0].split(',');
    const data = rows.slice(1).map((row) => row.split(','));

    const newFile: ProcessedFile = {
      id: processedFiles.length + 1,
      name: fileName,
      headers,
      data,
    };

    setProcessedFiles([...processedFiles, newFile]);
    setHeaders(headers);
    setData(data);
  };

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'text/csv' && selectedType) {
      handleFileUpload(file);
    } else {
      alert('Por favor, selecione um tipo e arraste um arquivo CSV válido.');
    }
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && selectedType) {
      handleFileUpload(file);
    } else {
      alert('Por favor, selecione um tipo antes de enviar o arquivo.');
    }
  };

  const handleFileClick = (file: ProcessedFile) => {
    setSelectedFile(file);
    setHeaders(file.headers);
    setData(file.data);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Importar CSV</h1>
      <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-lg">
        <div className="mb-6">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as 'alternativo' | 'jira')}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Selecione o tipo</option>
            <option value="alternativo">Alternativo</option>
            <option value="jira">Jira</option>
          </select>
        </div>
        <div
          className={`border-2 border-dashed ${
            isDragging ? 'border-blue-500' : 'border-gray-300'
          } rounded-lg p-8 text-center cursor-pointer transition-colors duration-200`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <p className="text-gray-600 mb-4">Arraste e solte um arquivo CSV aqui</p>
          <p className="text-gray-500 text-sm mb-4">ou</p>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileInputChange}
            className="hidden"
            id="fileInput"
          />
          <label
            htmlFor="fileInput"
            className="inline-block px-6 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600 transition-colors duration-200"
          >
            Selecione um arquivo
          </label>
        </div>
      </div>
      {data.length > 0 && (
        <div className="w-full max-w-4xl mt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Dados do CSV</h2>
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  {headers.map((header, index) => (
                    <th key={index} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {processedFiles.length > 0 && (
        <div className="w-full max-w-4xl mt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Arquivos Processados</h2>
          <ul className="bg-white rounded-lg shadow-lg p-6">
            {processedFiles.map((file) => (
              <li
                key={file.id}
                onClick={() => handleFileClick(file)}
                className="cursor-pointer text-blue-500 hover:text-blue-700 mb-2"
              >
                {file.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}