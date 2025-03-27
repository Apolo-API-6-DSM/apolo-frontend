export const cleanCSV = (csvText: string) => {
    // Remove linhas não tabulares (que não contêm vírgulas)
    const validRows = csvText.split('\n')
      .filter(row => row.includes(',') && !row.includes('{color}') && !row.includes('|'));
    
    // Pega o cabeçalho real (primeira linha válida)
    const header = validRows[0]; 
    
    // Filtra apenas as colunas necessárias
    const requiredColumns = [
      'Resumo',
      'ID da item', 
      'Status',
      'Criado',
      'Categoria do status alterada',
      'Responsável'
    ];
    
    // Função robusta para validar e formatar data
    const parseDate = (dateString: string): Date | null => {
      if (!dateString || dateString.trim() === '') return null;
      
      // Tenta parsear como ISO string primeiro
      let parsedDate = new Date(dateString);
      if (!isNaN(parsedDate.getTime())) return parsedDate;
      
      // Tenta parsear formatos comuns do Brasil (dd/mm/aaaa)
      const brFormat = dateString.match(/(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2})/);
      if (brFormat) {
        parsedDate = new Date(
          parseInt(brFormat[3]),
          parseInt(brFormat[2]) - 1,
          parseInt(brFormat[1]),
          parseInt(brFormat[4]),
          parseInt(brFormat[5])
        );
        if (!isNaN(parsedDate.getTime())) return parsedDate;
      }
      
      // Tenta parsear formatos com timezone (ex: "2024-07-31T18:47:00.000Z")
      const isoFormat = dateString.match(/(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2}:\d{2})/);
      if (isoFormat) {
        parsedDate = new Date(`${isoFormat[1]}T${isoFormat[2]}Z`);
        if (!isNaN(parsedDate.getTime())) return parsedDate;
      }
      
      // Se nenhum formato funcionar, retorna null
      return null;
    };
    
    // Processa as linhas de dados
    const dataRows = validRows.slice(1)
      .map(row => {
        const values = row.split(',');
        // Cria objeto apenas com as colunas necessárias
        return requiredColumns.reduce((obj, col) => {
          const index = header.split(',').indexOf(col);
          if (index >= 0) {
            // Tratamento especial para datas
            if (col === 'Criado' || col === 'Categoria do status alterada') {
              obj[col] = parseDate(values[index]?.trim());
            } else {
              obj[col] = values[index]?.trim() || '';
            }
          }
          return obj;
        }, {} as Record<string, string | Date | null>);
      })
      .filter(row => row['ID da item']); // Remove linhas vazias
  
    return {
      header: requiredColumns.join(','),
      data: dataRows.map(row => requiredColumns.map(col => {
        // Converte datas para string ISO ou mantém o valor original
        if (row[col] instanceof Date) {
          return (row[col] as Date).toISOString();
        }
        return row[col] || '';
      }).join(','))
    };
};