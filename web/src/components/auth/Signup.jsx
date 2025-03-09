import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AUTH_ENDPOINTS, ROUTES, API_CONFIG } from '../../utils/constant';
import Navbar from '../shared/Navbar';

const Signup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullname: '',
        email: '',
        phoneNumber: '',
        password: '',
        age: '',
        gender: '',
        weight: '',
        height: '',
        dietaryPreferences: [],
        allergies: [],
        healthConditions: [],
        activityLevel: 'moderate'
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleMultiSelect = (e, field) => {
        const value = Array.from(e.target.selectedOptions, option => option.value);
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch(AUTH_ENDPOINTS.REGISTER, {
                method: 'POST',
                ...API_CONFIG,
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Registration failed');
            }

            navigate(ROUTES.LOGIN);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Navbar />
            <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Create your NutriGen account
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link to={ROUTES.LOGIN} className="font-medium text-green-600 hover:text-green-500">
                            Sign in
                        </Link>
                    </p>
                </div>

                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                        {error && (
                            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                                {error}
                            </div>
                        )}

                        <form className="space-y-6" onSubmit={handleSubmit}>
                            {/* Basic Information */}
                            <div>
                                <label htmlFor="fullname" className="block text-sm font-medium text-gray-700">
                                    Full Name *
                                </label>
                                <input
                                    id="fullname"
                                    name="fullname"
                                    type="text"
                                    required
                                    value={formData.fullname}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Email address *
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                                />
                            </div>

                            <div>
                                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                                    Phone Number *
                                </label>
                                <input
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    type="tel"
                                    required
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                                />
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    Password *
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    minLength={6}
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                                />
                            </div>

                            {/* Physical Information */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="age" className="block text-sm font-medium text-gray-700">
                                        Age
                                    </label>
                                    <input
                                        id="age"
                                        name="age"
                                        type="number"
                                        min="0"
                                        value={formData.age}
                                        onChange={handleChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                                        Gender
                                    </label>
                                    <select
                                        id="gender"
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                                    >
                                        <option value="">Select gender</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="weight" className="block text-sm font-medium text-gray-700">
                                        Weight (kg)
                                    </label>
                                    <input
                                        id="weight"
                                        name="weight"
                                        type="number"
                                        min="0"
                                        value={formData.weight}
                                        onChange={handleChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="height" className="block text-sm font-medium text-gray-700">
                                        Height (cm)
                                    </label>
                                    <input
                                        id="height"
                                        name="height"
                                        type="number"
                                        min="0"
                                        value={formData.height}
                                        onChange={handleChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                                    />
                                </div>
                            </div>

                            {/* Health Information */}
                            <div>
                                <label htmlFor="dietaryPreferences" className="block text-sm font-medium text-gray-700">
                                    Dietary Preferences
                                </label>
                                <select
                                    id="dietaryPreferences"
                                    name="dietaryPreferences"
                                    multiple
                                    value={formData.dietaryPreferences}
                                    onChange={(e) => handleMultiSelect(e, 'dietaryPreferences')}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                                >
                                    <option value="vegetarian">Vegetarian</option>
                                    <option value="vegan">Vegan</option>
                                    <option value="pescatarian">Pescatarian</option>
                                    <option value="keto">Keto</option>
                                    <option value="paleo">Paleo</option>
                                    <option value="none">None</option>
                                </select>
                                <p className="mt-1 text-xs text-gray-500">Hold Ctrl/Cmd to select multiple options</p>
                            </div>

                            <div>
                                <label htmlFor="activityLevel" className="block text-sm font-medium text-gray-700">
                                    Activity Level
                                </label>
                                <select
                                    id="activityLevel"
                                    name="activityLevel"
                                    value={formData.activityLevel}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                                >
                                    <option value="sedentary">Sedentary (little or no exercise)</option>
                                    <option value="light">Light (exercise 1-3 times/week)</option>
                                    <option value="moderate">Moderate (exercise 4-5 times/week)</option>
                                    <option value="active">Active (daily exercise)</option>
                                    <option value="very_active">Very Active (intense exercise 6-7 times/week)</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="allergies" className="block text-sm font-medium text-gray-700">
                                    Allergies
                                </label>
                                <input
                                    id="allergies"
                                    name="allergies"
                                    type="text"
                                    placeholder="Enter allergies separated by commas"
                                    value={formData.allergies.join(', ')}
                                    onChange={(e) => setFormData(prev => ({
                                        ...prev,
                                        allergies: e.target.value.split(',').map(item => item.trim()).filter(Boolean)
                                    }))}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                                />
                            </div>

                            <div>
                                <label htmlFor="healthConditions" className="block text-sm font-medium text-gray-700">
                                    Health Conditions
                                </label>
                                <input
                                    id="healthConditions"
                                    name="healthConditions"
                                    type="text"
                                    placeholder="Enter health conditions separated by commas"
                                    value={formData.healthConditions.join(', ')}
                                    onChange={(e) => setFormData(prev => ({
                                        ...prev,
                                        healthConditions: e.target.value.split(',').map(item => item.trim()).filter(Boolean)
                                    }))}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                                />
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                                >
                                    {loading ? 'Creating account...' : 'Create Account'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;