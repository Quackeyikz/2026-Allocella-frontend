import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import RoomsPage from './pages/RoomsPage';
import BookingsPage from './pages/BookingsPage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
	const token = localStorage.getItem('token');
	return token ? <>{children}</> : <Navigate to="/login" replace />;
}

export default function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/login" element={<LoginPage />} />
				<Route path="/register" element={<RegisterPage />} />
				<Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
				<Route path="/rooms" element={<ProtectedRoute><RoomsPage /></ProtectedRoute>} />
				<Route path="/bookings" element={<ProtectedRoute><BookingsPage /></ProtectedRoute>} />
				<Route path="/bookings/new" element={<ProtectedRoute><BookingsPage /></ProtectedRoute>} />
				<Route path="/" element={<Navigate to="/login" replace />} />
			</Routes>
		</BrowserRouter>
	);
}