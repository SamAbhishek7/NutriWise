import express from 'express';
import { analyzeFood } from '../controllers/geminiController.js';

const router = express.Router();

// POST /api/analyze - Analyze food nutrition
router.post('/analyze', analyzeFood);

export default router;
