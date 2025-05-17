import { useState } from 'react';
import './App.css';
import QuestionForm from './components/QuestionForm';
import ResultsTable from './components/ResultsTable';
import QueryExplanation from './components/QueryExplanation';
import DataVisualization from './components/DataVisualization';
import NaturalLanguageResponse from './components/NaturalLanguageResponse';
import { askQuestion } from './services/api';
import type { QueryResult } from './types';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [queryResult, setQueryResult] = useState<QueryResult | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<string>('');

  const handleQuestionSubmit = async (question: string) => {
    setIsLoading(true);
    setError(null);
    setCurrentQuestion(question);

    try {
      const result = await askQuestion(question);
      setQueryResult(result);
    } catch (err) {
      setError((err as Error).message || 'An error occurred while processing your question');
      setQueryResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">AI SQL Data Agent</h1>
          <p className="mt-2 text-lg text-gray-600">
            Ask business questions in plain English and get AI-powered insights
          </p>
        </div>

        <div className="space-y-8">
          <QuestionForm onSubmit={handleQuestionSubmit} isLoading={isLoading} />

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {queryResult && (
            <div className="space-y-8">
              <h2 className="text-xl font-medium text-gray-900">
                <span className="text-blue-600 italic">{currentQuestion}</span>
              </h2>
              
              {/* Natural language response */}
              <NaturalLanguageResponse 
                response={queryResult.naturalLanguageResponse} 
                loading={isLoading} 
              />
              
              {/* Chart visualization */}
              <DataVisualization data={queryResult} />
              
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Detailed Results
                </h3>
                <ResultsTable data={queryResult} />
              </div>
              
              <QueryExplanation data={queryResult} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
