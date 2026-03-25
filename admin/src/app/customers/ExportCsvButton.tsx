'use client';

export default function ExportCsvButton({ data, filename, className }: { data: any[]; filename: string; className?: string }) {
  const handleExport = () => {
    if (data.length === 0) return;
    
    // Helper to flatten nested objects and arrays into string values
    const flattenObject = (ob: any): any => {
      let result: any = {};
      for (const i in ob) {
        if ((typeof ob[i]) === 'object' && ob[i] !== null) {
          if (Array.isArray(ob[i])) {
            result[i] = ob[i].map((item: any) => typeof item === 'object' ? JSON.stringify(item) : item).join(' | ');
          } else if (ob[i] instanceof Date) {
            result[i] = ob[i].toISOString();
          } else {
            const flatObject = flattenObject(ob[i]);
            for (const x in flatObject) {
              result[`${i}.${x}`] = flatObject[x];
            }
          }
        } else {
          result[i] = ob[i];
        }
      }
      return result;
    };

    const flattenedData = data.map(flattenObject);
    
    // Get all unique keys across all objects to ensure no headers are missed
    const allKeys = new Set<string>();
    flattenedData.forEach(obj => Object.keys(obj).forEach(key => allKeys.add(key)));
    const headers = Array.from(allKeys);
    
    // Create CSV rows
    const rows = flattenedData.map(obj => 
      headers.map(header => {
        const val = obj[header];
        if (val === null || val === undefined) return '';
        // Handle commas/quotes in strings
        return typeof val === 'string' ? `"${val.replace(/"/g, '""')}"` : val;
      }).join(',')
    );
    
    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button onClick={handleExport} className={className}>
      Export CSV
    </button>
  );
}
