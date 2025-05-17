import type { QueryResult } from '../types';

interface QueryExplanationProps {
  data: QueryResult;
}

const QueryExplanation = ({ data }: QueryExplanationProps) => {
  const { sql, explanation } = data;

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Query Details</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">The AI-generated SQL query and explanation</p>
      </div>
      <div className="border-t border-gray-200">
        <dl>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Generated SQL</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              <pre className="bg-gray-100 p-3 rounded wrap-break-word text-start">
                <code>{sql}</code>
              </pre>
            </dd>
          </div>
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Explanation</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{explanation}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
};

export default QueryExplanation;