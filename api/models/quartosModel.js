const mongoose = require("mongoose");

const quartoSchema = new mongoose.Schema({
    titulo: { type: String, required: true },
    fotos: [{ type: String }],
    valorDiaria: { type: Number, required: true, min: [0.01, 'O valor da diária deve ser maior que zero.'] },
    estaAlugado: { type: Boolean, default: false },
    diasAlugados: [{ type: Date }],
    reservas: [{ type: mongoose.Schema.Types.ObjectId, ref: "Reserva" }],
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tag" }]
});

module.exports = mongoose.model("Quarto", quartoSchema);