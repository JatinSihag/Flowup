const jwt = require("jsonwebtoken");
require('dotenv').config();

const authMiddleware = (req, res, next) => {
    console.log('AUTH_MIDDLEWARE: Executing...'); 
    const authHeader = req.header("Authorization");

    if (!authHeader) {
        console.log('AUTH_MIDDLEWARE: No Authorization header found. Denying access (401).');
        return res.status(401).json({ msg: "No token, authorization denied" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
        console.log('AUTH_MIDDLEWARE: Authorization header found, but no token after "Bearer ". Denying access (401).'); 
        return res.status(401).json({ msg: "No token, authorization denied" });
    }

    try {
        console.log('AUTH_MIDDLEWARE: Verifying token...'); 
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; 
        console.log('AUTH_MIDDLEWARE: Token verified. User ID:', req.user.id, 'Role:', req.user.role); 
        next();
    } catch (err) {
        console.error('AUTH_MIDDLEWARE: Token verification failed:', err.message); 
        res.status(401).json({ msg: "Token is not valid or expired" });
    }
};

module.exports = authMiddleware;
