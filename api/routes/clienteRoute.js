const express = require("express");
const router = express.Router();
const { criarCliente, listarClientes, buscarCliente, atualizarCliente, deletarCliente } = require("../controllers/clienteController");

router.post("/", criarCliente);
router.get("/", listarClientes);
router.get("/:id", buscarCliente);
router.put("/:id", atualizarCliente);
router.delete("/:id", deletarCliente);

module.exports = router;
