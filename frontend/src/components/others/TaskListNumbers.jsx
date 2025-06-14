
    import React from 'react';

    const TaskListNumbers = ({ taskCounts }) => {
        if (!taskCounts) return null;
        const taskStats = [
            { label: 'New Tasks', count: taskCounts.new || 0, color: 'bg-red-400' },
            { label: 'Active Tasks', count: taskCounts.active || 0, color: 'bg-yellow-400' },
            { label: 'Completed Tasks', count: taskCounts.completed || 0, color: 'bg-green-400' },
            { label: 'Failed Tasks', count: taskCounts.failed || 0, color: 'bg-purple-400' },
        ];

        return (
            <div className='flex flex-wrap justify-between gap-6 mt-8 font-inter'>
                {taskStats.map((task, index) => (
                    <div
                        key={index}
                        className={`flex-1 min-w-[180px] p-6 rounded-xl shadow-lg transform hover:scale-105 transition duration-300 ease-in-out
                                    ${task.color} text-white flex flex-col justify-center items-center`}
                    >
                        <h2 className='text-4xl font-bold mb-2'>{task.count}</h2>
                        <h3 className='text-lg font-medium text-center'>{task.label}</h3>
                    </div>
                ))}
            </div>
        );
    };

    export default TaskListNumbers;
    