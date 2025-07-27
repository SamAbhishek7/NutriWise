import React from 'react';
import Navbar from '../shared/Navbar';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import {toast} from "sonner" 
import { Loader2 } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

const Updates = () => {
  const [loading, setLoading] = useState(false);
  const [foodItem, setFoodItem] = useState('');
  const [recipeData, setRecipeData] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Reset any previous errors
    
    if (!foodItem.trim()) {
      setError('Please enter a food item');
      toast.error('Please enter a food item');
      return;
    }

    setLoading(true);
    setRecipeData(null); // Clear previous recipe data
    try {
      const response = await fetch('http://localhost:8000/api/gemini/recipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ foodItem: foodItem.trim() }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to generate recipe');
      }

      const data = await response.json();
      
      // Check if we got a valid recipe response
      if (!data.recipe || !data.recipe.name) {
        throw new Error('Cannot generate recipe at this moment. Please try another recipe.');
      }
      
      setRecipeData(data);
    } catch (error) {
      const errorMessage = 'Cannot generate recipe at this moment. Please try another recipe.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-4 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Recipe Generator</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter a food item (e.g., Chicken Tikka Masala)"
                  value={foodItem}
                  onChange={(e) => setFoodItem(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-700 text-white">
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    'Get Recipe'
                  )}
                </Button>
              </div>
            </form>

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md text-center">
                <p className="text-red-700">Cannot generate recipe at this moment. Please try another recipe.</p>
              </div>
            )}

            {recipeData && (
              <div className="mt-6 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{recipeData.recipe.name}</CardTitle>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2 text-sm text-muted-foreground">
                      <div>
                        <span className="font-medium">Servings:</span> {recipeData.recipe.servings}
                      </div>
                      <div>
                        <span className="font-medium">Prep Time:</span> {recipeData.recipe.prepTime} mins
                      </div>
                      <div>
                        <span className="font-medium">Cook Time:</span> {recipeData.recipe.cookTime} mins
                      </div>
                      <div>
                        <span className="font-medium">Difficulty:</span> {recipeData.recipe.difficulty}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="ingredients">
                        <AccordionTrigger>Ingredients</AccordionTrigger>
                        <AccordionContent>
                          <ul className="list-disc pl-5 space-y-2">
                            {recipeData.recipe.ingredients.map((ingredient, index) => (
                              <li key={index}>
                                {ingredient.amount} {ingredient.unit} {ingredient.item}
                              </li>
                            ))}
                          </ul>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="instructions">
                        <AccordionTrigger>Instructions</AccordionTrigger>
                        <AccordionContent>
                          <ol className="list-decimal pl-5 space-y-2">
                            {recipeData.recipe.instructions.map((step, index) => (
                              <li key={index}>{step}</li>
                            ))}
                          </ol>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="nutrition">
                        <AccordionTrigger>Nutrition (per serving)</AccordionTrigger>
                        <AccordionContent>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                              <span className="font-medium">Calories:</span> {recipeData.recipe.nutritionPerServing.calories}
                            </div>
                            <div>
                              <span className="font-medium">Protein:</span> {recipeData.recipe.nutritionPerServing.protein}g
                            </div>
                            <div>
                              <span className="font-medium">Carbs:</span> {recipeData.recipe.nutritionPerServing.carbs}g
                            </div>
                            <div>
                              <span className="font-medium">Fat:</span> {recipeData.recipe.nutritionPerServing.fat}g
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="grocery">
                        <AccordionTrigger>Grocery List</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-4">
                            {Object.entries(recipeData.groceryList).map(([category, items]) => (
                              items.length > 0 && (
                                <div key={category}>
                                  <h4 className="font-medium capitalize mb-2">{category}</h4>
                                  <ul className="list-disc pl-5 space-y-1">
                                    {items.map((item, index) => (
                                      <li key={index}>{item}</li>
                                    ))}
                                  </ul>
                                </div>
                              )
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                </Card>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Updates;
