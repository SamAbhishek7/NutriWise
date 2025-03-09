import { getNutritionInfo, getMealPlan, getFeedback } from '../utils/geminiService.js';

export const getNutritionInfoController = async (req, res) => {
  try {
    const { foodItem } = req.body;
    
    if (!foodItem) {
      return res.status(400).json({ error: 'Food item is required in request body' });
    }

    const data = await getNutritionInfo(foodItem);
    res.status(200).json({ data });
  } catch (error) {
    console.error('Error in getNutritionInfoController:', error);
    res.status(500).json({ 
      error: 'Failed to fetch nutrition information',
      message: error.message 
    });
  }
};

export const getMealPlanController = async (req, res) => {
  try {
    const { userInput } = req.body;

    if (!userInput) {
      return res.status(400).json({ error: 'User preferences are required in request body' });
    }

    const data = await getMealPlan(userInput);
    res.status(200).json({ data });
  } catch (error) {
    console.error('Error in getMealPlanController:', error);
    res.status(500).json({ 
      error: 'Failed to generate meal plan',
      message: error.message 
    });
  }
};

export const getFeedbackController = async (req, res) => {
  try {
    const { mealLog } = req.body;

    if (!mealLog) {
      return res.status(400).json({ error: 'Meal log is required in request body' });
    }

    const data = await getFeedback(mealLog);
    res.status(200).json({ data });
  } catch (error) {
    console.error('Error in getFeedbackController:', error);
    res.status(500).json({ 
      error: 'Failed to get feedback',
      message: error.message 
    });
  }
};
