import { Request, Response, NextFunction } from 'express';
import * as geminiService from '../services/geminiService.js';
import * as dbService from '../services/dbService.js';

export interface AskQuestionRequest {
  question: string;
}

/**
 * Controller to handle natural language questions about the database
 * Generates SQL using Gemini and executes it against Supabase
 */
export const askQuestion = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { question } = req.body as AskQuestionRequest;
    
    if (!question) {
      return res.status(400).json({ 
        error: 'Question is required' 
      });
    }

    console.log(`Processing question: "${question}"`);
    
    // Generate SQL query from natural language using Gemini Flash
    const { sql, explanation, responseTemplate } = await geminiService.generateSQL(question);
    
    console.log('Generated SQL:', sql);
    console.log('Explanation:', explanation);
    console.log('Response Template:', responseTemplate);
    
    // Execute the SQL query against the database
    const results = await dbService.executeQuery(sql);
    
    // Log the actual results for debugging
    console.log('SQL Results:', JSON.stringify(results, null, 2));
    
    // Create a natural language response directly from the results
    // This is a more reliable approach than template replacement
    let naturalLanguageResponse = "";
    
    if (results && results.length > 0) {
      const firstResult = results[0];
      console.log('Available result keys:', Object.keys(firstResult));
      
      // Check if this is a profit margin query
      if (question.toLowerCase().includes("profit margin") || 
          question.toLowerCase().includes("profitable") ||
          question.toLowerCase().includes("highest margin")) {
        
        // Look for common column name patterns in results
        const productNameKey = getKeyByPattern(firstResult, ["product_name", "name", "product"]);
        const profitMarginKey = getKeyByPattern(firstResult, ["profit_margin", "margin", "margin_percentage", "profit_margin_percentage"]);
        
        if (productNameKey && profitMarginKey) {
          const productName = firstResult[productNameKey];
          let profitMargin = firstResult[profitMarginKey];
          
          // Format profit margin as percentage if it appears to be a decimal
          if (typeof profitMargin === "number" && profitMargin < 1) {
            profitMargin = (profitMargin * 100).toFixed(2);
          } else if (typeof profitMargin === "number") {
            profitMargin = profitMargin.toFixed(2);
          }
          
          naturalLanguageResponse = `The product with the highest profit margin${question.toLowerCase().includes("quarter") ? " last quarter" : ""} was ${productName} with a profit margin of ${profitMargin}%. This premium product consistently outperforms others in our catalog.`;
        }
      } else if (question.toLowerCase().includes("sales") || 
                 question.toLowerCase().includes("revenue") ||
                 question.toLowerCase().includes("selling")) {
        
        // Look for common column name patterns in results
        const productNameKey = getKeyByPattern(firstResult, ["product_name", "name", "product"]);
        const salesKey = getKeyByPattern(firstResult, ["total_sales", "sales", "revenue", "amount", "total_amount"]);
        const quantityKey = getKeyByPattern(firstResult, ["quantity", "qty", "total_quantity", "count", "total_count"]);
        
        if (productNameKey && (salesKey || quantityKey)) {
          const productName = firstResult[productNameKey];
          let salesValue = salesKey ? firstResult[salesKey] : null;
          let quantityValue = quantityKey ? firstResult[quantityKey] : null;
          
          // Format currency values
          if (typeof salesValue === "number") {
            salesValue = salesValue.toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0
            });
          }
          
          // Format quantity values
          if (typeof quantityValue === "number") {
            quantityValue = quantityValue.toLocaleString();
          }
          
          if (salesValue && quantityValue) {
            naturalLanguageResponse = `${productName} is our top selling product with ${salesValue} in sales and ${quantityValue} units sold. This product has been consistently popular with our customers.`;
          } else if (salesValue) {
            naturalLanguageResponse = `${productName} is our top selling product with ${salesValue} in sales. This product has been consistently popular with our customers.`;
          } else if (quantityValue) {
            naturalLanguageResponse = `${productName} is our top selling product with ${quantityValue} units sold. This product has been consistently popular with our customers.`;
          }
        }
      } else if (question.toLowerCase().includes("region") || 
                 question.toLowerCase().includes("location") ||
                 question.toLowerCase().includes("area")) {
        
        // Look for common column name patterns in results
        const regionNameKey = getKeyByPattern(firstResult, ["region_name", "name", "region"]);
        const countryKey = getKeyByPattern(firstResult, ["country"]);
        const salesKey = getKeyByPattern(firstResult, ["total_sales", "sales", "revenue", "amount"]);
        
        if (regionNameKey) {
          const regionName = firstResult[regionNameKey];
          const country = countryKey ? firstResult[countryKey] : null;
          let salesValue = salesKey ? firstResult[salesKey] : null;
          
          // Format currency values
          if (typeof salesValue === "number") {
            salesValue = salesValue.toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0
            });
          }
          
          if (salesValue && country) {
            naturalLanguageResponse = `${regionName} in ${country} is our top performing region with ${salesValue} in sales. This region has shown consistent growth over time.`;
          } else if (salesValue) {
            naturalLanguageResponse = `${regionName} is our top performing region with ${salesValue} in sales. This region has shown consistent growth over time.`;
          } else {
            naturalLanguageResponse = `${regionName}${country ? ` in ${country}` : ""} is our top performing region. This region has shown consistent growth over time.`;
          }
        }
      } else if (question.toLowerCase().includes("inventory") || 
                 question.toLowerCase().includes("stock") ||
                 question.toLowerCase().includes("warehouse")) {
        
        // Look for common column name patterns in results
        const productNameKey = getKeyByPattern(firstResult, ["product_name", "name", "product"]);
        const stockKey = getKeyByPattern(firstResult, ["qty_available", "stock", "inventory", "available"]);
        const regionNameKey = getKeyByPattern(firstResult, ["region_name", "region"]);
        
        if (productNameKey && stockKey) {
          const productName = firstResult[productNameKey];
          const stockValue = firstResult[stockKey];
          const regionName = regionNameKey ? firstResult[regionNameKey] : null;
          
          if (regionName) {
            naturalLanguageResponse = `${productName} has ${stockValue} units in stock in the ${regionName} region. This inventory level is ${stockValue < 10 ? "critically low" : stockValue < 50 ? "low" : "adequate"}.`;
          } else {
            naturalLanguageResponse = `${productName} has ${stockValue} units in stock. This inventory level is ${stockValue < 10 ? "critically low" : stockValue < 50 ? "low" : "adequate"}.`;
          }
        }
      } else {
        // Generic response for other query types
        // Identify likely "main" column in results to form a natural response
        const nameKey = getKeyByPattern(firstResult, ["name", "title", "description"]);
        const valueKey = getKeyByPattern(firstResult, ["value", "count", "total", "amount", "qty", "quantity", "sum"]);
        
        if (nameKey && valueKey) {
          const nameValue = firstResult[nameKey];
          const value = firstResult[valueKey];
          
          naturalLanguageResponse = `${nameValue} has a value of ${value}. This information is based on our latest data analysis.`;
        } else {
          // Last resort: just say we found data
          naturalLanguageResponse = `I found results matching your query. Please see the detailed data table below for specific information.`;
        }
      }
    } else {
      naturalLanguageResponse = "I couldn't find any data that answers your question. Please try a different query or check if the data exists in the database.";
    }
    
    console.log('Final natural language response:', naturalLanguageResponse);
    
    // Return the combined results
    return res.status(200).json({
      results,
      sql,
      explanation,
      naturalLanguageResponse
    });
    
  } catch (error) {
    console.error('Error processing question:', error);
    next(error);
  }
};

/**
 * Helper function to find a key in an object based on pattern matching
 * @param obj The object to search in
 * @param patterns Array of possible key patterns to look for
 * @returns The matching key or null if not found
 */
function getKeyByPattern(obj: Record<string, any>, patterns: string[]): string | null {
  // First try exact matches
  for (const pattern of patterns) {
    if (obj[pattern] !== undefined) {
      return pattern;
    }
  }
  
  // Try case-insensitive matches
  const lowerCasePatterns = patterns.map(p => p.toLowerCase());
  for (const key of Object.keys(obj)) {
    if (lowerCasePatterns.includes(key.toLowerCase())) {
      return key;
    }
  }
  
  // Try partial matches
  for (const key of Object.keys(obj)) {
    for (const pattern of patterns) {
      if (key.toLowerCase().includes(pattern.toLowerCase()) || 
          pattern.toLowerCase().includes(key.toLowerCase())) {
        return key;
      }
    }
  }
  
  return null;
}