import React from 'react';
import Navbar from '../shared/Navbar';

const Updates = () => {
  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Real-time Updates</h1>
        <p className="text-lg text-gray-600 mb-6">
          Get instant feedback and recommendations as you log your meals and activities.
        </p>
        {/* Content will be added later */}
      </div>
    </div>
  );
};

export default Updates;
