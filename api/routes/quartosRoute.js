const express    = require('express');
const router     = express.Router();
const { criarQuarto, listarQuartos, buscarQuarto, atualizarQuarto, deletarQuarto } =
  require('../controllers/quartosController');
const { checkToken, checkAdmin } = require('../middlewares/authMiddleware');

// Rotas públicas — qualquer visitante pode ver os quartos
router.get('/',     listarQuartos);
router.get('/:id',  buscarQuarto);

// Rotas privadas — exigem login + ser admin
router.post('/',    checkToken, checkAdmin, criarQuarto);
router.put('/:id',  checkToken, checkAdmin, atualizarQuarto);
router.delete('/:id', checkToken, checkAdmin, deletarQuarto);

module.exports = router;
