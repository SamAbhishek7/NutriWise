import express from 'express';
import { 
  getNutritionInfoController, 
  getMealPlanController, 
  getFeedbackController 
} from '../controllers/geminiController.js';

const router = express.Router();

router.post('/nutrition-info', getNutritionInfoController);
router.post('/meal-plan', getMealPlanController);
router.post('/feedback', getFeedbackController);

export default router;
