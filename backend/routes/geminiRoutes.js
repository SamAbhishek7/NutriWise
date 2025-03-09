import express from 'express';
import { 
  analyzeFood, 
  generateMealPlan, 
  getUserMealPlan, 
  getNutritionInfoController, 
  getFeedbackController 
} from '../controllers/geminiController.js';

const router = express.Router();

router.post('/nutrition-info', getNutritionInfoController);
router.post('/feedback', getFeedbackController);

// Protected routes - require authentication
router.post('/analyze', analyzeFood);
router.post('/meal-plan', generateMealPlan);
router.get('/meal-plan/:userId', getUserMealPlan);

export default router;
