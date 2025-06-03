// src/routes/reservaRoutes.js
const express = require('express');
const router = express.Router();
const path = require('path');
const ReservaController = require('../controllers/reservaController');
const authMiddleware = require('../middlewares/authMiddleware');

// router.get('/consultar_reservas.html', authMiddleware, (req, res) => {
//   res.sendFile(path.join(__dirname, '../../public/consultar_reservas.html'));
// });

router.get('/consultar_reservas.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/consultar_reservas.html'));
});

// router.post('/consultar_reservas', authMiddleware, (req, res) => {
//   ReservaController.consultarReservas(req, res);
// });

router.post('/consultar_reservas', (req, res) => {
  ReservaController.consultarReservas(req, res);
});

router.get('/lista_presenca.html', authMiddleware, (req, res) => {
  console.log('Acessando /lista_presenca.html');
  res.sendFile(path.join(__dirname, '../../public/lista_presenca.html'));
});

router.post('/lista_presenca', authMiddleware, (req, res) => {
  console.log('Acessando POST /api/reservas/lista_presenca');
  ReservaController.getListaPresenca(req, res);
});

module.exports = router; // EM TESTE PARA IMPRIMIR LISTA

//FUNCIONANDO PERFEITAMENTE
// const express = require('express');
// const ReservaController = require('../controllers/reservaController');

// const router = express.Router();

// router.post('/consultar_reservas', (req, res, next) => {
//   console.log('Rota /consultar_reservas chamada');
//   ReservaController.consultarReservas(req, res, next);
// });

// module.exports = router;