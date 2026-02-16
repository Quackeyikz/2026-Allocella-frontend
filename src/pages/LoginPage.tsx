import { useState } from "react";

//  Hi! Welcome to Login Page, this is the place where I learn Typescript and React together. 
//  Comments are solely provided by me!
//  ~ Quackeyikz

// Login response information
interface LoginResponse {
    token: string;
    user: {
        id: number;
        email: string;
        fullName: string;
        role: string;
    };
}

export default function LoginPage() {
    // React State huh? It stores form inputs
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Handle form submission, nice
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();     // Prevent page error
        setError('');                   // Clear previous errors <- I kinda want to  work with stuff like this
        setLoading(true);       // Show loading state

        try {
            // API Calling (Insert API Call meme)
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/Auth/login`, {       // So easy
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Login failed');
            }

            // Parsing response as 'LoginResponse' (above)
            const data: LoginResponse = await response.json();

            // Save it to local Storage
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            alert('Login sucessful! Token saved.');
            console.log('User: ', data.user);

        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-500 to-purple-600">
            <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md">
                <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                    🏢 Allocella Login
                </h1>

                {/* ERROR MESSAGE: Conditional rendering */}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                {/* FORM */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* EMAIL INPUT */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="student@university.edu"
                        />
                    </div>

                    {/* PASSWORD INPUT */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="••••••••"
                        />
                    </div>

                    {/* SUBMIT BUTTON */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
}