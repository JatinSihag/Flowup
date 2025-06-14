const express = require("express");
const router = express.Router(); 
const Task = require("../models/Task");
const authMiddleware = require("../middleware/authMiddleware");
const rolesMiddleware = require("../middleware/rolesMiddleware"); 


router.post('/', authMiddleware, rolesMiddleware('admin'), async (req, res) => {
    const { title, description, deadline, priority, status, assignedTo } = req.body;

    try {
        const task = new Task({
            title,
            description,
            deadline,
            priority,
            status,
            assignedTo,
        });

        await task.save();
        res.status(201).json(task);
    } catch (err) {
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);
            return res.status(400).json({ msg: messages.join(', ') });
        }
        res.status(500).json({ msg: 'Server error during task creation' });
    }
});

router.get("/", authMiddleware, rolesMiddleware('admin'), async (req, res) => {
    try {
        const tasks = await Task.find().populate("assignedTo", "name email");
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ msg: 'Server error fetching all tasks' });
    }
});
router.get('/user/:id', authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
            return res.status(403).json({ msg: 'Forbidden: You can only view your own tasks.' });
        }

        const tasks = await Task.find({ assignedTo: req.params.id }).populate("assignedTo", "name email");
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ msg: 'Server error fetching employee tasks' });
    }
});


router.put('/:id', authMiddleware, async (req, res) => {
    const { status, ...otherUpdates } = req.body;
    const taskId = req.params.id;

    try {
        let task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ msg: 'Task not found' });
        }
        if (req.user.role !== 'admin' && task.assignedTo.toString() !== req.user.id) {
            return res.status(403).json({ msg: 'Forbidden: You are not authorized to update this task.' });
        }
        if (req.user.role === 'employee') {
            if (Object.keys(otherUpdates).length > 0) {
                return res.status(403).json({ msg: 'Forbidden: Employees can only update task status.' });
            }
            if (status) {
                task.status = status;
            }
        } else if (req.user.role === 'admin') {
            Object.assign(task, req.body);
        }

        const updatedTask = await task.save();
        res.json(updatedTask);
    } catch (err) {
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);
            return res.status(400).json({ msg: messages.join(', ') });
        }
        res.status(500).json({ msg: 'Server error updating task' });
    }
});
router.delete('/:id', authMiddleware, rolesMiddleware('admin'), async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) {
            return res.status(404).json({ msg: 'Task not found' });
        }
        res.json({ msg: 'Task removed successfully' });
    } catch (err) {
        res.status(500).json({ msg: 'Server error deleting task' });
    }
});

module.exports = router;
