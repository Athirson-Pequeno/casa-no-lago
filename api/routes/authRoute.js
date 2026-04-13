const express  = require('express');
const router   = express.Router();
const bcrypt   = require('bcrypt');
const jwt      = require('jsonwebtoken');
const User     = require('../models/userModel');
const Cliente  = require('../models/clienteModel');

// ── REGISTRO ──────────────────────────────────────────────
router.post('/register', async (req, res) => {
  const { name, email, password, confirmpassword, telefone, cpf } = req.body;

  // Validações de campos obrigatórios
  if (!name)  return res.status(422).json({ msg: 'O nome é obrigatório!' });
  if (!email) return res.status(422).json({ msg: 'O email é obrigatório!' });

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(422).json({ msg: 'E-mail inválido! Use o formato exemplo@email.com.' });
  }

  if (!password)                  return res.status(422).json({ msg: 'A senha é obrigatória!' });
  if (password !== confirmpassword) return res.status(422).json({ msg: 'As senhas não conferem!' });

  if (!telefone) return res.status(422).json({ msg: 'O telefone é obrigatório!' });
  const telefoneRegex = /^\d{11}$/;
  if (!telefoneRegex.test(telefone)) {
    return res.status(422).json({ msg: 'Telefone inválido! Digite apenas os 11 números, incluindo o DDD.' });
  }

  if (!cpf) return res.status(422).json({ msg: 'O CPF é obrigatório!' });
  const cpfRegex = /^\d{11}$/;
  if (!cpfRegex.test(cpf)) {
    return res.status(422).json({ msg: 'CPF inválido! Digite apenas os 11 números, sem pontos ou traços.' });
  }

  // Verifica duplicidade de e-mail
  const userExists = await User.findOne({ email });
  if (userExists) return res.status(422).json({ msg: 'Por favor, utilize outro e-mail!' });

  // Hash da senha
  const salt         = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(password, salt);

  try {
    const user = new User({ name, email, password: passwordHash });
    await user.save();

    // Cria o perfil de Cliente vinculado ao User
    const cliente = await Cliente.create({ user: user._id, telefone, cpf });

    // Vincula clienteId de volta no User
    await User.updateOne({ _id: user._id }, { clienteId: cliente._id });

    res.status(201).json({ msg: 'Usuário criado com sucesso.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Erro no servidor, tente novamente mais tarde!' });
  }
});

// ── LOGIN ──────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email)    return res.status(422).json({ msg: 'O email é obrigatório!' });
  if (!password) return res.status(422).json({ msg: 'A senha é obrigatória!' });

  const user = await User.findOne({ email });
  if (!user) return res.status(422).json({ msg: 'Usuário não encontrado.' });

  const checkPassword = await bcrypt.compare(password, user.password);
  if (!checkPassword) return res.status(422).json({ msg: 'Senha inválida.' });

  try {
    const secret = process.env.SECRET;
    const token  = jwt.sign({ id: user._id }, secret, { expiresIn: '15m' });
    res.status(200).json({ msg: 'Autenticação realizada com sucesso.', token, expiredAt: 900 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Erro no servidor, tente novamente mais tarde!' });
  }
});

module.exports = router;
