import dotenv from 'dotenv';
import * as dbService from './dbService.js';

dotenv.config();

// API configuration
// const API_KEY = process.env.GEMINI_API_KEY;
// Updated to use Gemini Flash instead of Gemini Pro
// const API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-flash:generateContent';

// Define the interface for the Gemini API response
interface GeminiResponse {
  candidates: {
    content: {
      parts: {
        text: string;
      }[];
    };
  }[];
}

// Define the interface for our SQL generation output
export interface SQLResult {
  sql: string;
  explanation: string;
  naturalLanguageResponse?: string;
  responseTemplate?: string;
}

/**
 * Generates SQL from natural language using Gemini Flash
 */
export const generateSQL = async (question: string): Promise<SQLResult> => {
  try {
    // Get API key from environment variables
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not defined in environment variables');
    }
    
    // Get database schema information from the dbService
    const schemaInfo = await dbService.getSchemaInfo();
    
    // Build the prompt for Gemini Flash
    const prompt = `
      You are an expert business analyst who helps translate business questions into SQL queries and provides natural language answers.
      
      Here's the exact database schema with all columns:
      ${schemaInfo}
      
      The user asked: "${question}"
      
      Please generate:
      1. A valid PostgreSQL query that answers this question
      2. A brief explanation of the SQL query
      3. A template for a natural language response that can be filled with actual data values
      
      SQL requirements:
      - Use ONLY columns that exist exactly as shown in the schema above
      - Use proper case sensitivity for columns like "Q1", "Q2", "Q3", "Q4", and "flag"
      - Join tables using the relationships defined in the schema
      - Handle cryptic column names appropriately (c1=channel, c2=campaign, p1/p2=promotions, etc.)
      - Always use column aliases for clarity, especially for calculated values
      - For questions about highest/lowest values, order results appropriately and use LIMIT 1
      
      Response Template requirements:
      - Create a natural language template response that includes placeholders in {{double curly braces}}
      - Placeholders MUST be EXACTLY the same as column aliases in your SQL query
      - For example, if your SQL has "p.name AS product_name", use {{product_name}} in your template
      - For percentages, do NOT include % symbols in placeholders
      - Keep it concise but informative (2-4 sentences)
      - Make sure all column names referenced in the template exist in your SQL query results
      
      Format your response EXACTLY as follows:
      SQL: [your SQL query with clear column aliases]
      EXPLANATION: [brief explanation of how the query works]
      TEMPLATE: The product with the highest profit margin last quarter was {{product_name}} with a profit margin of {{profit_margin_percentage}}%. This premium product consistently outperforms others in our catalog.
    `;
    
    // Call the Gemini Flash API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 1024
          }
        })
      }
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json() as GeminiResponse;
    
    if (!data.candidates || data.candidates.length === 0) {
      throw new Error('No response from Gemini API');
    }
    
    // Extract the generated text
    const generatedText = data.candidates[0].content.parts[0].text.trim();
    
    // Parse the output to extract SQL, explanation, and template
    const sqlMatch = generatedText.match(/SQL:\s*([\s\S]*?)(?=EXPLANATION:|$)/i);
    const explanationMatch = generatedText.match(/EXPLANATION:\s*([\s\S]*?)(?=TEMPLATE:|$)/i);
    const templateMatch = generatedText.match(/TEMPLATE:\s*([\s\S]*?)$/i);
    
    if (!sqlMatch) {
      throw new Error('No SQL query found in Gemini response');
    }

    // Clean up extracted SQL: remove markdown code fences and trim
    let rawSql = sqlMatch[1].trim();
    rawSql = rawSql.replace(/```(?:sql)?/gi, '').trim();
    
    const explanation = explanationMatch ? explanationMatch[1].trim() : 'No explanation available';
    let responseTemplate = templateMatch ? templateMatch[1].trim() : 'No response template available';
    
    // Ensure all placeholders use double curly braces
    if (!responseTemplate.includes('{{') && responseTemplate.includes('{')) {
      responseTemplate = responseTemplate.replace(/\{([^}]+)\}/g, '{{$1}}');
    }
    
    // Extract column aliases from the SQL query to help with debugging
    const aliasRegex = /\bAS\s+["']?([a-zA-Z0-9_]+)["']?/gi;
    const aliases = [];
    let match;
    while ((match = aliasRegex.exec(rawSql)) !== null) {
      aliases.push(match[1]);
    }
    console.log('Extracted SQL aliases:', aliases);
    
    return {
      sql: rawSql,
      explanation,
      responseTemplate
    };
    
  } catch (error) {
    console.error('Error generating SQL:', error);
    throw error;
  }
};