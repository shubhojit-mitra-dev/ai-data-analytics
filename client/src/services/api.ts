import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface QueryResult {
  results: Record<string, unknown>[];
  sql: string;
  explanation: string;
}

export const askQuestion = async (question: string): Promise<QueryResult> => {
  try {
    const response = await axios.post(`${API_URL}/ask`, { question });
    return response.data;
  } catch (error) {
    console.error('Error asking question:', error);
    throw error;
  }
};