import React from 'react';
import TaskCard from './TaskCard.jsx';
const TaskList = ({ tasks, onTaskUpdate, isUpdating }) => {
    return (
        <div className='bg-[#1e293b] rounded-xl shadow-2xl p-6 mt-8 font-inter'>
            <h3 className="text-2xl font-semibold mb-6 text-purple-300">Your Assigned Tasks</h3>
            {tasks.length === 0 ? (
                <div className='text-gray-400 text-lg p-4 text-center'>No tasks assigned yet. Keep up the good work!</div>
            ) : (
                <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'> 
                    {tasks.map((task) => (
                        <TaskCard
                            key={task._id}
                            task={task}
                            onTaskUpdate={onTaskUpdate}
                            isUpdating={isUpdating} 
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default TaskList;
