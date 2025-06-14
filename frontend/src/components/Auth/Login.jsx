    import React, { useState } from 'react';
    import { useNavigate } from 'react-router-dom';
    import api from '../../utils/api'; 

    const Login = ({ handleLogin }) => {
        const [email, setEmail] = useState('');
        const [password, setPassword] = useState('');
        const [errorMessage, setErrorMessage] = useState('');
        const [isLoading, setIsLoading] = useState(false);
        const navigate = useNavigate();

        const handleSubmit = async (e) => {
            e.preventDefault();
            setErrorMessage('');
            setIsLoading(true);

            try {
                const res = await api.post('/api/auth/login', { email, password });

                localStorage.setItem('user', JSON.stringify(res.data.user));
                localStorage.setItem('token', res.data.token);

                handleLogin(res.data.user, res.data.token); 

                if (res.data.user.role === 'admin') {
                    navigate('/admin');
                } else {
                    navigate('/employee');
                }
            } catch (err) {
                console.error('Login error:', err);
                setErrorMessage(err.response?.data?.msg || 'Login failed. Please check your credentials.');
            } finally {
                setIsLoading(false);
            }
        };

        return (
            <div className="flex items-center justify-center min-h-screen bg-[url('/background.jpeg')] bg-no-repeat bg-gray-900
                    bg-cover bg-center bg-fixed font-inter">
                <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md">
                    <h2 className="text-3xl font-bold text-white mb-6 text-center">Login</h2>

                    {errorMessage && (
                        <div className="bg-red-500 text-white p-3 rounded mb-4 text-center" role="alert">
                            {errorMessage}
                        </div>
                    )}

                    <div className="mb-4">
                        <label htmlFor="email" className="block text-white text-sm font-medium mb-2">Email</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="Enter your email"
                            className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 text-white border-gray-600 focus:border-blue-500"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="password" className="block text-white text-sm font-medium mb-2">Password</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Enter your password"
                            className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 text-white border-gray-600 focus:border-blue-500"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-200 w-full disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Logging In...' : 'Login'}
                        </button>
                    </div>
                    <p className="text-sm text-center text-gray-400 mt-4">
                        Don't have an account? <a href="/signup" className="text-blue-400 hover:underline">SignUp here</a>
                    </p>
                </form>
            </div>
        );
    };

    export default Login;
    