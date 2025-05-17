import express, { Request, Response, NextFunction } from 'express';
import * as askController from '../controllers/askController.js';

const router = express.Router();

// Route for handling natural language questions
router.post('/ask', async (req, res, next) => {
  try {
	await askController.askQuestion(req, res, next);
  } catch (error) {
	next(error);
  }
});

export default router;