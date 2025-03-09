import React from 'react';
import Navbar from '../shared/Navbar';

const Analysis = () => {
  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">AI-Powered Nutrition Analysis</h1>
        <p className="text-lg text-gray-600 mb-6">
          Get instant, detailed nutritional information about any food item using our advanced AI technology.
        </p>
        {/* Content will be added later */}
      </div>
    </div>
  );
};

export default Analysis;
