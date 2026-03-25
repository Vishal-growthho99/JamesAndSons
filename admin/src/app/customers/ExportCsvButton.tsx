'use client';

export default function ExportCsvButton({ data, filename, className }: { data: any[]; filename: string; className?: string }) {
  const handleExport = () => {
    if (data.length === 0) return;
    
    // Extract headers from the first object
    const headers = Object.keys(data[0]);
    
    // Create CSV rows
    const rows = data.map(obj => 
      headers.map(header => {
        const val = obj[header] === null || obj[header] === undefined ? '' : obj[header];
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
