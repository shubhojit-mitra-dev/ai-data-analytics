import React from 'react';

interface NaturalLanguageResponseProps {
  response?: string;
  loading: boolean;
}

/**
 * Component to display the natural language response to the user's question
 */
const NaturalLanguageResponse: React.FC<NaturalLanguageResponseProps> = ({ response, loading }) => {
  if (loading) {
    return (
      <div className="p-4 my-4 bg-blue-50 border border-blue-100 rounded-md animate-pulse">
        <div className="h-4 bg-blue-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-blue-200 rounded w-1/2"></div>
      </div>
    );
  }

  if (!response) {
    return null;
  }

  return (
    <div className="p-6 my-4 bg-blue-50 border border-blue-100 rounded-md shadow-sm">
      <h2 className="text-lg font-medium mb-2 text-blue-800">Answer</h2>
      <div className="text-gray-700 leading-relaxed">{response}</div>
    </div>
  );
};

export default NaturalLanguageResponse;