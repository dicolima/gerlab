const express = require('express');
const ReservaController = require('../controllers/reservaController');

const router = express.Router();

router.post('/consultar_reservas', (req, res, next) => {
  console.log('Rota /consultar_reservas chamada');
  ReservaController.consultarReservas(req, res, next);
});

module.exports = router;