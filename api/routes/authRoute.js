const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/userModel')
const Cliente = require('../models/clienteModel')

// ---- REGISTRO ----

router.post('/register', async (req, res) => {
    const { name, email, password, confirmpassword, telefone, cpf } = req.body

    // validação
    if (!name) return res.status(422).json({ msg: 'O nome é obrigatorio!' })
    if (!email) return res.status(422).json({ msg: 'O email é obrigatorio!' })
    if (!password) return res.status(422).json({ msg: 'A senha é obrigatorio!' })
    if (password !== confirmpassword) return res.status(422).json({ msg: 'As senhas não conferem!' })
    if (!telefone) return res.status(422).json({ msg: 'O telefone é obrigatorio!' })
    if (!cpf) return res.status(422).json({ msg: 'O CPF é obrigatorio!' })

    // check if user exists
    const userExists = await User.findOne({ email })
    if (userExists) return res.status(422).json({ msg: 'Por favor, utilize outro e-mail!' })

    // criar senha
    const salt = await bcrypt.genSalt(12)
    const passwordHash = await bcrypt.hash(password, salt)

    try {
        const user = new User({
            name,
            email,
            password: passwordHash,
        })
        await user.save()

        // cria o Cliente vinculado ao User — apenas dados comerciais
        const cliente = await Cliente.create({
            user: user._id,
            telefone,
            cpf,
        })

        // vincula o clienteId de volta no User
        user.clienteId = cliente._id
        await User.updateOne({ _id: user._id }, { clienteId: cliente._id })

        res.status(201).json({ msg: 'Usuario criado com sucesso.' })

    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: 'Erro no servidor, tente novamente mais tarde!' })
    }
})

// ---- LOGIN ----

router.post('/login', async (req, res) => {
    const { email, password } = req.body

    // validações
    if (!email) return res.status(422).json({ msg: 'O email é obrigatorio!' })
    if (!password) return res.status(422).json({ msg: 'A senha é obrigatorio!' })

    // checar se o usuario existe
    const user = await User.findOne({ email })
    if (!user) return res.status(422).json({ msg: 'Usuario não encontrado' })

    // checar se a senha combina
    const checkPassword = await bcrypt.compare(password, user.password)
    if (!checkPassword) return res.status(422).json({ msg: 'Senha invalida' })

    try {
        const secret = process.env.SECRET
        const token = jwt.sign({ id: user._id }, secret, { expiresIn: '15m' })
        res.status(200).json({ msg: 'Autenticação realizada com sucesso', token, expiredAt: 900 })
    } catch (err) {
        console.log(err)
        res.status(500).json({ msg: 'Erro no servidor, tente novamente mais tarde!' })
    }
})

module.exports = router