const Quarto = require("../models/quartosModel");

// Criar quarto
const criarQuarto = async (req, res) => {
    try {
        const { titulo, fotos, valorDiaria } = req.body;
        const quarto = await Quarto.create({ titulo, fotos, valorDiaria });
        res.status(201).json(quarto);
    } catch (error) {
        res.status(400).json({ erro: error.message });
    }
};

// Listar todos os quartos
const listarQuartos = async (req, res) => {
    try {
        const quartos = await Quarto.find().populate("reservas");
        res.json(quartos);
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
};

// Buscar quarto por ID
const buscarQuarto = async (req, res) => {
    try {
        const quarto = await Quarto.findById(req.params.id).populate("reservas");
        if (!quarto) return res.status(404).json({ erro: "Quarto não encontrado" });
        res.json(quarto);
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
};

// Atualizar quarto
const atualizarQuarto = async (req, res) => {
    try {
        const quarto = await Quarto.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!quarto) return res.status(404).json({ erro: "Quarto não encontrado" });
        res.json(quarto);
    } catch (error) {
        res.status(400).json({ erro: error.message });
    }
};

// Deletar quarto
const deletarQuarto = async (req, res) => {
    try {
        const quarto = await Quarto.findByIdAndDelete(req.params.id);
        if (!quarto) return res.status(404).json({ erro: "Quarto não encontrado" });
        res.json({ mensagem: "Quarto deletado com sucesso" });
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
};

module.exports = { criarQuarto, listarQuartos, buscarQuarto, atualizarQuarto, deletarQuarto };
