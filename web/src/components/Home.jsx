import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '../utils/constant';
import Navbar from './shared/Navbar';

const Home = () => {
    const [user] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const navigate = useNavigate();

    const featureButtons = [
        {
            title: "AI Analysis",
            description: "Get instant nutritional information",
            path: "/analysis",
            icon: (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            )
        },
        {
            title: "Meal Planner",
            description: "Personalized meal recommendations",
            path: "/meal-planner",
            icon: (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            )
        },
        {
            title: "Health Tracker",
            description: "Monitor your progress",
            path: "/health-tracker",
            icon: (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            )
        },
        {
            title: "Real-time Updates",
            description: "Get instant feedback",
            path: "/updates",
            icon: (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            )
        }
    ];

    return (
        <div>
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center py-12 px-4 sm:px-6 lg:px-8">
                    <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                        <span className="block">Welcome to</span>
                        <span className="block text-green-600">NutriGen</span>
                    </h1>
                    <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                        Your personal AI-powered nutrition assistant.
                        {!user && " Get started by creating an account or logging in."}
                    </p>
                   
                </div>

                <div className="bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="lg:text-center">
                            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                                Everything you need for better nutrition
                            </p>
                        </div>

                        <div className="mt-10 mb-10">
                            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                                {featureButtons.map((feature, index) => (
                                    <button
                                        key={index}
                                        onClick={() => navigate(feature.path)}
                                        className="relative p-8 bg-white rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-2 border-gray-100 hover:border-green-500 cursor-pointer"
                                    >
                                        <div className="flex items-center justify-center">
                                            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-500 text-white">
                                                {feature.icon}
                                            </div>
                                        </div>
                                        <h3 className="mt-4 text-lg font-medium text-gray-900 text-center">
                                            {feature.title}
                                        </h3>
                                        <p className="mt-2 text-base text-gray-500 text-center">
                                            {feature.description}
                                        </p>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;