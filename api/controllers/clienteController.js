const Cliente = require("../models/clienteModel");

// Criar cliente
const criarCliente = async (req, res) => {
    try {
        const { nome, email, telefone, cpf } = req.body;
        const cliente = await Cliente.create({ nome, email, telefone, cpf });
        res.status(201).json(cliente);
    } catch (error) {
        res.status(400).json({ erro: error.message });
    }
};

// Listar todos os clientes
const listarClientes = async (req, res) => {
    try {
        const clientes = await Cliente.find().populate("reservas");
        res.json(clientes);
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
};

// Buscar cliente por ID
const buscarCliente = async (req, res) => {
    try {
        const cliente = await Cliente.findById(req.params.id).populate("reservas");
        if (!cliente) return res.status(404).json({ erro: "Cliente não encontrado" });
        res.json(cliente);
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
};

// Atualizar cliente
const atualizarCliente = async (req, res) => {
    try {
        const cliente = await Cliente.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!cliente) return res.status(404).json({ erro: "Cliente não encontrado" });
        res.json(cliente);
    } catch (error) {
        res.status(400).json({ erro: error.message });
    }
};

// Deletar cliente
const deletarCliente = async (req, res) => {
    try {
        const cliente = await Cliente.findByIdAndDelete(req.params.id);
        if (!cliente) return res.status(404).json({ erro: "Cliente não encontrado" });
        res.json({ mensagem: "Cliente deletado com sucesso" });
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
};

module.exports = { criarCliente, listarClientes, buscarCliente, atualizarCliente, deletarCliente };
