const Reserva  = require("../models/reservaModel");
const Cliente  = require("../models/clienteModel");
const Quarto   = require("../models/quartosModel");
const User     = require("../models/userModel");

// Criar reserva
const criarReserva = async (req, res) => {
    try {
        const { quartoId, diaria } = req.body; 

        // busca o user logado para pegar o clienteId automaticamente
        const user = await User.findById(req.userId);
        if (!user || !user.clienteId) {
            return res.status(400).json({ erro: "Usuário não tem perfil de cliente vinculado" });
        }

        const clienteId = user.clienteId; // pega automaticamente do user logado

        const cliente = await Cliente.findById(clienteId);
        if (!cliente) return res.status(404).json({ erro: "Cliente não encontrado" });

        const quarto = await Quarto.findById(quartoId);
        if (!quarto) return res.status(404).json({ erro: "Quarto não encontrado" });

        // Gera lista de datas do período alugado
        const inicio = new Date(diaria.dataInicio);
        const fim    = new Date(diaria.dataFim);
        const datasDoAluguel = [];
        for (let d = new Date(inicio); d <= fim; d.setDate(d.getDate() + 1)) {
            datasDoAluguel.push(new Date(d));
        }

        // Verifica conflito com dias já alugados
        const conflito = quarto.diasAlugados.some(dAlugada =>
            datasDoAluguel.some(dNova =>
                dAlugada.toDateString() === dNova.toDateString()
            )
        );
        if (conflito) return res.status(409).json({ erro: "Quarto já alugado nesse período" });

        const reserva = await Reserva.create({
            userId:  req.userId,
            cliente: clienteId, 
            quarto:  quartoId,
            diaria
        });

        await Cliente.findByIdAndUpdate(clienteId, { $push: { reservas: reserva._id } });
        await Quarto.findByIdAndUpdate(quartoId, {
            $push: { reservas: reserva._id, diasAlugados: { $each: datasDoAluguel } },
            $set:  { estaAlugado: true }
        });

        res.status(201).json(reserva);
    } catch (error) {
        res.status(400).json({ erro: error.message });
    }
};

// Listar reservas 
const listarReservas = async (req, res) => {
    try {
        const user = await User.findById(req.userId)
        const filtro = user.role === 'admin' ? {} : { userId: req.userId }

        const reservas = await Reserva.find(filtro)
            .populate("cliente")
            .populate("quarto")
        res.json(reservas)
    } catch (error) {
        res.status(500).json({ erro: error.message })
    }
}

// Buscar reserva por ID 
const buscarReserva = async (req, res) => {
    try {
        const reserva = await Reserva.findById(req.params.id)
            .populate("cliente")
            .populate("quarto");

        if (!reserva) return res.status(404).json({ erro: "Reserva não encontrada" });

        if (reserva.userId.toString() !== req.userId) {
            return res.status(403).json({ erro: "Acesso negado! Esta reserva não é sua." });
        }

        res.json(reserva);
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
};

// Deletar reserva
const deletarReserva = async (req, res) => {
    try {
        const reserva = await Reserva.findById(req.params.id);
        if (!reserva) return res.status(404).json({ erro: "Reserva não encontrada" });

        // busca o usuário logado para verificar o role
        const user = await User.findById(req.userId);

        // admin pode deletar qualquer reserva, cliente só a sua
        if (user.role !== 'admin' && reserva.userId.toString() !== req.userId) {
            return res.status(403).json({ erro: "Acesso negado! Esta reserva não é sua." });
        }

        await Reserva.findByIdAndDelete(req.params.id);
        await Cliente.findByIdAndUpdate(reserva.cliente, { $pull: { reservas: reserva._id } });
        await Quarto.findByIdAndUpdate(reserva.quarto,   { $pull: { reservas: reserva._id } });

        res.json({ mensagem: "Reserva deletada com sucesso" });
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
};
module.exports = { criarReserva, listarReservas, buscarReserva, deletarReserva };




/*
com o admin podendo criar reserva tambem

const criarReserva = async (req, res) => {
    try {
        const { quartoId, diaria, clienteId: clienteIdBody } = req.body

        // busca o usuário logado
        const user = await User.findById(req.userId)

        let clienteId

        if (user.role === 'admin') {
            // admin passa o clienteId no body
            if (!clienteIdBody) {
                return res.status(400).json({ erro: "Admin deve informar o clienteId no body" })
            }
            clienteId = clienteIdBody
        } else {
            // cliente pega o clienteId automaticamente do seu perfil
            if (!user.clienteId) {
                return res.status(400).json({ erro: "Usuário não tem perfil de cliente vinculado" })
            }
            clienteId = user.clienteId
        }

        const cliente = await Cliente.findById(clienteId)
        if (!cliente) return res.status(404).json({ erro: "Cliente não encontrado" })

        const quarto = await Quarto.findById(quartoId)
        if (!quarto) return res.status(404).json({ erro: "Quarto não encontrado" })

        const inicio = new Date(diaria.dataInicio)
        const fim    = new Date(diaria.dataFim)
        const datasDoAluguel = []
        for (let d = new Date(inicio); d <= fim; d.setDate(d.getDate() + 1)) {
            datasDoAluguel.push(new Date(d))
        }

        const conflito = quarto.diasAlugados.some(dAlugada =>
            datasDoAluguel.some(dNova =>
                dAlugada.toDateString() === dNova.toDateString()
            )
        )
        if (conflito) return res.status(409).json({ erro: "Quarto já alugado nesse período" })

        const reserva = await Reserva.create({
            userId:  req.userId,
            cliente: clienteId,
            quarto:  quartoId,
            diaria
        })

        await Cliente.findByIdAndUpdate(clienteId, { $push: { reservas: reserva._id } })
        await Quarto.findByIdAndUpdate(quartoId, {
            $push: { reservas: reserva._id, diasAlugados: { $each: datasDoAluguel } },
            $set:  { estaAlugado: true }
        })

        res.status(201).json(reserva)
    } catch (error) {
        res.status(400).json({ erro: error.message })
    }
}
*/