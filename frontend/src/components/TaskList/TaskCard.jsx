import React from 'react';
const TaskCard = ({ task, onTaskUpdate, isUpdating }) => {
    const formattedDeadline = task.deadline ? new Date(task.deadline).toLocaleDateString() : 'No Deadline';
    const statusColorClass = {
        'new': 'text-blue-400',
        'active': 'text-yellow-400',
        'completed': 'text-green-400',
        'failed': 'text-red-400',
    };
    const handleStatusUpdate = (newStatus) => {
        if (onTaskUpdate && task._id) {
            onTaskUpdate(task._id, newStatus);
        }
    };

    return (
        <div className='flex-shrink-0 w-full  bg-slate-800 rounded-xl p-6 shadow-xl flex flex-col justify-between transform hover:scale-[1.02] transition duration-300 ease-in-out border border-slate-700 font-inter'>
            <div className='flex justify-between items-center mb-3'>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold
                    ${task.priority === 'High' ? 'bg-red-700' :
                       task.priority === 'Medium' ? 'bg-yellow-700' : 'bg-green-700'} text-white`}>
                    {task.priority} Priority
                </span>
                <span className='text-sm text-gray-300'>Due: {formattedDeadline}</span>
            </div>
            <h2 className='mt-3 text-2xl font-bold text-white mb-2'>{task.title || 'N/A'}</h2>
            <p className='text-sm text-gray-300 mb-4'>{task.description || 'No description provided.'}</p>

            <div className='flex items-center justify-between mb-4'>
                <span className={`text-md font-bold uppercase ${statusColorClass[task.status] || 'text-gray-400'}`}>
                    Status: {task.status}
                </span>
            </div>
            {task.status === 'new' && (
                <div className='mt-auto pt-4 border-t border-slate-700'>
                    <button
                        onClick={() => handleStatusUpdate('active')}
                        className='w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold py-2 px-4 text-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
                        disabled={isUpdating} 
                    >
                        {isUpdating ? 'Accepting...' : 'Accept Task'}
                    </button>
                </div>
            )}

            {task.status === 'active' && (
                <div className='flex justify-between mt-auto pt-4 border-t border-slate-700'>
                    <button
                        onClick={() => handleStatusUpdate('completed')}
                        className='flex-1 mr-2 bg-green-600 hover:bg-green-700 rounded-lg font-semibold py-2 px-4 text-md text-white transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
                        disabled={isUpdating}
                    >
                        ✅ Mark as Completed
                    </button>
                    <button
                        onClick={() => handleStatusUpdate('failed')}
                        className='flex-1 ml-2 bg-red-600 hover:bg-red-700 rounded-lg font-semibold py-2 px-4 text-md text-white transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
                        disabled={isUpdating}
                    >
                        ❌ Mark as Failed
                    </button>
                </div>
            )}

            {(task.status === 'completed' || task.status === 'failed') && (
                <div className='mt-auto pt-4 border-t border-slate-700'>
                    <button disabled className={`w-full text-white rounded-lg font-semibold py-2 px-4 text-md cursor-not-allowed
                        ${task.status === 'completed' ? 'bg-green-700' : 'bg-red-700'}`}>
                        {task.status === 'completed' ? '✅ Task Completed' : '❌ Task Failed'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default TaskCard;
