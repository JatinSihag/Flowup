
import React, { useEffect, useState } from "react";
import api from "../../utils/api";
import { useNavigate } from 'react-router-dom';
import Header from '../others/Header.jsx';
import TaskList from '../TaskList/TaskList.jsx'; 

const EmployeeDashboard = ({ user, token, handleLogout }) => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isUpdatingTask, setIsUpdatingTask] = useState(false);
    const [employeeTaskCounts, setEmployeeTaskCounts] = useState({
        'new': 0,
        'active': 0,
        'completed': 0,
        'failed': 0,
    });

    const navigate = useNavigate();

    const fetchTasks = async () => {
        setErrorMessage('');
        setSuccessMessage('');
        if (!user || !user.id) {
            setErrorMessage("User ID not available to fetch tasks.");
            setLoading(false);
            return;
        }
        try {1 
            const res = await api.get(`/api/task/user/${user.id}`);
            if (Array.isArray(res.data)) {
                const filteredTasks = res.data.filter(task => task.assignedTo?._id === user.id);
                setTasks(filteredTasks);
            } else {
                console.error("API response for tasks is not an array:", res.data);
                setTasks([]);
                setErrorMessage('Failed to load tasks: Invalid data format.');
            }
        } catch (err) {
            console.error("Error fetching tasks:", err);
            setErrorMessage(err.response?.data?.msg || 'Error fetching tasks.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?.role === "employee" && user.id) {
            fetchTasks();
        } else if (!user?.id) {
             setErrorMessage("User details are not fully loaded.");
             setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        const counts = { 'new': 0, 'active': 0, 'completed': 0, 'failed': 0 };
        tasks.forEach(task => {
            if (counts.hasOwnProperty(task.status)) {
                counts[task.status] += 1;
            }
        });
        setEmployeeTaskCounts(counts);
    }, [tasks]);

    const handleLogoutClick = () => {
        handleLogout();
        navigate('/login');
    };

    const handleUpdateTaskStatus = async (taskId, newStatus) => {
        const validStatuses = ['new', 'active', 'completed', 'failed'];

        const confirmedStatus = newStatus || prompt(`Enter new status for task (current: ${tasks.find(t => t._id === taskId)?.status}). Options: ${validStatuses.join(', ')}`);

        if (confirmedStatus) {
            const normalizedStatus = confirmedStatus.toLowerCase();
            if (!validStatuses.includes(normalizedStatus)) {
                setErrorMessage('Invalid status. Please choose from new, active, completed, or failed.');
                return;
            }

            setIsUpdatingTask(true);
            setErrorMessage('');
            setSuccessMessage('');
            try {
                await api.put(`/api/task/${taskId}`, { status: normalizedStatus });
                setSuccessMessage(`Task status updated to '${normalizedStatus}' successfully!`);
                fetchTasks(); 
            } catch (err) {
                console.error('Error updating task status:', err);
                setErrorMessage(err.response?.data?.msg || 'Failed to update task status.');
            } finally {
                setIsUpdatingTask(false);
            }
        }
    };

    if (loading) {
        return (
            <div className='flex items-center justify-center min-h-screen bg-[#0f172a] text-white'>
                <p className="text-2xl">Loading Employee Dashboard...</p>
            </div>
        );
    }

    if (!user || user.role === 'admin') { 
         return (
             <div className='flex items-center justify-center min-h-screen bg-[#0f172a] text-red-400'>
                 <p className="text-2xl">Access Denied or Invalid Role. Please log in as an employee.</p>
             </div>
         );
     }

    return (
        <div className="p-8 text-white bg-[url('/background.jpeg')] bg-no-repeat bg-gray-900
                    bg-cover bg-center bg-fixed min-h-screen font-inter">
            <Header user={user} handleLogout={handleLogout} />

            {errorMessage && (
                <div className="bg-red-500 text-white p-4 rounded-lg mb-6 text-center text-lg shadow-md" role="alert">
                    {errorMessage}
                </div>
            )}
            {successMessage && (
                <div className="bg-green-500 text-white p-4 rounded-lg mb-6 text-center text-lg shadow-md" role="status">
                    {successMessage}
                </div>
            )}
            <div className='bg-[#1e293b] rounded-xl shadow-2xl p-6 mb-8'>
                <h3 className='text-2xl font-semibold mb-6 text-yellow-300'>Your Task Summary</h3>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                    {Object.entries(employeeTaskCounts).map(([status, count]) => (
                        <div
                            key={status}
                            className={`flex-1 p-6 rounded-xl shadow-md text-white flex flex-col items-center justify-center 
                                ${status === 'new' ? 'bg-blue-600' : 
                                   status === 'active' ? 'bg-orange-600' : 
                                   status === 'completed' ? 'bg-green-600' : 
                                   status === 'failed' ? 'bg-red-600' : 'bg-gray-600'} 
                                transform hover:scale-105 transition duration-300 ease-in-out`}
                        >
                            <h4 className='text-4xl font-bold mb-2'>{count}</h4>
                            <p className='text-lg capitalize'>{status} Tasks</p>
                        </div>
                    ))}
                </div>
            </div>

            <TaskList tasks={tasks} onTaskUpdate={handleUpdateTaskStatus} isUpdating={isUpdatingTask} />

        </div>
    );
};

export default EmployeeDashboard;
