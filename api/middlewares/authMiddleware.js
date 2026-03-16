const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

// Verifica se o usuário está logado 
function checkToken(req, res, next) {

    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
        return res.status(401).json({ msg: 'Acesso negado! Faça login primeiro.' })
    }

    try {
        const secret = process.env.SECRET
        const decoded = jwt.verify(token, secret)
        req.userId = decoded.id  // salva o id do usuário logado para usar nas rotas
        next()
    } catch (error) {
        res.status(401).json({ msg: 'Token inválido!' })
    }
}

// Verifica se o usuário logado é admin
async function checkAdmin(req, res, next) {

    const user = await User.findById(req.userId)

    if (!user || user.role !== 'admin') {
        return res.status(403).json({ msg: 'Acesso negado! Apenas administradores.' })
    }

    next()
}

module.exports = { checkToken, checkAdmin }