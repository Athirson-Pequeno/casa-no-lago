const express = require("express");
const router = express.Router();
const { criarReserva, listarReservas, buscarReserva, deletarReserva } = require("../controllers/reservaController");

router.post("/", criarReserva);
router.get("/", listarReservas);
router.get("/:id", buscarReserva);
router.delete("/:id", deletarReserva);

module.exports = router;
