const express = require("express");
const router = express.Router();
const { criarQuarto, listarQuartos, buscarQuarto, atualizarQuarto, deletarQuarto } = require("../controllers/quartosConttoler");
const { checkToken, checkAdmin } = require("../middlewares/authMiddleware");

// Rota publica
router.get("/",      listarQuartos);
router.get("/:id",   buscarQuarto);

// PRIVADAS ADMIN — precisa estar logado E ser admin
// checkToken verifica se está logado
// checkAdmin verifica se é admin
// os dois rodam em sequência antes de chegar no controller
router.post("/",      checkToken, checkAdmin, criarQuarto);
router.put("/:id",   checkToken, checkAdmin, atualizarQuarto);
router.delete("/:id", checkToken, checkAdmin, deletarQuarto);

module.exports = router;