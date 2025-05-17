import { useState } from 'react';

interface QuestionFormProps {
  onSubmit: (question: string) => Promise<void>;
  isLoading: boolean;
}

const QuestionForm = ({ onSubmit, isLoading }: QuestionFormProps) => {
  const [question, setQuestion] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim() === '') return;

    try {
      await onSubmit(question);
    } catch (error) {
      console.error('Error submitting question:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="rounded-lg bg-white shadow-md">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex flex-col space-y-3">
            <label htmlFor="question" className="text-sm font-medium text-gray-700">
              Ask a business question
            </label>
            <div className="mt-1">
              <textarea
                id="question"
                name="question"
                rows={3}
                className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                placeholder="E.g., Why did sales drop in Q2 in the southern zone? Which product had the highest profit margin last quarter?"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoading || question.trim() === ''}
                className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  'Ask Question'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default QuestionForm;