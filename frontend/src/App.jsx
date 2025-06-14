import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import AdminDashboard from './components/Dashboard/AdminDashboard';
import EmployeeDashboard from './components/Dashboard/EmployeeDashboard';
import Home from './components/Home.jsx'; 


const getUserFromLocalStorage = () => {
    try {
        const user = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        if (user && token) {
            return { user: JSON.parse(user), token };
        }
    } catch (error) {
        console.error("Failed to retrieve user from localStorage:", error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    }
    return null;
};

function App() {
    // userAuth will store { user: userData, token: jwtToken }
    const [userAuth, setUserAuth] = useState(null);

    useEffect(() => {
        const savedAuthData = getUserFromLocalStorage();
        if (savedAuthData) {
            setUserAuth(savedAuthData);
        }
    }, []);

    const handleLogin = (userData, token) => {
        setUserAuth({ user: userData, token });
    };

    const handleLogout = () => {
        setUserAuth(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
    };

    const isAuthenticated = !!userAuth?.user && !!userAuth?.token;
    const isAdmin = isAuthenticated && userAuth.user.role === 'admin';
    const isEmployee = isAuthenticated && userAuth.user.role === 'employee';

    return (
        <Routes>
            <Route
                path="/"
                element={
                    isAuthenticated ? (
                        isAdmin ? <Navigate to="/admin" /> : <Navigate to="/employee" />
                    ) : (
                        <Home /> 
                    )
                }
            />

            <Route path="/login" element={isAuthenticated ? <Navigate to={isAdmin ? "/admin" : "/employee"} /> : <Login handleLogin={handleLogin} />} />
            <Route path="/signup" element={isAuthenticated ? <Navigate to={isAdmin ? "/admin" : "/employee"} /> : <Signup handleLogin={handleLogin} />} />

            <Route
                path="/admin"
                element={
                    isAdmin ? (
                        <AdminDashboard user={userAuth.user} token={userAuth.token} handleLogout={handleLogout} />
                    ) : isAuthenticated ? (
                        <Navigate to="/employee" replace /> 
                    ) : (
                        <Navigate to="/login" replace /> 
                    )
                }
            />

            <Route
                path="/employee"
                element={
                    isEmployee || isAdmin ? ( 
                        <EmployeeDashboard user={userAuth.user} token={userAuth.token} handleLogout={handleLogout} />
                    ) : isAuthenticated ? (
                        <Navigate to="/unauthorized" replace /> 
                    ) : (
                        <Navigate to="/login" replace /> 
                    )
                }
            />

            <Route path="/unauthorized" element={<div className="flex items-center justify-center min-h-screen bg-gray-900 text-red-500 text-3xl">Access Denied: You do not have permission to view this page.</div>} />

            <Route path="*" element={<h1 className="text-center mt-10 text-red-500">404 - Not Found</h1>} />
        </Routes>
    );
}

export default App;
