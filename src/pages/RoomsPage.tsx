import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

interface Room {
    id: number;
    roomName: string;
    roomNumber: string;
    building: string;
    floor: number;
    capacity: number;
    isAvailable: boolean;
}

export default function RoomsPage() {
    const navigate = useNavigate();
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        fetchRooms();
    }, [navigate]);

    const fetchRooms = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/Rooms`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) throw new Error('Failed to fetch rooms');

            const data = await response.json();
            setRooms(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const filteredRooms = rooms.filter(room =>
        room.roomName.toLowerCase().includes(search.toLowerCase()) ||
        room.roomNumber.toLowerCase().includes(search.toLowerCase()) ||
        room.building.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <main className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Available Rooms</h1>

                    <input
                        type="text"
                        placeholder="Search rooms..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredRooms.map((room) => (
                        <div key={room.id} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900">{room.roomNumber}</h3>
                                    <p className="text-gray-600">{room.roomName}</p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-sm ${room.isAvailable
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                    }`}>
                                    {room.isAvailable ? 'Available' : 'Unavailable'}
                                </span>
                            </div>

                            <div className="space-y-2 text-sm text-gray-600">
                                <p>🏢 Building: {room.building}</p>
                                <p>📍 Floor: {room.floor}</p>
                                <p>👥 Capacity: {room.capacity} people</p>
                            </div>

                            <button
                                onClick={() => navigate(`/bookings/new?roomId=${room.id}`)}
                                disabled={!room.isAvailable}
                                className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Book Room
                            </button>
                        </div>
                    ))}
                </div>

                {filteredRooms.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        No rooms found matching your search.
                    </div>
                )}
            </main>
        </div>
    );
}