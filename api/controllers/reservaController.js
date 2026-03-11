const Reserva  = require("../models/reservaModel");
const Cliente  = require("../models/clienteModel");
const Quarto   = require("../models/quartosModel");

// Criar reserva
const criarReserva = async (req, res) => {
    try {
        const { clienteId, quartoId, diaria } = req.body;
        // diaria: { dataInicio, dataFim, valor }

        const cliente = await Cliente.findById(clienteId);
        if (!cliente) return res.status(404).json({ erro: "Cliente não encontrado" });

        const quarto = await Quarto.findById(quartoId);
        if (!quarto) return res.status(404).json({ erro: "Quarto não encontrado" });

        // Gera lista de datas do período alugado
        const inicio  = new Date(diaria.dataInicio);
        const fim     = new Date(diaria.dataFim);
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
        if (conflito) return res.status(409).json({ erro: "Quarto já alugado em uma ou mais datas do período solicitado" });

        // Cria a reserva
        const reserva = await Reserva.create({
            cliente: clienteId,
            quarto:  quartoId,
            diaria
        });

        // Atualiza cliente e quarto
        await Cliente.findByIdAndUpdate(clienteId, { $push: { reservas: reserva._id } });
        await Quarto.findByIdAndUpdate(quartoId, {
            $push:  { reservas: reserva._id, diasAlugados: { $each: datasDoAluguel } },
            $set:   { estaAlugado: true }
        });

        res.status(201).json(reserva);
    } catch (error) {
        res.status(400).json({ erro: error.message });
    }
};

// Listar todas as reservas
const listarReservas = async (req, res) => {
    try {
        const reservas = await Reserva.find()
            .populate("cliente")
            .populate("quarto");
        res.json(reservas);
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
};

// Buscar reserva por ID
const buscarReserva = async (req, res) => {
    try {
        const reserva = await Reserva.findById(req.params.id)
            .populate("cliente")
            .populate("quarto");
        if (!reserva) return res.status(404).json({ erro: "Reserva não encontrada" });
        res.json(reserva);
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
};

// Deletar reserva
const deletarReserva = async (req, res) => {
    try {
        const reserva = await Reserva.findByIdAndDelete(req.params.id);
        if (!reserva) return res.status(404).json({ erro: "Reserva não encontrada" });

        // Remove referências do cliente e quarto
        await Cliente.findByIdAndUpdate(reserva.cliente, { $pull: { reservas: reserva._id } });
        await Quarto.findByIdAndUpdate(reserva.quarto,   { $pull: { reservas: reserva._id } });

        res.json({ mensagem: "Reserva deletada com sucesso" });
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
};

module.exports = { criarReserva, listarReservas, buscarReserva, deletarReserva };
