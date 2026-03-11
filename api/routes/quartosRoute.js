const express = require("express");
const router = express.Router();
const { criarQuarto, listarQuartos, buscarQuarto, atualizarQuarto, deletarQuarto } = require("../controllers/quartosConttoler");

router.post("/", criarQuarto);
router.get("/", listarQuartos);
router.get("/:id", buscarQuarto);
router.put("/:id", atualizarQuarto);
router.delete("/:id", deletarQuarto);

module.exports = router;
