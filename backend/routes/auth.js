
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");
const rolesMiddleware = require("../middleware/rolesMiddleware"); 

router.post('/register', async (req, res) => {
    console.log('AUTH_ROUTE: /register hit (POST). Body:', req.body); 
    const { name, email, password, role } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: "User with this email already exists" });
        }

        user = new User({ name, email, password, role });
        await user.save();
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.status(201).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        console.error('AUTH_ROUTE: /register - Error during registration:', err.message); 
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);
            return res.status(400).json({ msg: messages.join(', ') });
        }
        res.status(500).json({ msg: 'Server error during registration' });
    }
});


router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {

            return res.status(400).json({ msg: "Invalid credentials" });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(400).json({ msg: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        res.status(500).json({ msg: 'Server error during login' });
    }
});

router.get("/users", authMiddleware, rolesMiddleware('admin'), async (req, res) => {
    try {

        const employees = await User.find({ role: "employee" }).select("-password");
        res.json(employees);
    } catch (err) {
        res.status(500).json({ msg: 'Server error fetching employees' });
    }
});

router.get('/current', authMiddleware, async (req, res) => {

    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {

            return res.status(404).json({ msg: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ msg: 'Server error fetching current user' });
    }
});

module.exports = router;
