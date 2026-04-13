const express    = require('express');
const router     = express.Router();
const { checkToken, checkAdmin } = require('../middlewares/authMiddleware');
const { listarClientes, buscarCliente, atualizarCliente, deletarCliente } =
  require('../controllers/clienteController');

router.get('/',     checkToken, checkAdmin, listarClientes); // Admin: listar todos
router.get('/:id',  checkToken, buscarCliente);               // Logado: ver por ID
router.put('/:id',  checkToken, atualizarCliente);            // Logado: atualizar próprios dados
router.delete('/:id', checkToken, checkAdmin, deletarCliente);// Admin: deletar

module.exports = router;
