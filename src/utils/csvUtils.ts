export const cleanCSV = (csvText: string) => {
  const validRows = csvText.split('\n')
    .filter(row => row.includes(',') && !row.includes('{color}') && !row.includes('|'));
  
  const header = validRows[0]; 
  
  const requiredColumns = [
    'Resumo',
    'ID da item', 
    'Status',
    'Criado',
    'Categoria do status alterada',
    'Responsável'
  ];
  
  const parseDate = (dateString: string): Date | null => {
    if (!dateString || dateString.trim() === '') return null;
    
    let parsedDate = new Date(dateString);
    if (!isNaN(parsedDate.getTime())) return parsedDate;
    
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
    
    const isoFormat = dateString.match(/(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2}:\d{2})/);
    if (isoFormat) {
      parsedDate = new Date(`${isoFormat[1]}T${isoFormat[2]}Z`);
      if (!isNaN(parsedDate.getTime())) return parsedDate;
    }
    
    return null;
  };
  
  const dataRows = validRows.slice(1)
    .map(row => {
      const values = row.split(',');
      return requiredColumns.reduce((obj, col) => {
        const index = header.split(',').indexOf(col);
        if (index >= 0) {
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
      if ((col === 'Criado' || col === 'Categoria do status alterada') && row[col] === null) {
        return '';
      }
      if (row[col] instanceof Date) {
        return (row[col] as Date).toISOString();
      }
      return row[col] || '';
    }).join(','))
  };
};