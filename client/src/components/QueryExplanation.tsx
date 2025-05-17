import type { QueryResult } from '../types';

interface QueryExplanationProps {
  data: QueryResult | null;
}

const QueryExplanation = ({ data }: QueryExplanationProps) => {
  if (!data) {
    return null;
  }

  return (
    <div className="mt-6 space-y-4">
      <div className="rounded-md bg-gray-50 p-4">
        <h3 className="text-lg font-medium text-gray-900">SQL Query</h3>
        <pre className="mt-2 whitespace-pre-wrap text-sm text-gray-800 p-3 bg-gray-100 rounded overflow-auto">
          {data.sql}
        </pre>
      </div>
      
      <div className="rounded-md bg-blue-50 p-4">
        <h3 className="text-lg font-medium text-blue-900">Explanation</h3>
        <p className="mt-2 text-sm text-blue-800">
          {data.explanation}
        </p>
      </div>
    </div>
  );
};

export default QueryExplanation;