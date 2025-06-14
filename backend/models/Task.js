const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'], 
        trim: true 
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true
    },
    deadline: {
        type: Date,
        required: [true, 'Deadline is required'] 
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High'], 
        default: 'Medium'
    },
    status: {
        type: String,
        enum: ['new', 'active', 'completed', 'failed'], 
        default: 'new' 
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: [true, 'Assigned user is required']
    }
}, {
    timestamps: true 
});

module.exports = mongoose.model('Task', taskSchema);
