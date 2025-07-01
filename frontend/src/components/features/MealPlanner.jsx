import React, { useState, useEffect } from 'react';
import Navbar from '../shared/Navbar';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const MealPlanner = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    dietType: '',
    fitnessGoal: '',
    region: '',
    targetWeight: '',
    allergies: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mealPlan, setMealPlan] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (!savedUser) {
      toast.error('Please log in to access the meal planner');
      navigate('/login');
      return;
    }

    try {
      const userData = JSON.parse(savedUser);
      if (!userData._id) {
        toast.error('Invalid user data. Please log in again');
        navigate('/login');
        return;
      }
      setUser(userData);
      fetchSavedMealPlan(userData._id);
    } catch (error) {
      console.error('Error parsing user data:', error);
      toast.error('Error loading user data. Please log in again');
      navigate('/login');
    }
  }, [navigate]);

  const fetchSavedMealPlan = async (userId) => {
    if (!userId) {
      toast.error('User ID is required');
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/api/gemini/meal-plan/${userId}`, {
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 404) {
          // No meal plan found is not an error, just return
          return;
        }
        throw new Error(errorData.error || 'Failed to fetch meal plan');
      }

      const data = await response.json();
      if (data.mealPlan) {
        setMealPlan(data.mealPlan);
        setFormData({
          dietType: data.mealPlan.dietType || '',
          fitnessGoal: data.mealPlan.fitnessGoal || '',
          region: data.mealPlan.region || '',
          targetWeight: data.mealPlan.targetWeight || '',
          allergies: data.mealPlan.allergies.join(', ')
        });
      }
    } catch (error) {
      console.error('Error fetching meal plan:', error);
      toast.error(error.message || 'Error fetching meal plan');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!user.weight || !user.height) {
      setError('Please update your weight and height in your profile before generating a meal plan.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/gemini/meal-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          ...formData,
          userId: user._id,
          allergies: formData.allergies.split(',').map(item => item.trim()).filter(Boolean),
          targetWeight: parseFloat(formData.targetWeight),
          currentWeight: parseFloat(user.weight),
          height: parseFloat(user.height)
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate meal plan');
      }

      setMealPlan(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];

  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Personalized Meal Plans</h1>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Dietary Preferences</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Diet Type</label>
                  <Select
                    value={formData.dietType}
                    onValueChange={(value) => handleChange('dietType', value)}
                    required
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
                    value={formData.fitnessGoal}
                    onValueChange={(value) => handleChange('fitnessGoal', value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select fitness goal" />
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
                    value={formData.region}
                    onValueChange={(value) => handleChange('region', value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select preferred cuisine" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="indian">Indian</SelectItem>
                      <SelectItem value="chinese">Chinese</SelectItem>
                      <SelectItem value="mediterranean">Mediterranean</SelectItem>
                      <SelectItem value="mexican">Mexican</SelectItem>
                      <SelectItem value="italian">Italian</SelectItem>
                      <SelectItem value="japanese">Japanese</SelectItem>
                      <SelectItem value="thai">Thai</SelectItem>
                      <SelectItem value="american">American</SelectItem>
                      <SelectItem value="middle_eastern">Middle Eastern</SelectItem>
                      <SelectItem value="korean">Korean</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Target Weight (kg)</label>
                  <Input
                    type="number"
                    value={formData.targetWeight}
                    onChange={(e) => handleChange('targetWeight', e.target.value)}
                    min="30"
                    max="200"
                    step="0.1"
                    required
                    placeholder="Enter target weight"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Allergies</label>
                  <Input
                    placeholder="Enter allergies (comma-separated)"
                    value={formData.allergies}
                    onChange={(e) => handleChange('allergies', e.target.value)}
                  />
                </div>

                <div className="col-span-2 space-y-2">
                  <div className="text-sm text-muted-foreground">
                    Current Weight: {user?.weight} kg • Height: {user?.height} cm
                  </div>
                </div>
              </div>

              <Button type="submit" disabled={loading} className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Generate Meal Plan'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

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
