import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

interface User {
    id: number;
    email: string;
    fullName: string;
    role: string;
}

export default function DashboardPage() {
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');

        if (!token || !userStr) {
            navigate('/login');
            return;
        }

        setUser(JSON.parse(userStr));
    }, [navigate]);

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-screen flex flex-col items-center justify-center bg-linear-to-br from-white to-green-100">
            <Navbar />

            <main className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome, {user.fullName}!</h1>
                    <p className="text-gray-600">Role: {user.role}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
                        <div className="text-blue-500 text-4xl mb-4">🏢</div>
                        <h2 className="text-xl font-semibold mb-2">Browse Rooms</h2>
                        <p className="text-gray-600 mb-4">View available rooms and their details</p>
                        <button
                            onClick={() => navigate('/rooms')}
                            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition"
                        >
                            View Rooms
                        </button>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
                        <div className="text-green-500 text-4xl mb-4">📅</div>
                        <h2 className="text-xl font-semibold mb-2">My Bookings</h2>
                        <p className="text-gray-600 mb-4">Manage your room bookings</p>
                        <button
                            onClick={() => navigate('/bookings')}
                            className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg transition"
                        >
                            View Bookings
                        </button>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
                        <div className="text-purple-500 text-4xl mb-4">👤</div>
                        <h2 className="text-xl font-semibold mb-2">Profile</h2>
                        <p className="text-gray-600 mb-4">
                            Email: {user.email}<br />
                            Role: {user.role}
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}