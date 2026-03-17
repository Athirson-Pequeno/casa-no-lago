const express = require("express");
const router = express.Router();
const { criarTag, listarTags, listarQuartosPorTag, adicionarTagAoQuarto, removerTagDoQuarto, deletarTag } = require("../controllers/tagController");
const { checkToken, checkAdmin } = require("../middlewares/authMiddleware");

router.get("/", listarTags);
router.get("/:id/quartos", listarQuartosPorTag);

router.post("/", checkToken, checkAdmin, criarTag);
router.post("/adicionar", checkToken, checkAdmin, adicionarTagAoQuarto);
router.post("/remover", checkToken, checkAdmin, removerTagDoQuarto);
router.delete("/:id", checkToken, checkAdmin, deletarTag);

module.exports = router;