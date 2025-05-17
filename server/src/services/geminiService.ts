import dotenv from 'dotenv';
import fetch from 'node-fetch';
import * as dbService from './dbService.js';

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

    // Get the database schema information for prompt engineering
    const schema = await dbService.getSchemaInfo();
    
    // Create a detailed schema description for the prompt
    const schemaDescription = schema.map(table => {
      const columnsDescription = table.columns.map(col => 
        `    - ${col.name} (${col.type}): ${col.description}`
      ).join('\n');
      
      return `- ${table.name}: ${table.description}\n${columnsDescription}`;
    }).join('\n\n');

    // Create a prompt that explains the task and provides context
    const prompt = `
You are an advanced SQL query generator that specializes in converting natural language questions about business data into precise SQL queries for a PostgreSQL database.

DATABASE SCHEMA:
${schemaDescription}

RELATIONSHIPS:
- sales.product_id references products.id
- sales.user_id references users.id
- sales.region_id references regions.id
- inventory.product_id references products.id
- inventory.region_id references regions.id

IMPORTANT NOTES:
1. The schema has intentionally cryptic column names (like "Q1", "Q2", "c1", "p1", etc.) that you must interpret correctly:
   - In regions table: "Q1", "Q2", "Q3", "Q4" are boolean flags indicating if the region was active in that quarter
   - In sales table: "c1" is the sales channel (online/in-store), "c2" is campaign code
   - In sales table: "dscnt" is discount percentage, "s" is satisfaction score (1-10)
   - In users table: "t1", "t2", "t3" are boolean flags for customer tier levels

2. When analyzing sales trends by quarter:
   - Q1 = Jan-Mar (dates '2024-01-01' to '2024-03-31')
   - Q2 = Apr-Jun (dates '2024-04-01' to '2024-06-30')
   - Q3 = Jul-Sep (dates '2024-07-01' to '2024-09-30')
   - Q4 = Oct-Dec (dates '2024-10-01' to '2024-12-31')

3. The "zone" column in regions table has values like "North", "South", "East", "West", "Central"

USER QUESTION: "${question}"

Generate a PostgreSQL query that answers this question. Your output must be in the following JSON format:
{
  "sql": "THE SQL QUERY",
  "explanation": "A detailed explanation of how the query works and why it answers the question"
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

    const data = await response.json() as {
      candidates: Array<{
        content: {
          parts: Array<{
            text: string
          }>
        }
      }>
    };
    
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