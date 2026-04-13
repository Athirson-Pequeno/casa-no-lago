const Cliente = require('../models/clienteModel');
const User    = require('../models/userModel');

// Listar todos os clientes (admin)
const listarClientes = async (req, res) => {
  try {
    const clientes = await Cliente.find()
      .populate('user', 'name email')
      .populate('reservas');
    res.json(clientes);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar clientes.' });
  }
};

// Buscar cliente por ID
const buscarCliente = async (req, res) => {
  try {
    const cliente = await Cliente.findById(req.params.id)
      .populate('user', 'name email')
      .populate('reservas');
    if (!cliente) return res.status(404).json({ erro: 'Cliente não encontrado.' });
    res.json(cliente);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar cliente.' });
  }
};

// Atualizar cliente (apenas os próprios dados)
const atualizarCliente = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user || !user.clienteId) {
      return res.status(400).json({ erro: 'Usuário não tem perfil de cliente vinculado.' });
    }
    if (user.clienteId.toString() !== req.params.id) {
      return res.status(403).json({ erro: 'Acesso negado! Você só pode atualizar seus próprios dados.' });
    }

    const { telefone, email } = req.body;
    if (!telefone && !email) return res.status(400).json({ erro: 'Nenhum campo válido para atualizar.' });

    if (email) {
      await User.findByIdAndUpdate(req.userId, { email }, { runValidators: true });
    }

    const camposCliente = {};
    if (telefone) camposCliente.telefone = telefone;

    const cliente = await Cliente.findByIdAndUpdate(req.params.id, camposCliente, {
      new: true, runValidators: true
    }).populate('user', 'name email');

    if (!cliente) return res.status(404).json({ erro: 'Cliente não encontrado.' });
    res.json(cliente);
  } catch (error) {
    res.status(400).json({ erro: 'Não foi possível atualizar o cliente. Verifique os dados enviados.' });
  }
};

// Deletar cliente (admin) — impede deleção se houver reservas ativas
const deletarCliente = async (req, res) => {
  try {
    const cliente = await Cliente.findById(req.params.id);
    if (!cliente) return res.status(404).json({ erro: 'Cliente não encontrado.' });

    if (cliente.reservas.length > 0) {
      return res.status(400).json({ erro: 'Não é possível deletar um cliente com reservas ativas.' });
    }

    await Cliente.findByIdAndDelete(req.params.id);
    await User.findByIdAndDelete(cliente.user);

    res.json({ mensagem: 'Cliente e usuário deletados com sucesso.' });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao deletar cliente.' });
  }
};

module.exports = { listarClientes, buscarCliente, atualizarCliente, deletarCliente };
