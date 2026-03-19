const Quarto = require("../models/quartosModel");

// Criar quarto
const criarQuarto = async (req, res) => {
    try {
        const { titulo, fotos, valorDiaria } = req.body;
        const quarto = await Quarto.create({ titulo, fotos, valorDiaria });
        res.status(201).json(quarto);
    } catch (error) {
        res.status(400).json({ erro: "Não foi possível criar o quarto. Verifique os dados enviados." });
    }
};

// Listar todos os quartos
const listarQuartos = async (req, res) => {
    try {
        const quartos = await Quarto.find().populate("tags");
        res.json(quartos);
    } catch (error) {
        res.status(500).json({ erro: "Erro ao buscar quartos." });
    }
};

// Buscar quarto por ID
const buscarQuarto = async (req, res) => {
    try {
        const quarto = await Quarto.findById(req.params.id).populate("tags");
        if (!quarto) return res.status(404).json({ erro: "Quarto não encontrado." });
        res.json(quarto);
    } catch (error) {
        res.status(500).json({ erro: "Erro ao buscar quarto." });
    }
};

// Atualizar quarto
const atualizarQuarto = async (req, res) => {
    try {
        const { titulo, fotos, valorDiaria } = req.body;
        const camposPermitidos = {};
        if (titulo !== undefined) camposPermitidos.titulo = titulo;
        if (fotos !== undefined) camposPermitidos.fotos = fotos;
        if (valorDiaria !== undefined) camposPermitidos.valorDiaria = valorDiaria;

        const quarto = await Quarto.findByIdAndUpdate(req.params.id, camposPermitidos, { new: true, runValidators: true });
        if (!quarto) return res.status(404).json({ erro: "Quarto não encontrado." });
        res.json(quarto);
    } catch (error) {
        res.status(400).json({ erro: "Não foi possível atualizar o quarto. Verifique os dados enviados." });
    }
};

// Deletar quarto
const deletarQuarto = async (req, res) => {
    try {
        const quarto = await Quarto.findByIdAndDelete(req.params.id);
        if (!quarto) return res.status(404).json({ erro: "Quarto não encontrado." });
        res.json({ mensagem: "Quarto deletado com sucesso." });
    } catch (error) {
        res.status(500).json({ erro: "Erro ao deletar quarto." });
    }
};

module.exports = { criarQuarto, listarQuartos, buscarQuarto, atualizarQuarto, deletarQuarto };