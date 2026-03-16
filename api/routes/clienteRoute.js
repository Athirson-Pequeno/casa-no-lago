const express = require("express");
const router = express.Router();
const { checkToken } = require("../middlewares/authMiddleware");
const { criarCliente, listarClientes, buscarCliente, atualizarCliente, deletarCliente } = require("../controllers/clienteController");

router.post("/", criarCliente);
router.get("/", checkToken, listarClientes);
router.get("/:id", checkToken, buscarCliente);
router.put("/:id", atualizarCliente);
router.delete("/:id", checkToken, deletarCliente);

module.exports = router;
