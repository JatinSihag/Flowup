
    import React, { useEffect, useState } from 'react';
    import { useNavigate } from 'react-router-dom';

    const Header = ({ user, handleLogout }) => {
        const [username, setUsername] = useState('User');
        const navigate = useNavigate();

        useEffect(() => {
            if (user) {
                if (user.role === 'admin') {
                    setUsername('Admin');
                } else if (user.role === 'employee') {
                    setUsername(user.name || 'Employee'); 
                }
            } else {
                setUsername('Guest'); 
            }
        }, [user]);

        const handleLogoutClick = () => {
            handleLogout(); 
            navigate('/login'); 
        };

        return (
            <div className='flex items-end justify-between p-6 bg-[#1e293b] rounded-xl shadow-lg text-white mb-8 font-inter'>
                <h1 className='text-2xl font-medium'>
                    Hello <br />
                    <span className='text-3xl font-semibold text-pink-400'>{username} 🎀</span>
                </h1>
                <button
                    onClick={handleLogoutClick}
                    className='bg-red-600 hover:bg-red-700 text-lg font-medium text-white px-6 py-2 rounded-md transition duration-200 shadow-md'
                >
                    Log Out
                </button>
            </div>
        );
    };

    export default Header;
    