import type { QueryResult } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Sends a natural language question to the backend API
 * @param question The natural language question to process
 * @returns The query results with SQL and explanation
 */
export const askQuestion = async (question: string): Promise<QueryResult> => {
  try {
    const response = await fetch(`${API_URL}/ask`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to process question');
    }

    const data = await response.json();
    return data as QueryResult;
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
};