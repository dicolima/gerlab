// src/middlewares/authMiddleware.js
const authMiddleware = (req, res, next) => {
    if (req.session.user) {
        return next();
    }
    if (req.originalUrl.startsWith('/api')) {
        return res.status(401).json({ error: 'Não autenticado' });
    }
    res.redirect('/login');
};

module.exports = authMiddleware;

