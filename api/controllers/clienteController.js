const Cliente = require("../models/clienteModel");
const User = require("../models/userModel");

// Criar cliente
const criarCliente = async (req, res) => {
    try {
        const { nome, email, telefone, cpf } = req.body;
        const cliente = await Cliente.create({ nome, email, telefone, cpf });
        res.status(201).json(cliente);
    } catch (error) {
        res.status(400).json({ erro: "Não foi possível criar o cliente. Verifique os dados enviados." });
    }
};

// Listar todos os clientes
const listarClientes = async (req, res) => {
    try {
        const clientes = await Cliente.find().populate("reservas");
        res.json(clientes);
    } catch (error) {
        res.status(500).json({ erro: "Erro ao buscar clientes." });
    }
};

// Buscar cliente por ID
const buscarCliente = async (req, res) => {
    try {
        const cliente = await Cliente.findById(req.params.id).populate("reservas");
        if (!cliente) return res.status(404).json({ erro: "Cliente não encontrado." });
        res.json(cliente);
    } catch (error) {
        res.status(500).json({ erro: "Erro ao buscar cliente." });
    }
};

// Atualizar cliente
const atualizarCliente = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user || !user.clienteId) {
            return res.status(400).json({ erro: "Usuário não tem perfil de cliente vinculado." });
        }

        if (user.clienteId.toString() !== req.params.id) {
            return res.status(403).json({ erro: "Acesso negado! Você só pode atualizar seus próprios dados." });
        }

        const cliente = await Cliente.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!cliente) return res.status(404).json({ erro: "Cliente não encontrado." });
        res.json(cliente);
    } catch (error) {
        res.status(400).json({ erro: "Não foi possível atualizar o cliente. Verifique os dados enviados." });
    }
};

// Deletar cliente
const deletarCliente = async (req, res) => {
    try {
        const cliente = await Cliente.findByIdAndDelete(req.params.id);
        if (!cliente) return res.status(404).json({ erro: "Cliente não encontrado." });
        res.json({ mensagem: "Cliente deletado com sucesso." });
    } catch (error) {
        res.status(500).json({ erro: "Erro ao deletar cliente." });
    }
};

module.exports = { criarCliente, listarClientes, buscarCliente, atualizarCliente, deletarCliente };