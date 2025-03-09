import { getNutritionInfo, getMealPlan, getFeedback } from '../utils/geminiService.js';
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini AI with your API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const getNutritionInfoController = async (req, res) => {
  try {
    const { foodItem } = req.body;
    
    if (!foodItem) {
      return res.status(400).json({ 
        error: 'Bad Request',
        message: 'Food item is required in request body' 
      });
    }

    const data = await getNutritionInfo(foodItem);
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error in getNutritionInfoController:', error);
    res.status(500).json({ 
      error: 'Internal Server Error',
      message: error.message || 'Failed to fetch nutrition information',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

export const getMealPlanController = async (req, res) => {
  try {
    const { userInput } = req.body;

    if (!userInput) {
      return res.status(400).json({ 
        error: 'Bad Request',
        message: 'User preferences are required in request body' 
      });
    }

    const data = await getMealPlan(userInput);
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error in getMealPlanController:', error);
    res.status(500).json({ 
      error: 'Internal Server Error',
      message: error.message || 'Failed to generate meal plan',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

export const getFeedbackController = async (req, res) => {
    try {
      const { meal, food, quantity } = req.body;
  
      if (!meal || !food || !quantity) {
        return res.status(400).json({ 
          error: 'Bad Request',
          message: 'Meal, food, and quantity are required in request body.' 
        });
      }
  
      // Convert single meal input into text
      const formattedMealLog = `
        **Meal:** ${meal}
        **Food:** ${food}
        **Quantity:** ${quantity}
      `;
  
      // Now pass the formatted text to Gemini API
      const data = await getFeedback(formattedMealLog);
  
      res.status(200).json({ success: true, data });
    } catch (error) {
      console.error('Error in getFeedbackController:', error);
      res.status(500).json({ 
        error: 'Internal Server Error',
        message: error.message || 'Failed to get feedback',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
};

const analyzeFood = async (req, res) => {
    try {
        const { food } = req.body;
        if (!food) {
            return res.status(400).json({ error: 'Food item is required' });
        }

        // ✅ Corrected: Using Gemini 1.5 Flash Model (lightning fast)
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // ✅ Prompt to extract nutrition data in JSON format
        const prompt = `Analyze the nutritional content of "${food}" and provide detailed information in the following JSON format:
        {
            "macros": {
                "protein": "amount in grams",
                "carbs": "amount in grams",
                "fat": "amount in grams",
                "fiber": "amount in grams"
            },
            "micros": {
                "vitamin_a": "amount with unit",
                "vitamin_c": "amount with unit",
                "calcium": "amount with unit",
                "iron": "amount with unit",
                "potassium": "amount with unit",
                "sodium": "amount with unit"
            },
            "calories": "total calories in kcal",
            "calorieBreakdown": {
                "protein": "calories from protein",
                "carbs": "calories from carbs",
                "fat": "calories from fat"
            }
        }
        
        Please ensure all numerical values are provided without units in the JSON (except for micros). The response should be valid JSON that can be parsed.`;

        // ✅ Generate Content using Gemini 1.5 Flash
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // ✅ Extract JSON from the response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('Failed to parse nutrition data');
        }

        const nutritionData = JSON.parse(jsonMatch[0]);

        // ✅ Send the parsed nutrition data
        res.json(nutritionData);
    } catch (error) {
        console.error('Analysis error:', error);
        res.status(500).json({ error: 'Failed to analyze food item' });
    }
};

export { analyzeFood };
