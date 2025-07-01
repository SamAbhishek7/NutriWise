import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../utils/constant';
import Navbar from '../shared/Navbar';

const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        fullname: '',
        age: '',
        height: '',
        weight: '',
        dietaryPreferences: '',
        healthGoals: ''
    });

    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (!savedUser) {
            navigate(ROUTES.LOGIN);
            return;
        }
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setFormData({
            fullname: userData.fullname || '',
            age: userData.age || '',
            height: userData.height || '',
            weight: userData.weight || '',
            dietaryPreferences: userData.dietaryPreferences || '',
            healthGoals: userData.healthGoals || ''
        });
    }, [navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // TODO: Implement API call to update profile
            const updatedUser = { ...user, ...formData };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <Navbar />
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="bg-white shadow rounded-lg p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                        >
                            {isEditing ? 'Cancel' : 'Edit Profile'}
                        </button>
                    </div>

                    {isEditing ? (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Name</label>
                                    <input
                                        type="text"
                                        name="fullname"
                                        value={formData.fullname}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Age</label>
                                    <input
                                        type="number"
                                        name="age"
                                        value={formData.age}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Height (cm)</label>
                                    <input
                                        type="number"
                                        name="height"
                                        value={formData.height}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Weight (kg)</label>
                                    <input
                                        type="number"
                                        name="weight"
                                        value={formData.weight}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                    />
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700">Dietary Preferences</label>
                                    <textarea
                                        name="dietaryPreferences"
                                        value={formData.dietaryPreferences}
                                        onChange={handleInputChange}
                                        rows={3}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                    />
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700">Health Goals</label>
                                    <textarea
                                        name="healthGoals"
                                        value={formData.healthGoals}
                                        onChange={handleInputChange}
                                        rows={3}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Name</h3>
                                    <p className="mt-1 text-lg text-gray-900">{user.fullname || 'Not set'}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Age</h3>
                                    <p className="mt-1 text-lg text-gray-900">{user.age || 'Not set'}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Height</h3>
                                    <p className="mt-1 text-lg text-gray-900">{user.height ? `${user.height} cm` : 'Not set'}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Weight</h3>
                                    <p className="mt-1 text-lg text-gray-900">{user.weight ? `${user.weight} kg` : 'Not set'}</p>
                                </div>
                                <div className="sm:col-span-2">
                                    <h3 className="text-sm font-medium text-gray-500">Dietary Preferences</h3>
                                    <p className="mt-1 text-lg text-gray-900">{user.dietaryPreferences || 'Not set'}</p>
                                </div>
                                <div className="sm:col-span-2">
                                    <h3 className="text-sm font-medium text-gray-500">Health Goals</h3>
                                    <p className="mt-1 text-lg text-gray-900">{user.healthGoals || 'Not set'}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
