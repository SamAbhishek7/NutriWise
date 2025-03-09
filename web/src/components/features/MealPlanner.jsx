import React, { useState, useEffect } from 'react';
import Navbar from '../shared/Navbar';
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Loader2 } from "lucide-react";

const MealPlanner = () => {
  const [loading, setLoading] = useState(false);
  const [mealPlan, setMealPlan] = useState(null);
  const [preferences, setPreferences] = useState({
    dietType: '',
    fitnessGoal: '',
    region: '',
    allergies: ''
  });
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      fetchSavedMealPlan(userData._id);
    }
  }, []);

  const fetchSavedMealPlan = async (userId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/gemini/meal-plan/${userId}`, {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setMealPlan(data.mealPlan);
        setPreferences({
          dietType: data.mealPlan.dietType,
          fitnessGoal: data.mealPlan.fitnessGoal,
          region: data.mealPlan.region,
          allergies: data.mealPlan.allergies.join(', ')
        });
      }
    } catch (error) {
      console.error('Error fetching meal plan:', error);
    }
  };

  const handlePreferenceChange = (name, value) => {
    setPreferences(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const generateMealPlan = async () => {
    if (!user) {
      alert('Please log in to generate a meal plan');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/gemini/meal-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          ...preferences,
          allergies: preferences.allergies.split(',').map(item => item.trim()).filter(Boolean),
          userId: user._id
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate meal plan');
      }

      const data = await response.json();
      setMealPlan(data);
    } catch (error) {
      console.error('Error generating meal plan:', error);
    } finally {
      setLoading(false);
    }
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];

  // Common regions with their cuisines
  const regions = [
    { value: 'indian', label: 'Indian' },
    { value: 'chinese', label: 'Chinese' },
    { value: 'mediterranean', label: 'Mediterranean' },
    { value: 'mexican', label: 'Mexican' },
    { value: 'italian', label: 'Italian' },
    { value: 'japanese', label: 'Japanese' },
    { value: 'thai', label: 'Thai' },
    { value: 'american', label: 'American' },
    { value: 'middle_eastern', label: 'Middle Eastern' },
    { value: 'korean', label: 'Korean' }
  ];

  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Personalized Meal Plans</h1>
        
        {/* Preferences Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Dietary Preferences</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Diet Type</label>
                <Select 
                  value={preferences.dietType}
                  onValueChange={(value) => handlePreferenceChange('dietType', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select diet type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="regular">Regular</SelectItem>
                    <SelectItem value="vegetarian">Vegetarian</SelectItem>
                    <SelectItem value="vegan">Vegan</SelectItem>
                    <SelectItem value="keto">Keto</SelectItem>
                    <SelectItem value="paleo">Paleo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Fitness Goal</label>
                <Select 
                  value={preferences.fitnessGoal}
                  onValueChange={(value) => handlePreferenceChange('fitnessGoal', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your goal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weight_loss">Weight Loss</SelectItem>
                    <SelectItem value="weight_gain">Weight Gain</SelectItem>
                    <SelectItem value="muscle_gain">Muscle Gain</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="general_fitness">General Fitness</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Region/Cuisine Preference</label>
                <Select 
                  value={preferences.region}
                  onValueChange={(value) => handlePreferenceChange('region', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select preferred cuisine" />
                  </SelectTrigger>
                  <SelectContent>
                    {regions.map(region => (
                      <SelectItem key={region.value} value={region.value}>
                        {region.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Allergies</label>
                <Input
                  placeholder="Enter allergies (comma-separated)"
                  value={preferences.allergies}
                  onChange={(e) => handlePreferenceChange('allergies', e.target.value)}
                />
              </div>
            </div>

            <Button 
              onClick={generateMealPlan}
              disabled={loading || !preferences.dietType || !preferences.fitnessGoal || !preferences.region}
              className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Plan...
                </>
              ) : (
                'Generate Meal Plan'
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Weekly Meal Plan Table */}
        {mealPlan && (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white shadow-sm rounded-lg">
              <thead>
                <tr className="bg-gray-50">
                  <th className="py-4 px-6 text-left text-sm font-semibold text-gray-900">Day</th>
                  {mealTypes.map(meal => (
                    <th key={meal} className="py-4 px-6 text-left text-sm font-semibold text-gray-900">{meal}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {days.map((day, index) => (
                  <tr key={day} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="py-4 px-6 text-sm font-medium text-gray-900">{day}</td>
                    {mealTypes.map(mealType => (
                      <td key={`${day}-${mealType}`} className="py-4 px-6">
                        {mealPlan[day.toLowerCase()]?.[mealType.toLowerCase()] && (
                          <div className="space-y-2">
                            <p className="font-medium text-gray-900">
                              {mealPlan[day.toLowerCase()][mealType.toLowerCase()].name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {mealPlan[day.toLowerCase()][mealType.toLowerCase()].calories} kcal
                            </p>
                          </div>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MealPlanner;
