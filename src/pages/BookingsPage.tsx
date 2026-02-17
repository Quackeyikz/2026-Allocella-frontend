import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';

interface Booking {
    id: number;
    roomId: number;
    roomName: string;
    startTime: string;
    endTime: string;
    purpose: string;
    status: string;
}

export default function BookingsPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const roomId = searchParams.get('roomId');

    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(!!roomId);

    const [formData, setFormData] = useState({
        roomId: roomId || '',
        startTime: '',
        endTime: '',
        purpose: '',
    });

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        if (!showForm) {
            fetchBookings();
        }
    }, [navigate, showForm]);

    const fetchBookings = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/Bookings`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) throw new Error('Failed to fetch bookings');

            const data = await response.json();
            setBookings(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const startDateTime = new Date(formData.startTime).toISOString();
            const endDateTime = new Date(formData.endTime).toISOString();

            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/Bookings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    roomId: parseInt(formData.roomId),
                    startTime: startDateTime,
                    endTime: endDateTime,
                    purpose: formData.purpose,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Booking failed');
            }

            setShowForm(false);
            setFormData({ roomId: '', startTime: '', endTime: '', purpose: '' });
            fetchBookings();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    if (loading && !showForm) {
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
                <div className="mb-8 flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition"
                    >
                        {showForm ? 'View Bookings' : 'New Booking'}
                    </button>
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                {showForm ? (
                    <div className="bg-white p-8 rounded-lg shadow max-w-2xl">
                        <h2 className="text-2xl font-bold mb-6">Create New Booking</h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Room ID</label>
                                <input
                                    type="number"
                                    value={formData.roomId}
                                    onChange={(e) => setFormData({ ...formData, roomId: e.target.value })}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                                <input
                                    type="datetime-local"
                                    value={formData.startTime}
                                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                                <input
                                    type="datetime-local"
                                    value={formData.endTime}
                                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Purpose</label>
                                <textarea
                                    value={formData.purpose}
                                    onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                                    required
                                    rows={4}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Describe the purpose of this booking..."
                                />
                            </div>

                            <button
                                type="submit"
                                // disabled={loading}
                                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg transition disabled:opacity-50"
                            >
                                {/* {loading ? 'Creating...' : 'Create Booking'} */}
                                Create Booking
                            </button>
                        </form>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {bookings.map((booking) => (
                            <div key={booking.id} className="bg-white p-6 rounded-lg shadow">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900">{booking.roomName}</h3>
                                        <p className="text-gray-600">{booking.purpose}</p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-sm ${booking.status === 'approved' ? 'bg-green-100 text-green-800' :
                                            booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-red-100 text-red-800'
                                        }`}>
                                        {booking.status}
                                    </span>
                                </div>

                                <div className="text-sm text-gray-600">
                                    <p>🕐 Start: {new Date(booking.startTime).toLocaleString()}</p>
                                    <p>🕐 End: {new Date(booking.endTime).toLocaleString()}</p>
                                </div>
                            </div>
                        ))}

                        {bookings.length === 0 && (
                            <div className="text-center py-12 text-gray-500">
                                No bookings yet. Create your first booking!
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}