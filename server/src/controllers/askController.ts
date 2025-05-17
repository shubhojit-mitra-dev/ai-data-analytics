import { Request, Response, NextFunction } from 'express';
import * as geminiService from '../services/geminiService.js';
import * as dbService from '../services/dbService.js';

interface AskRequest {
  question: string;
}

const processQuestion = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { question } = req.body as AskRequest;
    
    if (!question) {
      return res.status(400).json({ message: 'Question is required' });
    }
    
    // Generate SQL using Gemini
    const { sql, explanation } = await geminiService.generateSQL(question);
    
    // Execute the SQL query
    const results = await dbService.executeQuery(sql);
    
    // Return the results, SQL query, and explanation
    res.status(200).json({
      results,
      sql,
      explanation
    });
  } catch (error) {
    next(error);
  }
};

export default {
  processQuestion
};