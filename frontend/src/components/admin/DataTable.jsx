import { useState } from 'react';

export default function DataTable({ columns, data, onRowClick }) {
  const [sortField, setSortField] = useState(null);
  const [sortDir, setSortDir] = useState('asc');

  const handleSort = (field) => {
    if (sortField === field) setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            {columns.map(col => (
              <th key={col.key} onClick={() => col.sortable && handleSort(col.key)}
                className={`p-3 text-left text-sm font-medium text-gray-700 ${col.sortable ? 'cursor-pointer' : ''}`}>
                {col.label}
                {sortField === col.key && (sortDir === 'asc' ? ' ↑' : ' ↓')}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} onClick={() => onRowClick?.(row)}
              className={`border-t hover:bg-gray-50 ${onRowClick ? 'cursor-pointer' : ''}`}>
              {columns.map(col => (
                <td key={col.key} className="p-3 text-sm">{col.render ? col.render(row) : row[col.key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
