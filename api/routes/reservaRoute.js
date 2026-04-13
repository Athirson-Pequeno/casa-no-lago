const express    = require('express');
const router     = express.Router();
const { criarReserva, listarReservas, buscarReserva, deletarReserva } =
  require('../controllers/reservaController');
const { checkToken, checkAdmin } = require('../middlewares/authMiddleware');

// Todas as rotas de reserva são privadas (exigem login)
router.post('/',    checkToken, criarReserva);
router.get('/',     checkToken, listarReservas);
router.get('/:id',  checkToken, buscarReserva);
router.delete('/:id', checkToken, checkAdmin, deletarReserva); // Apenas admin pode deletar

module.exports = router;
