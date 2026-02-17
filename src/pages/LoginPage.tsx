import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [shouldNavigate, setShouldNavigate] = useState(false);
    const navigate = useNavigate();

    // For redirecting to dasboard after successful login
    useEffect(() => {
        if (shouldNavigate) {
            const timerId = setTimeout(() => {
                navigate('/dashboard');
            }, 2000);

            return () => clearTimeout(timerId);
        }
    }, [shouldNavigate, navigate]);

    // Handle form submission, nice
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();     // Prevent page error
        setError('');                   // Clear previous errors <- I kinda want to  work with stuff like this
        setLoading(true);       // Show loading state

        try {
            // API Calling (Insert API Call meme)
            const baseUrl = import.meta.env.VITE_API_BASE_URL;

            const response = await fetch(`${baseUrl}/Auth/login`, {       // So easy
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

            // alert('Login sucessful! Token saved.');
            console.log('User: ', data.user);

            setSuccess('Login successful!');
            setShouldNavigate(true);  

        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-screen flex flex-col items-center justify-center bg-linear-to-br from-green-500 to-red-300">
            <div className="bg-white border-4 border-stone-700 hover:-translate-2 hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] p-8 rounded-4xl w-full max-w-md transition duration-300 ">
                <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                    Allocella
                </h1>
                <h4 className="text-2xl -translate-y-3 text-gray-500 text-center">
                    Login
                </h4>

                {/* ERROR & SUCESS MESSAGEEEEE */}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                        {success}
                    </div>
                )}

                {/* FORM */}
                <form onSubmit={handleSubmit} className="space-y-4">
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
                            placeholder="student@allocella.edu"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="••••••••"
                        />
                    </div>

                    <button type="submit" disabled={loading} className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                        {loading ? 'Logging in...' : 'Login'}
                    </button>

                    <p className="text-center">Already Have an Account? <a href="/register" className="text-green-700">Register</a></p>
                </form>
            </div>

            <div className="fixed bottom-10 left-1/2 -translate-x-1/2">
                <a href={import.meta.env.VITE_API_BASE_URL + '/swagger'} target="_blank" className="text-green-700 hover:text-green-900 cursor-pointer">
                    [ API Documentation ]
                </a>
            </div>
        </div>
    );
}