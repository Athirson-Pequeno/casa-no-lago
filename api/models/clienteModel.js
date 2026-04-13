const mongoose = require('mongoose');

const clienteSchema = new mongoose.Schema({
  user:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  telefone: { type: String, required: true },
  cpf:      { type: String, required: true, unique: true },
  reservas: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Reserva' }]
});

module.exports = mongoose.model('Cliente', clienteSchema);
