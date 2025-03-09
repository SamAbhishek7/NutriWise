import React, { useState } from 'react';
import Navbar from '../shared/Navbar';
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Loader2 } from "lucide-react";

const Analysis = () => {
    const [foodItem, setFoodItem] = useState('');
    const [loading, setLoading] = useState(false);
    const [nutritionData, setNutritionData] = useState(null);
    const [error, setError] = useState(null);

    const analyzeFood = async () => {
        if (!foodItem.trim()) {
            setError('Please enter a food item');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch('http://localhost:8000/api/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ food: foodItem }),
            });

            if (!response.ok) {
                throw new Error('Failed to analyze food item');
            }

            const data = await response.json();
            setNutritionData(data);
        } catch (err) {
            setError('Failed to analyze food. Please try again.');
            console.error('Analysis error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        analyzeFood();
    };

    return (
        <div>
            <Navbar />
            <div className="max-w-4xl mx-auto p-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                    Nutrition Analysis
                </h1>

                <form onSubmit={handleSubmit} className="mb-8">
                    <div className="flex gap-4">
                        <Input
                            type="text"
                            placeholder="Enter a food item (e.g., 100g chicken breast)"
                            value={foodItem}
                            onChange={(e) => setFoodItem(e.target.value)}
                            className="flex-1"
                        />
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
                                'Analyze'
                            )}
                        </Button>
                    </div>
                    {error && (
                        <p className="mt-2 text-sm text-red-600">{error}</p>
                    )}
                </form>

                {nutritionData && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg text-green-600">
                                    Macronutrients
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2">
                                    <li className="flex justify-between">
                                        <span>Protein</span>
                                        <span>{nutritionData.macros.protein}g</span>
                                    </li>
                                    <li className="flex justify-between">
                                        <span>Carbohydrates</span>
                                        <span>{nutritionData.macros.carbs}g</span>
                                    </li>
                                    <li className="flex justify-between">
                                        <span>Fat</span>
                                        <span>{nutritionData.macros.fat}g</span>
                                    </li>
                                    <li className="flex justify-between">
                                        <span>Fiber</span>
                                        <span>{nutritionData.macros.fiber}g</span>
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg text-green-600">
                                    Micronutrients
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2">
                                    {Object.entries(nutritionData.micros).map(([nutrient, value]) => (
                                        <li key={nutrient} className="flex justify-between">
                                            <span className="capitalize">{nutrient.replace('_', ' ')}</span>
                                            <span>{value}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg text-green-600">
                                    Calorie Content
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span>Total Calories</span>
                                        <span className="text-2xl font-bold">
                                            {nutritionData.calories} kcal
                                        </span>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-sm text-gray-600">Calorie Breakdown:</p>
                                        <ul className="space-y-1 text-sm">
                                            <li className="flex justify-between">
                                                <span>From Protein</span>
                                                <span>{nutritionData.calorieBreakdown.protein} kcal</span>
                                            </li>
                                            <li className="flex justify-between">
                                                <span>From Carbs</span>
                                                <span>{nutritionData.calorieBreakdown.carbs} kcal</span>
                                            </li>
                                            <li className="flex justify-between">
                                                <span>From Fat</span>
                                                <span>{nutritionData.calorieBreakdown.fat} kcal</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Analysis;
