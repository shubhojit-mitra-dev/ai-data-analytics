import { Router, Request, Response, NextFunction } from 'express';
import askController from '../controllers/askController.js';

const router = Router();

// Route for processing natural language questions
router.post('/ask', (req: Request, res: Response, next: NextFunction) => {
  askController.processQuestion(req, res, next);
});

export default router;