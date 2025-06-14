
    import React, { useState } from 'react';
    import api from '../../utils/api'; 
    import { useNavigate } from 'react-router-dom';

    const Signup = ({ handleLogin }) => { 
        const [name, setName] = useState('');
        const [email, setEmail] = useState('');
        const [password, setPassword] = useState('');
        const [role, setRole] = useState('employee'); 
        const [errorMessage, setErrorMessage] = useState('');
        const [successMessage, setSuccessMessage] = useState('');
        const [isLoading, setIsLoading] = useState(false);
        const navigate = useNavigate();

        const handleSubmit = async (e) => {
            e.preventDefault();
            setErrorMessage('');
            setSuccessMessage('');
            setIsLoading(true);

            try {
              
                const res = await api.post('/api/auth/register', { name, email, password, role });

                setSuccessMessage('Signup successful!');
                if (handleLogin) {
                    localStorage.setItem('user', JSON.stringify(res.data.user));
                    localStorage.setItem('token', res.data.token);
                    handleLogin(res.data.user, res.data.token); 
                    if (res.data.user.role === 'admin') {
                        navigate('/admin');
                    } else {
                        navigate('/employee');
                    }
                } else {
                    setTimeout(() => navigate('/login'), 1500);
                }

            } catch (err) {
                console.error('Signup error:', err);
                setErrorMessage(err.response?.data?.msg || 'Signup failed. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };

        return (
            <div className="flex items-center justify-center min-h-screen bg-[url('/background.jpeg')] bg-no-repeat bg-gray-900
                    bg-cover bg-center bg-fixed text-white font-inter">
                <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-lg shadow-xl space-y-6 w-full max-w-md">
                    <h2 className="text-3xl font-bold text-center text-white">Signup</h2>

                    {successMessage && (
                        <div className="bg-green-500 text-white p-3 rounded mb-4 text-center" role="status">
                            {successMessage}
                        </div>
                    )}
                    {errorMessage && (
                        <div className="bg-red-500 text-white p-3 rounded mb-4 text-center" role="alert">
                            {errorMessage}
                        </div>
                    )}

                    <div>
                        <label htmlFor="name" className="block text-white text-sm font-medium mb-2">Name</label>
                        <input
                            type="text"
                            id="name"
                            placeholder="Your Name"
                            className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 text-white border-gray-600 focus:border-blue-500"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-white text-sm font-medium mb-2">Email</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="Your Email"
                            className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 text-white border-gray-600 focus:border-blue-500"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-white text-sm font-medium mb-2">Password</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Your Password"
                            className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 text-white border-gray-600 focus:border-blue-500"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <div>
                        <label htmlFor="role" className="block text-white text-sm font-medium mb-2">Role</label>
                        <select
                            id="role"
                            className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 text-white border-gray-600 focus:border-blue-500"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            disabled={isLoading}
                        >
                            <option value="employee">Employee</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-200 w-full disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Signing Up...' : 'Signup'}
                    </button>

                    <p className="text-sm text-center text-gray-400 mt-4">
                        Already have an account? <a href="/login" className="text-blue-400 hover:underline">Login here</a>
                    </p>
                </form>
            </div>
        );
    };

    export default Signup;
    