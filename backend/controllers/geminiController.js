import {  getMealPlan } from '../utils/geminiService.js';
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


export const generateMealPlan = async (req, res) => {
    try {
        const { dietType, fitnessGoal, region, targetWeight, currentWeight, height, allergies, userId } = req.body;

        if (!dietType || !fitnessGoal || !region || !userId || !targetWeight || !currentWeight || !height) {
            return res.status(400).json({ error: 'All fields are required' });
        }
console.log(targetWeight);
        // Initialize the model
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // Calculate BMI and weight difference
        const bmi = currentWeight / ((height / 100) * (height / 100));
        const weightDifference = targetWeight - currentWeight;
        const weightChangePerWeek = weightDifference > 0 ? 0.5 : -0.5; // 0.5 kg per week is a healthy rate

        // Calculate target calories based on BMI and fitness goal
        let targetCalories;
        let emphasis = '';

        if (fitnessGoal === 'weight_loss') {
            targetCalories = Math.max(1500, Math.round((currentWeight * 22) - 500)); // 500 calorie deficit
            emphasis = 'Focus on high-protein, low-calorie meals with plenty of fiber to maintain satiety.';
        } else if (fitnessGoal === 'weight_gain') {
            targetCalories = Math.round((currentWeight * 24) + 500); // 500 calorie surplus
            emphasis = 'Include calorie-dense but healthy foods, with adequate protein for muscle maintenance.';
        } else if (fitnessGoal === 'muscle_gain') {
            targetCalories = Math.round((currentWeight * 24) + 300); // Moderate surplus for muscle gain
            emphasis = 'High protein meals with complex carbohydrates for energy and recovery.';
        } else if (fitnessGoal === 'maintenance') {
            targetCalories = Math.round(currentWeight * 22); // Maintenance calories
            emphasis = 'Balanced macronutrients with focus on whole foods and variety.';
        } else {
            targetCalories = Math.round(currentWeight * 22); // Default to maintenance
            emphasis = 'Nutritionally balanced meals with emphasis on whole foods.';
        }

        // Create the prompt for meal plan generation
        const prompt = `Generate a 7-day meal plan with the following requirements:

Current Stats:
- Current Weight: ${currentWeight} kg
- Target Weight: ${targetWeight} kg
- Height: ${height} cm
- BMI: ${bmi.toFixed(1)}
- Weight Change Goal: ${weightDifference > 0 ? 'Gain' : 'Lose'} ${Math.abs(weightDifference)} kg
- Recommended Rate: ${Math.abs(weightChangePerWeek)} kg per week

Diet Requirements:
- Diet Type: ${dietType}
- Fitness Goal: ${fitnessGoal}
- Daily Calorie Target: ${targetCalories} calories
- Regional Cuisine: ${regionInfo[region].description}
- Common Ingredients: ${regionInfo[region].ingredients}
- Typical Dishes: ${regionInfo[region].common_dishes}
${allergies?.length ? `- Allergies to avoid: ${allergies.join(', ')}` : ''}

Nutritional Focus:
${emphasis}
- Adjust portion sizes to meet calorie goals while maintaining authentic flavors
- Include protein in every meal for satiety and muscle maintenance
- Balance complex carbohydrates and healthy fats
- Incorporate vegetables and fiber-rich foods

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
                targetWeight,
                currentWeight,
                height,
                allergies: allergies || [],
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
        
        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        // Validate if userId is a valid ObjectId
        if (!/^[0-9a-fA-F]{24}$/.test(userId)) {
            return res.status(400).json({ error: 'Invalid user ID format' });
        }

        const mealPlan = await MealPlan.findOne({ userId });
        
        if (!mealPlan) {
            return res.status(404).json({ error: 'No meal plan found for this user' });
        }

        res.json({ mealPlan });
    } catch (error) {
        console.error('Error fetching meal plan:', error);
        res.status(500).json({ 
            error: 'Failed to fetch meal plan',
            message: error.message 
        });
    }
};

export const analyzeFood = async (req, res) => {
    try {
        const { food } = req.body;
        if (!food) {
            return res.status(400).json({ error: 'Food item is required' });
        }
console.log("I am analuse");
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
            "calories": "total calories in calories",
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
export const generateRecipe = async (req, res) => {
    try {
        const { foodItem } = req.body;

        if (!foodItem) {
            return res.status(400).json({ error: 'Food item is required' });
        }

        // Initialize the model
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `Generate a detailed recipe and grocery list for ${foodItem}. 
        
Please provide the response in the following JSON format:
{
    "recipe": {
        "name": "Full name of the dish",
        "servings": "Number of servings",
        "prepTime": "Preparation time in minutes",
        "cookTime": "Cooking time in minutes",
        "difficulty": "Easy/Medium/Hard",
        "ingredients": [
            {
                "item": "Ingredient name",
                "amount": "Amount needed",
                "unit": "Unit of measurement"
            }
        ],
        "instructions": [
            "Step 1 description",
            "Step 2 description"
        ],
        "nutritionPerServing": {
            "calories": "number",
            "protein": "grams",
            "carbs": "grams",
            "fat": "grams"
        }
    },
    "groceryList": {
        "produce": ["List of produce items"],
        "dairy": ["List of dairy items"],
        "pantry": ["List of pantry items"],
        "meat": ["List of meat items"],
        "spices": ["List of spices"]
    }
}

Return ONLY the JSON object, no additional text.`;

        // Generate response
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = await response.text();

        // Attempt to extract JSON content
        const jsonMatch = text.match(/\{[\s\S]*\}/);

        if (!jsonMatch) {
            throw new Error('Failed to parse recipe data. Invalid JSON structure.');
        }

        let recipeData;
        try {
            // Clean the JSON string to handle any unwanted characters
            const cleanedJson = jsonMatch[0].replace(/(\r\n|\n|\r|\t)/gm, "");  // Remove line breaks and tabs
            recipeData = JSON.parse(cleanedJson);
        } catch (parseError) {
            console.error('JSON parsing error:', parseError);
            throw new Error('Failed to parse valid JSON from the AI response.');
        }

        res.json(recipeData);
    } catch (error) {
        console.error('Recipe generation error:', error);
        res.status(500).json({ 
            error: 'Failed to generate recipe',
            message: error.message 
        });
    }
};

