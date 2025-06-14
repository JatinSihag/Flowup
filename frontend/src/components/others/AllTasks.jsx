import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import TaskCardAdmin from './TaskCardAdmin.jsx'; 

const AllTasks = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');


    const fetchAllTasks = async () => {
        setErrorMessage('');
        setSuccessMessage('');
        try {
            const res = await api.get('/api/task');
            if (Array.isArray(res.data)) {
                setTasks(res.data);
            } else {
                console.error("API response for all tasks is not an array:", res.data);
                setTasks([]);
                setErrorMessage('Failed to load all tasks: Invalid data format.');
            }
        } catch (err) {
            console.error("Error fetching all tasks:", err);
            setErrorMessage(err.response?.data?.msg || 'Error fetching all tasks.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllTasks();
    }, []);


    const handleDeleteTask = async (taskId) => {
        if (window.confirm("Are you sure you want to delete this task permanently?")) {
            setErrorMessage('');
            setSuccessMessage('');
            try {
                await api.delete(`/api/task/${taskId}`);
                setSuccessMessage('Task deleted successfully!');
                fetchAllTasks(); 
            } catch (err) {
                console.error('Error deleting task:', err);
                setErrorMessage(err.response?.data?.msg || 'Failed to delete task.');
            }
        }
    };

    const handleUpdateTaskStatus = async (taskId, currentStatus) => {
        const newStatus = prompt(`Enter new status for task (current: ${currentStatus}). Options: new, active, completed, failed`);
        if (newStatus && ['new', 'active', 'completed', 'failed'].includes(newStatus.toLowerCase())) {
            setErrorMessage('');
            setSuccessMessage('');
            try {
                await api.put(`/api/task/${taskId}`, { status: newStatus.toLowerCase() });
                setSuccessMessage('Task status updated successfully!');
                fetchAllTasks(); 
            } catch (err) {
                console.error('Error updating task status:', err);
                setErrorMessage(err.response?.data?.msg || 'Failed to update task status.');
            }
        } else if (newStatus !== null) { 
            setErrorMessage('Invalid status. Please choose from new, active, completed, or failed.');
        }
    };

    if (loading) {
        return (
            <div className='flex items-center justify-center p-4 text-white'>
                <p>Loading all tasks...</p>
            </div>
        );
    }

    return (
        <div className='bg-[#1e293b] rounded-xl shadow-2xl p-6 font-inter'>
            <h3 className='text-2xl font-semibold mb-6 text-orange-300'>All Tasks Overview</h3>

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

            {tasks.length === 0 ? (
                <div className='text-gray-400 text-lg p-4 text-center'>No tasks found in the system. Create one above!</div>
            ) : (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                    {tasks.map((task) => (
                        <TaskCardAdmin
                            key={task._id}
                            task={task}
                            onDelete={handleDeleteTask}
                            onUpdateStatus={handleUpdateTaskStatus}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default AllTasks;
