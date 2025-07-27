import React, { useState, useEffect } from 'react';
import Navbar from '../shared/Navbar';
import { Droplet, Utensils, Moon, Plus, Minus } from 'lucide-react';

const HealthTracker = () => {
  const [waterIntake, setWaterIntake] = useState(0);
  const [calories, setCalories] = useState(0);
  const [sleepHours, setSleepHours] = useState(7);
  const [healthMetrics, setHealthMetrics] = useState({
    water: 0,
    calories: 0,
    sleep: 0,
    date: new Date().toISOString().split('T')[0]
  });

  // Load saved data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('healthMetrics');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      const today = new Date().toISOString().split('T')[0];
      
      if (parsedData.date === today) {
        setWaterIntake(parsedData.water || 0);
        setCalories(parsedData.calories || 0);
        setSleepHours(parsedData.sleep || 7);
      }
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    const todayMetrics = {
      water: waterIntake,
      calories,
      sleep: sleepHours,
      date: new Date().toISOString().split('T')[0]
    };
    
    localStorage.setItem('healthMetrics', JSON.stringify(todayMetrics));
  }, [waterIntake, calories, sleepHours]);

  const addWater = () => setWaterIntake(prev => Math.min(prev + 250, 4000));
  const removeWater = () => setWaterIntake(prev => Math.max(prev - 250, 0));
  
  const addCalories = () => setCalories(prev => prev + 50);
  const removeCalories = () => setCalories(prev => Math.max(prev - 50, 0));
  
  const updateSleep = (e) => setSleepHours(parseInt(e.target.value) || 0);

  const calculateWaterPercentage = () => Math.min((waterIntake / 2000) * 100, 100);
  const calculateCaloriePercentage = () => Math.min((calories / 2000) * 100, 100);
  const calculateSleepPercentage = () => Math.min((sleepHours / 9) * 100, 100);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Health Dashboard</h1>
        <p className="text-lg text-gray-600 mb-8">
          Track your daily health metrics and stay on top of your wellness goals.
        </p>
        
        {/* Water Intake Card */}
        <div className="bg-white p-6 rounded-xl shadow-md mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Droplet className="h-6 w-6 text-blue-500 mr-2" />
              <h2 className="text-xl font-semibold">Water Intake</h2>
            </div>
            <span className="text-2xl font-bold text-blue-600">{waterIntake}ml</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
            <div 
              className="bg-blue-500 h-4 rounded-full transition-all duration-300 ease-in-out"
              style={{ width: `${calculateWaterPercentage()}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-sm text-gray-500 mb-4">
            <span>0ml</span>
            <span>Goal: 2000ml</span>
          </div>
          <div className="flex space-x-4">
            <button 
              onClick={removeWater}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg flex items-center justify-center"
            >
              <Minus className="h-4 w-4 mr-1" /> 250ml
            </button>
            <button 
              onClick={addWater}
              className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-700 py-2 px-4 rounded-lg flex items-center justify-center"
            >
              <Plus className="h-4 w-4 mr-1" /> 250ml
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {/* Calorie Intake Card */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Utensils className="h-6 w-6 text-red-500 mr-2" />
                <h2 className="text-xl font-semibold">Calorie Intake</h2>
              </div>
              <span className="text-2xl font-bold text-red-600">{calories} kcal</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
              <div 
                className="bg-red-500 h-4 rounded-full transition-all duration-300 ease-in-out"
                style={{ width: `${calculateCaloriePercentage()}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-sm text-gray-500 mb-4">
              <span>0 kcal</span>
              <span>Goal: 2000 kcal</span>
            </div>
            <div className="flex space-x-4">
              <button 
                onClick={removeCalories}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg"
              >
                -50 kcal
              </button>
              <button 
                onClick={addCalories}
                className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 py-2 px-4 rounded-lg"
              >
                +50 kcal
              </button>
            </div>
          </div>

          {/* Sleep Tracker Card */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <Moon className="h-6 w-6 text-purple-500 mr-2" />
                <h2 className="text-xl font-semibold">Sleep Tracker</h2>
              </div>
              <span className="text-2xl font-bold text-purple-600">{sleepHours} hrs</span>
            </div>
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-500 mb-2">
                <span>0 hrs</span>
                <span>Recommended: 7-9 hrs</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                <div 
                  className="bg-purple-500 h-4 rounded-full transition-all duration-300 ease-in-out"
                  style={{ width: `${calculateSleepPercentage()}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-400">
                <span>0</span>
                <span>9+</span>
              </div>
            </div>
            <div className="mt-6">
              <label htmlFor="sleepHours" className="block text-sm font-medium text-gray-700 mb-2">
                Hours of Sleep Last Night:
              </label>
              <input
                type="number"
                id="sleepHours"
                min="0"
                max="12"
                step="0.5"
                value={sleepHours}
                onChange={updateSleep}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
          </div>
        </div>

        {/* Summary Card */}
        <div className="mt-8 bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4">Today's Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-600">Water Intake</p>
              <p className="text-2xl font-bold">{waterIntake}ml</p>
              <p className="text-xs text-gray-500">{Math.round(calculateWaterPercentage())}% of goal</p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <p className="text-sm text-red-600">Calories</p>
              <p className="text-2xl font-bold">{calories}kcal</p>
              <p className="text-xs text-gray-500">{Math.round(calculateCaloriePercentage())}% of goal</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-purple-600">Sleep</p>
              <p className="text-2xl font-bold">{sleepHours} hrs</p>
              <p className="text-xs text-gray-500">{sleepHours >= 7 ? 'Great!' : 'Aim for 7+ hours'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthTracker;
