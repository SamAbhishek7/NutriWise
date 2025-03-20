import express from 'express';
import { 
  analyzeFood, 
  generateMealPlan, 
  getUserMealPlan, 
  getNutritionInfoController,
  generateRecipe, 
} from '../controllers/geminiController.js';

const router = express.Router();

router.post('/nutrition-info', getNutritionInfoController);

// Protected routes - require authentication
router.post('/analyze', analyzeFood);
router.post('/meal-plan', generateMealPlan);
router.get('/meal-plan/:userId', getUserMealPlan);
router.post('/recipe',generateRecipe)
export default router;
