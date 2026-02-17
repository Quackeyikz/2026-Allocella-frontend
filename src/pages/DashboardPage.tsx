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

    const isAdmin = user.role === 'admin';

    return (
        <div className="min-h-screen min-w-screen bg-gray-50">
            <Navbar />

            <main className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                        Welcome, {user.fullName}!
                        {isAdmin && <span className="text-4xl">👑</span>}
                    </h1>
                    <p className={`text-lg ${isAdmin ? 'text-green-600 font-semibold' : 'text-gray-600'}`}>
                        {isAdmin ? 'Administrator Dashboard - Full System Access' : `${user.role.charAt(0).toUpperCase() + user.role.slice(1)} Dashboard`}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Standard user cards */}
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

                    {isAdmin && (
                        <>
                            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition text-gray-800">
                                <div className="text-5xl mb-4">✅</div>
                                <h2 className="text-xl font-bold mb-2">Approve Bookings</h2>
                                <p className="text-gray-800 mb-4">Review and approve/reject pending booking requests</p>
                                <button
                                    onClick={() => navigate('/admin/all-bookings')}
                                    className="w-full bg-white text-green-600 font-semibold py-2 rounded-lg hover:bg-purple-50 transition"
                                >
                                    Manage All Bookings
                                </button>
                            </div>
                        </>
                    )}

                    <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
                        <div className="text-purple-500 text-4xl mb-4">👤</div>
                        <h2 className="text-xl font-semibold mb-2">Profile</h2>
                        <div className="text-gray-600 mb-4 space-y-1">
                            <p className="text-sm"><strong>Email:</strong> {user.email}</p>
                            <p className="text-sm">
                                <strong>Role:</strong>
                                <span className={isAdmin ? 'font-bold text-purple-600 ml-1' : 'ml-1'}>
                                    {user.role}
                                    {isAdmin && ' 👑'}
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}