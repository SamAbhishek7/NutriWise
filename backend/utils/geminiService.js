import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const getNutritionInfo = async (foodItem) => {
  try {
    if (!foodItem) {
      throw new Error('Food item is required');
    }
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `Provide a detailed nutritional analysis for ${foodItem}. 
    The response should be in a clean JSON format with the following keys:
    - "calories": (in kcal)
    - "macronutrients": {
        "protein": (in grams),
        "carbs": (in grams),
        "fats": (in grams)
      }
    - "keyVitaminsAndMinerals": [
        (list of key vitamins and minerals)
      ]
    - "healthBenefits": [
        (list of health benefits)
      ]
    
    The response should be strictly in JSON format without any extra text or explanation.`;
    
    
    const result = await model.generateContent(prompt);
    const response = await result.response.text();
    return response;
  } catch (error) {
    console.error('Error in getNutritionInfo:', error);
    throw new Error(error.message || 'Failed to get nutrition information');
  }
};

export const getMealPlan = async (userInput) => {
  try {
    if (!userInput) {
      throw new Error('User preferences are required');
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Create a detailed meal plan based on these preferences: ${userInput}. Include:
    1. Breakfast, lunch, dinner options
    2. Portion sizes
    3. Nutritional breakdown
    4. Preparation tips`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response.text();
    return response;
  } catch (error) {
    console.error('Error in getMealPlan:', error);
    throw new Error(error.message || 'Failed to generate meal plan');
  }
};

export const getFeedback = async (mealLog) => {
  try {
    if (!mealLog) {
      throw new Error('Meal log is required');
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Analyze this meal log and provide:
    1. Nutritional balance assessment
    2. Areas for improvement
    3. Specific recommendations
    Meal log: ${mealLog}`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response.text();
    return response;
  } catch (error) {
    console.error('Error in getFeedback:', error);
    throw new Error(error.message || 'Failed to get feedback');
  }
};
