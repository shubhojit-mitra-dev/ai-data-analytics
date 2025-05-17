import type { QueryResult } from '../types';

interface ResultsTableProps {
  data: QueryResult;
}

const ResultsTable = ({ data }: ResultsTableProps) => {
  const { results } = data;
  
  if (!results || results.length === 0) {
    return (
      <div className="bg-white rounded-md p-4 border border-gray-200">
        <p className="text-gray-500 text-center">No data available for this query.</p>
      </div>
    );
  }

  // Extract column headers from the first result
  const columns = Object.keys(results[0]);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column}
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {results.map((row, rowIndex) => (
            <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              {columns.map((column) => (
                <td key={`${rowIndex}-${column}`} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatCellValue(row[column])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Helper function to format cell values for display
const formatCellValue = (value: unknown): string => {
  if (value === null || value === undefined) {
    return '-';
  }
  
  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }
  
  if (typeof value === 'object') {
    try {
      return JSON.stringify(value);
    } catch (e) {
        console.error('Error stringifying object:', e);
      return String(value);
    }
  }
  
  return String(value);
};

export default ResultsTable;