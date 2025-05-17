import { useState } from 'react';
import QuestionForm from './components/QuestionForm';
import ResultsTable from './components/ResultsTable';
import DataVisualization from './components/DataVisualization';
import QueryExplanation from './components/QueryExplanation';
import { askQuestion } from './services/api';
import type { QueryResult } from './types';
import './App.css';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [queryResult, setQueryResult] = useState<QueryResult | null>(null);

  const handleQuestionSubmit = async (question: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await askQuestion(question);
      setQueryResult(result);
    } catch (err) {
      console.error('Error processing question:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setQueryResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            AI SQL Data Agent
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Ask complex business questions in natural language and get instant insights.
          </p>
        </div>

        <div className="mt-12">
          <QuestionForm onSubmit={handleQuestionSubmit} isLoading={isLoading} />
          
          {error && (
            <div className="mt-6 rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{error}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {queryResult && (
            <div className="mt-8 bg-white shadow overflow-hidden rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h2 className="text-lg leading-6 font-medium text-gray-900">
                  Analysis Results
                </h2>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                <QueryExplanation data={queryResult} />
                
                <div className="mt-6">
                  <h3 className="text-lg font-medium text-gray-900">Data Table</h3>
                  <div className="mt-3">
                    <ResultsTable data={queryResult} />
                  </div>
                </div>
                
                <div className="mt-8">
                  <h3 className="text-lg font-medium text-gray-900">Data Visualization</h3>
                  <DataVisualization data={queryResult} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
