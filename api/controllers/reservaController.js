const Reserva  = require('../models/reservaModel');
const Cliente  = require('../models/clienteModel');
const Quarto   = require('../models/quartosModel');
const User     = require('../models/userModel');
const { gerarIntervalo, temConflito, contarDiarias } = require('../utils/datas');
const { validarCamposReserva, validarDatas }         = require('../utils/validacoes');

// Criar reserva (cliente logado)
const criarReserva = async (req, res) => {
  try {
    const erroValidacao = validarCamposReserva(req.body);
    if (erroValidacao) return res.status(400).json({ erro: erroValidacao });

    const { quartoId, diaria } = req.body;

    const user = await User.findById(req.userId);
    if (!user?.clienteId)
      return res.status(400).json({ erro: 'Usuário não tem perfil de cliente vinculado.' });

    const [cliente, quarto] = await Promise.all([
      Cliente.findById(user.clienteId),
      Quarto.findById(quartoId),
    ]);
    if (!cliente) return res.status(404).json({ erro: 'Cliente não encontrado.' });
    if (!quarto)  return res.status(404).json({ erro: 'Quarto não encontrado.' });

    const datasResult = validarDatas(diaria.dataInicio, diaria.dataFim);
    if (datasResult.erro) return res.status(400).json({ erro: datasResult.erro });

    const { inicio, fim }  = datasResult;
    const datasDoAluguel   = gerarIntervalo(inicio, fim);

    if (temConflito(quarto.diasAlugados, datasDoAluguel))
      return res.status(409).json({ erro: 'Quarto já alugado nesse período.' });

    const valorCalculado = contarDiarias(datasDoAluguel) * quarto.valorDiaria;

    const reserva = await Reserva.create({
      userId:  req.userId,
      cliente: user.clienteId,
      quarto:  quartoId,
      diaria:  { dataInicio: diaria.dataInicio, dataFim: diaria.dataFim, valor: valorCalculado },
    });

    await Promise.all([
      Cliente.findByIdAndUpdate(user.clienteId, { $push: { reservas: reserva._id } }),
      Quarto.findByIdAndUpdate(quartoId, {
        $push: { reservas: reserva._id, diasAlugados: { $each: datasDoAluguel } },
        $set:  { estaAlugado: true },
      }),
    ]);

    res.status(201).json(reserva);
  } catch (error) {
    res.status(400).json({ erro: 'Não foi possível criar a reserva. Verifique os dados enviados.' });
  }
};

// Listar reservas — admin vê todas, cliente vê só as suas
const listarReservas = async (req, res) => {
  try {
    const user   = await User.findById(req.userId);
    const filtro = user.role === 'admin' ? {} : { userId: req.userId };

    const reservas = await Reserva.find(filtro)
      .populate({ path: 'cliente', populate: { path: 'user', select: 'name email' } })
      .populate('quarto');
    res.json(reservas);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar reservas.' });
  }
};

// Buscar reserva por ID — admin vê qualquer uma, cliente só a sua
const buscarReserva = async (req, res) => {
  try {
    const reserva = await Reserva.findById(req.params.id)
      .populate({ path: 'cliente', populate: { path: 'user', select: 'name email' } })
      .populate('quarto');

    if (!reserva) return res.status(404).json({ erro: 'Reserva não encontrada.' });

    const user = await User.findById(req.userId);
    if (user.role !== 'admin' && reserva.userId.toString() !== req.userId) {
      return res.status(403).json({ erro: 'Acesso negado! Esta reserva não é sua.' });
    }

    res.json(reserva);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar reserva.' });
  }
};

// Deletar reserva (admin) — devolve os dias ao quarto
const deletarReserva = async (req, res) => {
  try {
    const reserva = await Reserva.findById(req.params.id);
    if (!reserva) return res.status(404).json({ erro: 'Reserva não encontrada.' });

    const datasDaReserva = gerarIntervalo(
      new Date(reserva.diaria.dataInicio),
      new Date(reserva.diaria.dataFim)
    );
    const datasStrings = datasDaReserva.map(d => d.toDateString());

    const quarto       = await Quarto.findById(reserva.quarto);
    const diasRestantes = quarto.diasAlugados.filter(
      d => !datasStrings.includes(d.toDateString())
    );

    await Promise.all([
      Reserva.findByIdAndDelete(req.params.id),
      Cliente.findByIdAndUpdate(reserva.cliente, { $pull: { reservas: reserva._id } }),
      Quarto.findByIdAndUpdate(reserva.quarto, {
        $pull: { reservas: reserva._id },
        $set:  { diasAlugados: diasRestantes, estaAlugado: diasRestantes.length > 0 },
      }),
    ]);

    res.json({ mensagem: 'Reserva deletada com sucesso.' });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao deletar reserva.' });
  }
};

module.exports = { criarReserva, listarReservas, buscarReserva, deletarReserva };
