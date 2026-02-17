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

    const filteredRooms = rooms
        .filter(room =>
            room.roomName.toLowerCase().includes(search.toLowerCase()) ||
            room.roomNumber.toLowerCase().includes(search.toLowerCase()) ||
            room.building.toLowerCase().includes(search.toLowerCase())
        )
        .sort((a, b) => (b.isAvailable ? 1 : 0) - (a.isAvailable ? 1 : 0));

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
                    <h1 className="text-4xl text-center font-bold text-gray-900 mb-4"><i className="bi bi-door-closed"></i> Available Rooms</h1>

                    <input
                        type="text"
                        placeholder="Search rooms..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredRooms.map((room) => (
                        <div key={room.id} className={`${room.isAvailable ? 'bg-green-100 ring-green-400 shadow-green-400' : 'bg-red-100 ring-red-400 shadow-red-400'} hover:-translate-y-3 hover:shadow-[0px_15px_0px] hover:ring-4 rounded-4xl transition duration-300`}>
                            <div className='flex flex-row justify-between'>
                                <div className='text-center p-4 text-2xl'>
                                    <i className="bi bi-bookmark"></i>
                                </div>

                                <div className='grow relative bg-white p-6 rounded-tr-4xl rounded-bl-4xl'>
                                    <div className='mb-4'>
                                        <h3 className="text-3xl font-semibold text-gray-800">{room.building} {room.roomNumber}</h3>
                                        <p className="text-gray-600 font-medium mt-2">{room.roomName}</p>
                                    </div>
                                    <span className={`absolute right-5 top-5 px-3 py-1 rounded-full text-md ${room.isAvailable
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                        }`}>
                                        {room.isAvailable ? 'Available' : 'Unavailable'}
                                    </span>

                                    <div className="space-y-2 text-sm text-gray-600">
                                        <p><i className="bi bi-building"></i> Building: {room.building == 'SAW' ? 'Semi Automation Workshop (SAW)' : room.building == 'PS' ? 'Pasca Sarjana (PS)' : room.building == 'D4' ? 'D4' : room.building == 'D3' ? 'D3' : room.building}</p>
                                        <p><i className="bi bi-bar-chart-steps"></i> Floor: {room.floor}</p>
                                        <p><i className="bi bi-people"></i> Capacity: {room.capacity} people</p>
                                    </div>
                                </div>
                            </div>

                            <div className='p-6 pt-3'>
                                <button onClick={() => navigate(`/bookings/new?roomId=${room.id}`)} disabled={!room.isAvailable}
                                    className={`${room.isAvailable ? 'bg-green-500 hover:bg-green-600' : 'bg-red-400 cursor-none'} mt-4 w-full  text-white py-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed`}>
                                    {room.isAvailable ? 'Book Now' : 'Unavailable to Book'}
                                </button>
                            </div>
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