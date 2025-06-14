import React from 'react';
const TaskCardAdmin = ({ task, onDelete, onUpdateStatus }) => {
    const formattedDeadline = task.deadline ? new Date(task.deadline).toLocaleDateString() : 'No Deadline';

    const statusColorClass = {
        'new': 'text-blue-400',
        'active': 'text-yellow-400',
        'completed': 'text-green-400',
        'failed': 'text-red-400',
    };

    return (
        <div className='flex-shrink-0 w-full bg-slate-800 rounded-xl p-6 shadow-xl flex flex-col justify-between transform hover:scale-[1.02] transition duration-300 ease-in-out border border-slate-700 font-inter'>
            <div className='flex justify-between items-center mb-3'>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold
                    ${task.priority === 'High' ? 'bg-red-700' :
                       task.priority === 'Medium' ? 'bg-yellow-700' : 'bg-green-700'} text-white`}>
                    {task.priority} Priority
                </span>
                <span className='text-sm text-gray-300'>Due: {formattedDeadline}</span>
            </div>

            <h2 className='mt-3 text-2xl font-bold text-white mb-2'>{task.title || 'N/A Title'}</h2>
            <p className='text-sm text-gray-300 mb-4'>{task.description || 'No description provided.'}</p>

            <div className='flex items-center justify-between mb-4'>
                <span className={`text-md font-bold uppercase ${statusColorClass[task.status] || 'text-gray-400'}`}>
                    Status: {task.status}
                </span>
                {task.assignedTo && (
                    <span className='text-sm text-gray-400'>
                        Assigned To: {task.assignedTo.name || 'Unassigned'}
                    </span>
                )}
            </div>

            <div className='mt-auto pt-4 border-t border-slate-700 flex flex-col sm:flex-row gap-3'>
                <button
                    onClick={() => onUpdateStatus(task._id, task.status)}
                    className='flex-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold py-2 px-4 text-md transition duration-200 shadow-md'
                >
                    Update Status
                </button>
                <button
                    onClick={() => onDelete(task._id)}
                    className='flex-1 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold py-2 px-4 text-md transition duration-200 shadow-md'
                >
                    Delete
                </button>
            </div>
        </div>
    );
};

export default TaskCardAdmin;
