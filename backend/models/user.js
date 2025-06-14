const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); 

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'], 
        trim: true 
    },
    email: {
        type: String,
        required: [true, 'Email is required'], 
        unique: true, 
        trim: true,
        lowercase: true, 
        match: [/.+@.+\..+/, 'Please use a valid email address'] 
    },
    password: {
        type: String,
        required: [true, 'Password is required'], 
        minlength: [6, 'Password must be at least 6 characters long'] 
    },
    role: {
        type: String,
        enum: ['admin', 'employee'],
        default: 'employee' 
    }
}, {
    timestamps: true 
});

userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt); 
    }
    next(); 
});

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
