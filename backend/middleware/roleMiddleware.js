const rolesMiddleware = (...allowedRoles) => {
    return (req, res, next) => {
        console.log('ROLES_MIDDLEWARE: Executing. User role in req.user:', req.user?.role, 'Allowed roles:', allowedRoles); 

        if (!req.user || !req.user.role) {
            console.log('ROLES_MIDDLEWARE: req.user or req.user.role is missing. Denying access (403).'); 
            return res.status(403).json({ msg: 'Forbidden: User role not found or not authenticated.' });
        }

        const hasPermission = allowedRoles.includes(req.user.role);

        if (hasPermission) {
            console.log('ROLES_MIDDLEWARE: User has required permission. Proceeding to next().'); 
            next(); 
        } else {
            console.log('ROLES_MIDDLEWARE: User role "'+ req.user.role +'" does NOT have required permission. Denying access (403).'); 
            res.status(403).json({ msg: 'Forbidden: You do not have the required role to access this resource.' });
        }
    };
};

module.exports = rolesMiddleware;
