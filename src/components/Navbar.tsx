import { useNavigate } from 'react-router-dom';

export default function Navbar() {
    const navigate = useNavigate();
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <nav className="bg-white shadow-sm w-screen sticky top-0 z-10 border-b border-gray-200">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center space-x-8">
                        <h1 className="text-md font-bold text-blue-500 cursor-pointer" onClick={() => navigate('/dashboard')}>
                            Allocella
                        </h1>

                        <div className="hidden md:flex space-x-4">
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="text-gray-700 hover:text-blue-500 transition"
                            >
                                Dashboard
                            </button>
                            <button
                                onClick={() => navigate('/rooms')}
                                className="text-gray-700 hover:text-blue-500 transition"
                            >
                                Rooms
                            </button>
                            <button
                                onClick={() => navigate('/bookings')}
                                className="text-gray-700 hover:text-blue-500 transition"
                            >
                                Bookings
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-600">
                            {user?.fullName} ({user?.role})
                        </span>
                        <button
                            onClick={handleLogout}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition text-sm"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}