import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is not defined in environment variables');
}

// Configure Gemini client with API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY, {
  // Configure fetch options for the client
  fetchOptions: {
    // Increase timeout
    timeout: 30000,
    // Configure headers
    headers: {
      'Content-Type': 'application/json',
    }
  }
});

const MODEL_NAME = 'gemini-1.5-pro';

const safeGenerateContent = async (model, prompt) => {
  try {
    // Add retry logic
    let retries = 3;
    let lastError;

    while (retries > 0) {
      try {
        const result = await model.generateContent(prompt);
        return await result.response.text();
      } catch (error) {
        lastError = error;
        retries--;
        if (retries > 0) {
          // Wait before retrying
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    }

    // If all retries failed, throw the last error
    throw lastError;
  } catch (error) {
    console.error('Error generating content:', error);
    if (error.message.includes('fetch failed')) {
      throw new Error('Network error: Unable to connect to Gemini API. Please check your internet connection and try again.');
    }
    throw error;
  }
};

export const getNutritionInfo = async (foodItem) => {
  try {
    if (!foodItem) {
      throw new Error('Food item is required');
    }
console.log("hi i am in nutiritoin");
    const model = genAI.getGenerativeModel({ 
      model: MODEL_NAME,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1000,
      }
    });

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
    
    const response = await safeGenerateContent(model, prompt);
    
    try {
      return JSON.parse(response);
    } catch (parseError) {
      return response;
    }
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

    const model = genAI.getGenerativeModel({ 
      model: MODEL_NAME,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1000,
      }
    });

    const prompt = `Create a detailed meal plan based on these preferences: ${userInput}. Include:
    1. Breakfast, lunch, dinner options
    2. Portion sizes
    3. Nutritional breakdown
    4. Preparation tips`;
    
    return await safeGenerateContent(model, prompt);
  } catch (error) {
    console.error('Error in getMealPlan:', error);
    throw new Error(error.message || 'Failed to generate meal plan');
  }
};
