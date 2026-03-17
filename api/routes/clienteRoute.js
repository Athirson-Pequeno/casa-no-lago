const express = require("express");
const router = express.Router();
const { checkToken, checkAdmin } = require("../middlewares/authMiddleware");
const { listarClientes, buscarCliente, atualizarCliente, deletarCliente } = require("../controllers/clienteController");

router.get("/", checkToken, checkAdmin, listarClientes);
router.get("/:id", checkToken, buscarCliente);
router.put("/:id", checkToken, atualizarCliente);
router.delete("/:id", checkToken, checkAdmin, deletarCliente);

module.exports = router;