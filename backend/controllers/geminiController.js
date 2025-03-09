import { getNutritionInfo, getMealPlan, getFeedback } from '../utils/geminiService.js';
import { GoogleGenerativeAI } from "@google/generative-ai";
import MealPlan from '../models/MealPlan.js';

// Initialize Gemini AI with your API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Regional cuisine characteristics
const regionInfo = {
    indian: {
        description: 'Indian cuisine with rich spices, lentils, rice, flatbreads, and diverse vegetarian options',
        ingredients: 'lentils, rice, chickpeas, paneer, yogurt, Indian spices (turmeric, cumin, coriander)',
        common_dishes: 'curry, dal, biryani, tandoori dishes, roti'
    },
    chinese: {
        description: 'Chinese cuisine emphasizing balance, stir-frying, and fresh ingredients',
        ingredients: 'rice, noodles, tofu, soy sauce, ginger, garlic, Chinese vegetables',
        common_dishes: 'stir-fries, dumplings, soups, rice bowls'
    },
    mediterranean: {
        description: 'Mediterranean diet rich in olive oil, fresh vegetables, and lean proteins',
        ingredients: 'olive oil, tomatoes, leafy greens, fish, whole grains, legumes',
        common_dishes: 'Greek salad, hummus, grilled fish, pasta dishes'
    },
    mexican: {
        description: 'Mexican cuisine with corn, beans, and fresh ingredients',
        ingredients: 'corn, beans, avocados, tomatoes, chilies, Mexican spices',
        common_dishes: 'tacos, enchiladas, fajitas, Mexican rice bowls'
    },
    italian: {
        description: 'Italian cuisine focusing on fresh ingredients and simple preparation',
        ingredients: 'pasta, tomatoes, olive oil, Italian herbs, lean meats, vegetables',
        common_dishes: 'pasta dishes, risotto, Italian salads, lean protein preparations'
    },
    japanese: {
        description: 'Japanese cuisine emphasizing fresh fish, rice, and minimal processing',
        ingredients: 'rice, fish, seaweed, miso, tofu, Japanese vegetables',
        common_dishes: 'sushi rolls, miso soup, rice bowls, grilled fish'
    },
    thai: {
        description: 'Thai cuisine balancing sweet, sour, spicy, and savory flavors',
        ingredients: 'rice, rice noodles, coconut milk, Thai herbs, lean proteins',
        common_dishes: 'curry, stir-fries, noodle dishes, Thai salads'
    },
    american: {
        description: 'Modern American cuisine focusing on healthy preparations of classic dishes',
        ingredients: 'lean meats, whole grains, fresh vegetables, healthy oils',
        common_dishes: 'grilled proteins, grain bowls, healthy sandwiches, salads'
    },
    middle_eastern: {
        description: 'Middle Eastern cuisine rich in vegetables, grains, and lean proteins',
        ingredients: 'chickpeas, tahini, olive oil, lean meats, Middle Eastern spices',
        common_dishes: 'kebabs, falafel, grain bowls, Mediterranean salads'
    },
    korean: {
        description: 'Korean cuisine with fermented foods and balanced meals',
        ingredients: 'rice, kimchi, tofu, Korean vegetables, lean proteins',
        common_dishes: 'bibimbap, Korean BBQ, stews, rice bowls'
    }
};

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

export const generateMealPlan = async (req, res) => {
    try {
        const { dietType, fitnessGoal, region, allergies, excludeIngredients, userId } = req.body;

        if (!dietType || !fitnessGoal || !region || !userId) {
            return res.status(400).json({ error: 'Diet type, fitness goal, region, and user ID are required' });
        }

        // Initialize the model
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // Calculate target calories based on fitness goal
        let targetCalories;
        switch (fitnessGoal) {
            case 'weight_loss':
                targetCalories = '1500-1800';
                break;
            case 'weight_gain':
                targetCalories = '2800-3200';
                break;
            case 'muscle_gain':
                targetCalories = '2500-3000';
                break;
            case 'maintenance':
                targetCalories = '2000-2500';
                break;
            case 'general_fitness':
                targetCalories = '2000-2300';
                break;
            default:
                targetCalories = '2000-2500';
        }

        const selectedRegion = regionInfo[region];
        
        // Create the prompt for meal plan generation
        const prompt = `Generate a 7-day meal plan with the following requirements:
        - Diet Type: ${dietType}
        - Fitness Goal: ${fitnessGoal}
        - Daily Calorie Target: ${targetCalories} calories
        - Regional Cuisine: ${selectedRegion.description}
        - Common Ingredients: ${selectedRegion.ingredients}
        - Typical Dishes: ${selectedRegion.common_dishes}
        ${allergies?.length ? `- Allergies to avoid: ${allergies.join(', ')}` : ''}
        ${excludeIngredients?.length ? `- Ingredients to exclude: ${excludeIngredients.join(', ')}` : ''}

        Please provide the meal plan in the following JSON format:
        {
            "monday": {
                "breakfast": { "name": "meal name", "calories": "calories in numbers only" },
                "lunch": { "name": "meal name", "calories": "calories in numbers only" },
                "dinner": { "name": "meal name", "calories": "calories in numbers only" },
                "snacks": { "name": "snack options", "calories": "calories in numbers only" }
            },
            // Repeat for all days of the week (tuesday through sunday)
        }

        Guidelines:
        1. Use authentic ${region} ingredients and cooking styles
        2. Adapt traditional dishes to meet the ${fitnessGoal} requirements
        3. Ensure each day's total calories match the daily target
        4. For ${fitnessGoal}, focus on:
        ${fitnessGoal === 'weight_loss' ? '- Lower calorie versions of traditional dishes\n- High protein and fiber content\n- Smaller portions while maintaining authenticity' : ''}
        ${fitnessGoal === 'weight_gain' ? '- Larger portions of traditional dishes\n- Healthy calorie-dense ingredients\n- Additional protein sources' : ''}
        ${fitnessGoal === 'muscle_gain' ? '- High protein traditional dishes\n- Complex carbohydrates\n- Post-workout meal options' : ''}
        ${fitnessGoal === 'maintenance' ? '- Balanced portions of traditional dishes\n- Mix of proteins, carbs, and healthy fats\n- Variety in cooking methods' : ''}
        ${fitnessGoal === 'general_fitness' ? '- Balanced traditional meals\n- Focus on whole ingredients\n- Moderate portions' : ''}

        Return ONLY the JSON object, no additional text.`;

        // Generate response
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Extract JSON from the response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('Failed to parse meal plan data');
        }

        const mealPlanData = JSON.parse(jsonMatch[0]);

        // Validate the structure of the meal plan
        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        const meals = ['breakfast', 'lunch', 'dinner', 'snacks'];

        for (const day of days) {
            if (!mealPlanData[day]) {
                throw new Error(`Missing meal plan for ${day}`);
            }
            for (const meal of meals) {
                if (!mealPlanData[day][meal]) {
                    throw new Error(`Missing ${meal} for ${day}`);
                }
                if (!mealPlanData[day][meal].name || !mealPlanData[day][meal].calories) {
                    throw new Error(`Invalid meal data for ${day} ${meal}`);
                }
            }
        }

        // Save or update the meal plan in the database
        const mealPlanDoc = await MealPlan.findOneAndUpdate(
            { userId },
            {
                userId,
                dietType,
                fitnessGoal,
                region,
                allergies: allergies || [],
                excludeIngredients: excludeIngredients || [],
                ...mealPlanData
            },
            { new: true, upsert: true }
        );

        res.json(mealPlanDoc);
    } catch (error) {
        console.error('Meal plan generation error:', error);
        res.status(500).json({ 
            error: 'Failed to generate meal plan',
            message: error.message 
        });
    }
};

export const getUserMealPlan = async (req, res) => {
    try {
        const { userId } = req.params;
        const mealPlan = await MealPlan.findOne({ userId });
        
        if (!mealPlan) {
            return res.status(404).json({ error: 'No meal plan found for this user' });
        }

        res.json({ mealPlan });
    } catch (error) {
        console.error('Error fetching meal plan:', error);
        res.status(500).json({ error: 'Failed to fetch meal plan' });
    }
};

export const analyzeFood = async (req, res) => {
    try {
        const { food } = req.body;
        if (!food) {
            return res.status(400).json({ error: 'Food item is required' });
        }

        // Initialize the model
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // Create the prompt for nutrition analysis
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

        // Generate response
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Extract JSON from the response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('Failed to parse nutrition data');
        }

        const nutritionData = JSON.parse(jsonMatch[0]);
        res.json(nutritionData);
    } catch (error) {
        console.error('Analysis error:', error);
        res.status(500).json({ error: 'Failed to analyze food item' });
    }
};
