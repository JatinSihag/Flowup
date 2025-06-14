    import React, { useEffect, useState } from 'react';
    import api from '../../utils/api'; 
    import { useNavigate } from 'react-router-dom';

    import Header from '../others/Header.jsx';
    import AllTasks from '../others/AllTasks.jsx'; 
    import TaskListNumbers from '../others/TaskListNumbers.jsx'; 

    const AdminDashboard = ({ user, token, handleLogout }) => {
        const [title, setTitle] = useState('');
        const [description, setDescription] = useState('');
        const [deadline, setDeadline] = useState('');
        const [priority, setPriority] = useState('Medium');
        const [assignedTo, setAssignedTo] = useState('');
        const [employees, setEmployees] = useState([]);
        const [tasks, setTasks] = useState([]);
        const [loading, setLoading] = useState(true);
        const [errorMessage, setErrorMessage] = useState('');
        const [successMessage, setSuccessMessage] = useState('');
        const [isCreatingTask, setIsCreatingTask] = useState(false);
        const [overallTaskCounts, setOverallTaskCounts] = useState({
            'new': 0,
            'active': 0,
            'completed': 0,
            'failed': 0,
        });

        const navigate = useNavigate();
        const fetchEmployees = async () => {
            try {
                const res = await api.get('/api/auth/users');
                if (Array.isArray(res.data)) {
                    setEmployees(res.data);
                } else {
                    console.error("API response for employees is not an array:", res.data);
                    setEmployees([]);
                    setErrorMessage('Failed to load employees: Invalid data format.');
                }
            } catch (err) {
                console.error("Error fetching employees:", err);
                setErrorMessage(err.response?.data?.msg || 'Error fetching employees.');
            }
        };

        const fetchTasks = async () => {
            try {
                const res = await api.get("/api/task");
                if (Array.isArray(res.data)) {
                    setTasks(res.data);
                } else {
                    console.error("API response for tasks is not an array:", res.data);
                    setTasks([]);
                    setErrorMessage('Failed to load tasks: Invalid data format.');
                }
            } catch (err) {
                console.error("API error fetching tasks:", err);
                setErrorMessage(err.response?.data?.msg || 'Error fetching tasks.');
            }
        };

        useEffect(() => {
            const loadData = async () => {
                setLoading(true);
                setErrorMessage('');
                setSuccessMessage('');
                await fetchEmployees();
                await fetchTasks();
                setLoading(false);
            };
            loadData();
        }, []); 

        useEffect(() => {
            const counts = { 'new': 0, 'active': 0, 'completed': 0, 'failed': 0 };
            tasks.forEach(task => {
                if (counts.hasOwnProperty(task.status)) { 
                    counts[task.status] += 1;
                }
            });
            setOverallTaskCounts(counts);
        }, [tasks]); 


        const handleCreateTask = async (e) => {
            e.preventDefault(); 
            setErrorMessage('');
            setSuccessMessage('');
            setIsCreatingTask(true);

            if (!title || !description || !deadline || !assignedTo) {
                setErrorMessage('All task fields (Title, Description, Deadline, Assign To) are required.');
                setIsCreatingTask(false);
                return;
            }

            try {
     
                await api.post('/api/task', {
                    title,
                    description,
                    deadline,
                    priority,
                    assignedTo,
                });
                setSuccessMessage('Task created successfully!');
            
                setTitle('');
                setDescription('');
                setDeadline('');
                setAssignedTo('');
                setPriority('Medium');
                fetchTasks(); 
            } catch (err) {
                console.error('Task creation failed:', err);
                setErrorMessage(err.response?.data?.msg || 'Task creation failed. Please check your input.');
            } finally {
                setIsCreatingTask(false);
            }
        };

        const handleLogoutClick = () => {
            handleLogout(); 
            navigate('/login');
        };

        const handleDeleteTask = async (taskId) => {
          
            if (window.confirm("Are you sure you want to delete this task?")) {
                try {
                    await api.delete(`/api/task/${taskId}`);
                    setSuccessMessage('Task deleted successfully!');
                    fetchTasks(); 
                } catch (err) {
                    console.error('Error deleting task:', err);
                    setErrorMessage(err.response?.data?.msg || 'Failed to delete task.');
                }
            }
        };

        const handleUpdateTaskStatus = async (taskId, currentStatus) => {

            const newStatus = prompt(`Enter new status for task (current: ${currentStatus}): new, active, completed, failed`);
            if (newStatus && ['new', 'active', 'completed', 'failed'].includes(newStatus.toLowerCase())) {
                try {
                    await api.put(`/api/task/${taskId}`, { status: newStatus.toLowerCase() });
                    setSuccessMessage('Task status updated successfully!');
                    fetchTasks(); 
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
                <div className='flex items-center justify-center min-h-screen bg-[#0f172a] text-white'>
                    <p className="text-2xl">Loading Admin Dashboard...</p>
                </div>
            );
        }


        if (!user || user.role !== 'admin') {
            return (
                <div className='flex items-center justify-center min-h-screen bg-[#0f172a] text-red-400'>
                    <p className="text-2xl">Access Denied: You must be an administrator to view this page.</p>
                </div>
            );
        }

        return (
            <div className="p-8 text-white min-h-screen bg-[url('/background.jpeg')] bg-no-repeat bg-gray-900
                    bg-cover bg-center bg-fixed font-inter">
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

                <TaskListNumbers taskCounts={overallTaskCounts} />

                <div className='bg-[#1e293b] p-8 rounded-xl shadow-2xl mb-12 mt-8'>
                    <h3 className='text-2xl font-semibold mb-6 text-blue-300'>Create New Task</h3>
                    <form onSubmit={handleCreateTask} className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                        <input
                            className='p-3 rounded-lg bg-slate-800 text-white border border-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder='Task Title'
                            required
                            disabled={isCreatingTask}
                        />
                        <input
                            className='p-3 rounded-lg bg-slate-800 text-white border border-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder='Task Description'
                            required
                            disabled={isCreatingTask}
                        />
                        <input
                            type='date'
                            className='p-3 rounded-lg bg-slate-800 text-white border border-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                            value={deadline}
                            onChange={(e) => setDeadline(e.target.value)}
                            required
                            disabled={isCreatingTask}
                        />
                        <select
                            className='p-3 rounded-lg bg-slate-800 text-white border border-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                            value={priority}
                            onChange={(e) => setPriority(e.target.value)}
                            disabled={isCreatingTask}
                        >
                            <option value="Low">Low Priority</option>
                            <option value="Medium">Medium Priority</option>
                            <option value="High">High Priority</option>
                        </select>
                        <select
                            className='p-3 rounded-lg bg-slate-800 text-white border border-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                            value={assignedTo}
                            onChange={(e) => setAssignedTo(e.target.value)}
                            required
                            disabled={isCreatingTask}
                        >
                            <option value=''>-- Assign to Employee --</option>
                            {employees.map(emp => (
                                <option key={emp._id} value={emp._id}>{emp.name} ({emp.email})</option>
                            ))}
                        </select>
                        <button
                            type="submit"
                            className='col-span-full mt-4 px-8 py-3 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-white font-semibold text-lg transition duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed'
                            disabled={isCreatingTask}
                        >
                            {isCreatingTask ? 'Creating Task...' : 'Create Task'}
                        </button>
                    </form>
                </div>

                <AllTasks />

            </div>
        );
    };

    export default AdminDashboard;
    