import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';

interface Booking {
    id: number;
    roomId: number;
    roomName: string;
    userName: string;
    userEmail: string;
    startTime: string;
    endTime: string;
    purpose: string;
    status: 'pending' | 'approved' | 'rejected';
    createdAt: string;
}

export default function AdminAllBookingsPage() {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Check if user is admin
    useEffect(() => {
        const userStr = localStorage.getItem('user');
        const user = userStr ? JSON.parse(userStr) : null;

        if (!user || user.role !== 'admin') {
            navigate('/dashboard');
            return;
        }

        fetchAllBookings();
    }, [navigate]);

    // Fetch all bookings
    const fetchAllBookings = async () => {
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

    // Approve booking
    const handleApprove = async (bookingId: number) => {
        const comment = prompt('Approval reason (optional):');

        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/Bookings/${bookingId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    status: 'approved',
                    comment: comment || undefined
                })
            });

            if (!response.ok) throw new Error('Failed to approve booking');

            // Refresh bookings list
            fetchAllBookings();
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Failed to approve booking');
        }
    };

    // Reject booking
    const handleReject = async (bookingId: number) => {
        const comment = prompt('Rejection reason (optional):');

        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/Bookings/${bookingId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    status: 'rejected',
                    comment: comment || undefined
                })
            });

            if (!response.ok) throw new Error('Failed to reject booking');

            // Refresh bookings list
            fetchAllBookings();
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Failed to reject booking');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen min-w-screen bg-gray-50">
            <Navbar />

            <main className="container mx-auto px-4 py-8">
                <div className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                            👑 All Bookings (Admin)
                        </h1>
                        <p className="text-gray-600 mt-2">Manage all system bookings - Approve or Reject pending requests</p>
                    </div>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition"
                    >
                        ← Back to Dashboard
                    </button>
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                        {error}
                    </div>
                )}

                <div className="mb-4 text-sm text-gray-600">
                    Total Bookings: <strong>{bookings.length}</strong> |
                    Pending: <strong className="text-yellow-600">{bookings.filter(b => b.status === 'pending').length}</strong> |
                    Approved: <strong className="text-green-600">{bookings.filter(b => b.status === 'approved').length}</strong> |
                    Rejected: <strong className="text-red-600">{bookings.filter(b => b.status === 'rejected').length}</strong>
                </div>

                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purpose</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {bookings.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                                            No bookings found in the system.
                                        </td>
                                    </tr>
                                ) : (
                                    bookings.map((booking) => (
                                        <tr key={booking.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                #{booking.id}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{booking.roomName}</div>
                                                <div className="text-sm text-gray-500">Room ID: {booking.roomId}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{booking.userName}</div>
                                                <div className="text-sm text-gray-500">{booking.userEmail}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    {new Date(booking.startTime).toLocaleString()}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    to {new Date(booking.endTime).toLocaleString()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-900 max-w-xs truncate" title={booking.purpose}>
                                                    {booking.purpose}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${booking.status === 'approved'
                                                        ? 'bg-green-100 text-green-800'
                                                        : booking.status === 'pending'
                                                            ? 'bg-yellow-100 text-yellow-800'
                                                            : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {booking.status.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                {booking.status === 'pending' ? (
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleApprove(booking.id)}
                                                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded transition text-xs font-semibold"
                                                        >
                                                            ✓ Approve
                                                        </button>
                                                        <button
                                                            onClick={() => handleReject(booking.id)}
                                                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition text-xs font-semibold"
                                                        >
                                                            ✕ Reject
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-400 text-xs">No actions</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}