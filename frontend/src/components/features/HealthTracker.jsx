import React from 'react';
import Navbar from '../shared/Navbar';

const HealthTracker = () => {
  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Health Tracking</h1>
        <p className="text-lg text-gray-600 mb-6">
          Monitor your nutritional intake and track progress towards your health goals.
        </p>
        {/* Content will be added later */}
      </div>
    </div>
  );
};

export default HealthTracker;
