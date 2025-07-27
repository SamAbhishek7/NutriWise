import React, { useState, useEffect } from 'react';
import Navbar from '../shared/Navbar';
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Loader2, Plus, Utensils } from "lucide-react";
import { getNutritionData, formatNutritionData } from '../../services/nutritionService';
import { logCalories, getCaloriesByDate } from '../../services/calorieService';
import { toast } from 'react-toastify';

const Analysis = () => {
    const [foodItem, setFoodItem] = useState('');
    const [loading, setLoading] = useState(false);
    const [nutritionData, setNutritionData] = useState(null);
    const [error, setError] = useState(null);
    const [searchHistory, setSearchHistory] = useState([]);
    const [caloriesConsumed, setCaloriesConsumed] = useState(0);

    // Load search history from localStorage and fetch today's calories on component mount
    useEffect(() => {
        // Load search history from localStorage
        const savedHistory = localStorage.getItem('nutritionSearchHistory');
        if (savedHistory) {
            setSearchHistory(JSON.parse(savedHistory));
        }

        // Fetch today's calories from the backend
        const fetchTodaysCalories = async () => {
            try {
                const today = new Date().toISOString().split('T')[0];
                const response = await getCaloriesByDate(today);
                if (response && response.calories) {
                    setCaloriesConsumed(response.calories);
                }
            } catch (error) {
                console.error('Error fetching today\'s calories:', error);
            }
        };

        fetchTodaysCalories();
    }, []);

    const analyzeFood = async () => {
        if (!foodItem.trim()) {
            setError('Please enter a food item');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const data = await getNutritionData(foodItem);
            const formattedData = formatNutritionData(data);
            
            if (formattedData) {
                setNutritionData(formattedData);
                // Update search history
                const newHistory = [
                    { query: foodItem, timestamp: new Date().toISOString() },
                    ...searchHistory.filter(item => item.query.toLowerCase() !== foodItem.toLowerCase())
                ].slice(0, 5); // Keep only the last 5 searches
                
                setSearchHistory(newHistory);
                localStorage.setItem('nutritionSearchHistory', JSON.stringify(newHistory));
            } else {
                throw new Error('No nutrition data found');
            }
        } catch (err) {
            setError('Failed to analyze food. Please try again with a different query.');
            console.error('Analysis error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        analyzeFood();
    };

    const handleAddToCalories = async (calories) => {
        console.log('handleAddToCalories called with:', calories);
        const caloriesToAdd = Math.round(calories);
        console.log('Rounded calories:', caloriesToAdd);
        
        try {
            // Get current date in YYYY-MM-DD format
            const today = new Date().toISOString().split('T')[0];
            console.log('Using date:', today);
            
            console.log('Calling logCalories with:', { date: today, calories: caloriesToAdd });
            // Log the calories to the backend
            const result = await logCalories(today, caloriesToAdd);
            console.log('logCalories result:', result);
            
            // Update the local state
            setCaloriesConsumed(prev => {
                const newTotal = prev + caloriesToAdd;
                console.log('Updating caloriesConsumed:', { prev, new: newTotal });
                return newTotal;
            });
            
            // Show success message
            console.log('Showing success toast');
            toast.success(`${caloriesToAdd} calories added to your daily total!`);
        } catch (error) {
            console.error('Error in handleAddToCalories:', {
                error,
                message: error.message,
                response: error.response?.data
            });
            toast.error(`Failed to save calories: ${error.message || 'Unknown error'}`);
        }
    };

    const handleHistoryClick = (query) => {
        setFoodItem(query);
        // Small delay to ensure state is updated before submitting
        setTimeout(() => {
            document.querySelector('form').requestSubmit();
        }, 0);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-6xl mx-auto p-6">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Nutrition Analysis
                        </h1>
                        <p className="text-gray-600 mt-2">
                            Get detailed nutritional information for any food item
                        </p>
                    </div>
                    {caloriesConsumed > 0 && (
                        <div className="bg-white p-4 rounded-lg shadow-sm border">
                            <p className="text-sm text-gray-500">Total Calories</p>
                            <p className="text-2xl font-bold text-green-600">
                                {caloriesConsumed} kcal
                            </p>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Utensils className="h-5 w-5 mr-2 text-green-500" />
                                    Analyze Food
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="space-y-2">
                                        <Input
                                            type="text"
                                            placeholder="E.g., 100g chicken breast, 1 medium apple"
                                            value={foodItem}
                                            onChange={(e) => setFoodItem(e.target.value)}
                                            className="w-full"
                                            disabled={loading}
                                        />
                                        {error && (
                                            <p className="text-sm text-red-600">{error}</p>
                                        )}
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <Button 
                                            type="submit" 
                                            disabled={loading}
                                            className="bg-green-600 hover:bg-green-700 text-white"
                                        >
                                            {loading ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Analyzing...
                                                </>
                                            ) : (
                                                'Analyze Food'
                                            )}
                                        </Button>
                                       
                                    </div>
                                </form>

                                {searchHistory.length > 0 && (
                                    <div className="mt-6">
                                        <h3 className="text-sm font-medium text-gray-500 mb-2">Recent Searches</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {searchHistory.map((item, index) => (
                                                <Button
                                                    key={index}
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleHistoryClick(item.query)}
                                                    className="bg-green-100 text-green-700 hover:bg-green-200"
                                                >
                                                    {item.query}
                                                </Button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {nutritionData && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-xl">
                                        Nutrition Facts
                                        <p className="text-sm font-normal text-gray-500 mt-1">
                                            For: {foodItem}
                                        </p>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-6">
                                        <div className="border-b pb-4">
                                            <h3 className="text-lg font-semibold text-gray-800 mb-3">
                                                Macros
                                            </h3>
                                            <div className="grid grid-cols-3 gap-4">
                                                <div className="bg-green-50 p-3 rounded-lg text-center">
                                                    <p className="text-sm text-green-600">Calories</p>
                                                    <p className="text-xl font-bold">
                                                        {Math.round(nutritionData.totals.calories)}
                                                    </p>
                                                    <p className="text-xs text-gray-500">kcal</p>
                                                </div>
                                                <div className="bg-green-50 p-3 rounded-lg text-center">
                                                    <p className="text-sm text-green-600">Protein</p>
                                                    <p className="text-xl font-bold">
                                                        {nutritionData.totals.protein_g.toFixed(1)}
                                                    </p>
                                                    <p className="text-xs text-gray-500">grams</p>
                                                </div>
                                                <div className="bg-green-50 p-3 rounded-lg text-center">
                                                    <p className="text-sm text-green-600">Carbs</p>
                                                    <p className="text-xl font-bold">
                                                        {nutritionData.totals.carbohydrates_total_g.toFixed(1)}
                                                    </p>
                                                    <p className="text-xs text-gray-500">grams</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <h4 className="font-medium text-gray-700 mb-2">Fats</h4>
                                                <ul className="space-y-1 text-sm">
                                                    <li className="flex justify-between">
                                                        <span className="text-gray-600">Total Fat</span>
                                                        <span>{nutritionData.totals.fat_total_g.toFixed(1)}g</span>
                                                    </li>
                                                    <li className="flex justify-between pl-4">
                                                        <span className="text-gray-600">Saturated</span>
                                                        <span>{nutritionData.totals.fat_saturated_g.toFixed(1)}g</span>
                                                    </li>
                                                </ul>
                                            </div>

                                            <div>
                                                <h4 className="font-medium text-gray-700 mb-2">Other</h4>
                                                <ul className="space-y-1 text-sm">
                                                    <li className="flex justify-between">
                                                        <span className="text-gray-600">Fiber</span>
                                                        <span>{nutritionData.totals.fiber_g.toFixed(1)}g</span>
                                                    </li>
                                                    <li className="flex justify-between">
                                                        <span className="text-gray-600">Sugar</span>
                                                        <span>{nutritionData.totals.sugar_g.toFixed(1)}g</span>
                                                    </li>
                                                    <li className="flex justify-between">
                                                        <span className="text-gray-600">Sodium</span>
                                                        <span>{nutritionData.totals.sodium_mg}mg</span>
                                                    </li>
                                                    <li className="flex justify-between">
                                                        <span className="text-gray-600">Potassium</span>
                                                        <span>{nutritionData.totals.potassium_mg}mg</span>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>

                                        {nutritionData.items.length > 1 && (
                                            <div className="mt-4">
                                                <h4 className="font-medium text-gray-700 mb-2">Items in this meal:</h4>
                                                <ul className="space-y-2 text-sm">
                                                    {nutritionData.items.map((item, index) => (
                                                        <li key={index} className="flex justify-between bg-gray-50 p-2 rounded">
                                                            <span className="font-medium">{item.name}</span>
                                                            <span>{Math.round(item.calories)} kcal</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Tips</CardTitle>
                                <CardDescription>
                                    How to get the most accurate results
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm">
                                <div className="flex items-start">
                                    <div className="bg-green-100 p-1 rounded-full mr-3 mt-0.5">
                                        <svg className="h-4 w-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <p>Be specific with quantities (e.g., "1 medium banana" or "100g cooked chicken breast")</p>
                                </div>
                                <div className="flex items-start">
                                    <div className="bg-green-100 p-1 rounded-full mr-3 mt-0.5">
                                        <svg className="h-4 w-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <p>For packaged foods, include the brand name for better accuracy</p>
                                </div>
                                <div className="flex items-start">
                                    <div className="bg-green-100 p-1 rounded-full mr-3 mt-0.5">
                                        <svg className="h-4 w-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <p>You can search for multiple items at once (e.g., "1 cup rice and 100g chicken")</p>
                                </div>
                            </CardContent>
                        </Card>

                    
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analysis;
