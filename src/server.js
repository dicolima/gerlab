// src/server.js
const express = require('express');
const session = require('express-session');
const path = require('path');
const usuarioRoutes = require('./routes/usuarioRoutes');
const predioRoutes = require('./routes/predioRoutes');
const laboratorioRoutes = require('./routes/laboratorioRoutes');
const professorRoutes = require('./routes/professorRoutes');
const faculdadeRoutes = require('./routes/faculdadeRoutes');
const disciplinaRoutes = require('./routes/disciplinaRoutes');
const programaRoutes = require('./routes/programaRoutes');
const professorDisciplinaRoutes = require('./routes/professorDisciplinaRoutes');

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));
app.use(session({
    secret: process.env.JWT_SECRET || '9aab63fa08ae5db583',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
    }
}));

// Ignorar requisições /.well-known
app.use((req, res, next) => {
    if (req.url.startsWith('/.well-known')) {
        return res.status(404).end();
    }
    console.log(`Recebida requisição: ${req.method} ${req.url}`);
    next();
});

// Routes
app.use('/', usuarioRoutes);
app.use('/api/predios', predioRoutes);
app.use('/api/laboratorios', laboratorioRoutes);
app.use('/api/professores', professorRoutes);
app.use('/api/faculdades', faculdadeRoutes);
app.use('/api/disciplinas', disciplinaRoutes);
app.use('/api/programas', programaRoutes);
app.use('/api/professor-disciplinas', professorDisciplinaRoutes);


// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('Registered routes:');
    console.log('- POST /login (Usuario Routes)');
    console.log('- GET /api/usuarios/user (Usuario Routes)');
    console.log('- Other routes at /api/* (predios, laboratorios, professores, etc.)');
});

