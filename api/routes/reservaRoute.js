const express = require("express");
const router = express.Router();
const { criarReserva, listarReservas, buscarReserva, deletarReserva } = require("../controllers/reservaController");
const { checkToken } = require("../middlewares/authMiddleware");

// Todas as rotas de reserva estão privadas
// checkToken verifica se o usuário está logado antes de executar qualquer ação
router.post("/",     checkToken, criarReserva);
router.get("/",      checkToken, listarReservas);
router.get("/:id",   checkToken, buscarReserva);
router.delete("/:id", checkToken, deletarReserva);

module.exports = router;