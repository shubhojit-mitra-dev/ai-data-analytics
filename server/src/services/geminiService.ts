import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

// API configuration
const API_KEY = process.env.GEMINI_API_KEY;
const API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent';

interface GeminiResponse {
  sql: string;
  explanation: string;
}

/**
 * Generate SQL from natural language using Gemini Pro
 * @param question The natural language question to process
 * @returns An object containing the generated SQL and explanation
 */
export const generateSQL = async (question: string): Promise<GeminiResponse> => {
  try {
    if (!API_KEY) {
      throw new Error('Missing Gemini API key');
    }

    // Create a prompt that explains the task and provides context
    const prompt = `
You are an advanced SQL query generator. Your task is to convert natural language questions about business data into precise SQL queries.

DATABASE SCHEMA:
- sales (id, date, amount, product_id, user_id, region_id)
- users (id, name, email, role, joined_date)
- products (id, name, category, price, cost)
- regions (id, name, country, zone)

USER QUESTION: "${question}"

Generate a PostgreSQL query that answers this question. Your output must be in the following JSON format:
{
  "sql": "THE SQL QUERY",
  "explanation": "A brief explanation of how the query works"
}

Be careful with joins and ensure the query handles potential NULL values. Make educated assumptions when the question is ambiguous.
`;

    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Gemini API error: ${response.status} ${errorData}`);
    }

    const data = await response.json() as any;
    
    // Extract the response text from the Gemini API response
    const responseText = data.candidates[0].content.parts[0].text;
    
    // Parse the JSON response from the text
    // The response might be wrapped in ```json ``` blocks, so we need to extract the JSON
    const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/) || 
                     responseText.match(/```\s*([\s\S]*?)\s*```/) || 
                     [null, responseText];
    
    const jsonText = jsonMatch[1].trim();
    const result = JSON.parse(jsonText);
    
    return {
      sql: result.sql,
      explanation: result.explanation
    };
  } catch (error) {
    console.error('Error generating SQL:', error);
    throw new Error(`Failed to generate SQL: ${(error as Error).message}`);
  }
};