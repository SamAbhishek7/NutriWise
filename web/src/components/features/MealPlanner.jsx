import React from 'react';
import Navbar from '../shared/Navbar';

const MealPlanner = () => {
  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Personalized Meal Plans</h1>
        <p className="text-lg text-gray-600 mb-6">
          Get customized meal plans tailored to your dietary preferences and nutritional goals.
        </p>
        {/* Content will be added later */}
      </div>
    </div>
  );
};

export default MealPlanner;
