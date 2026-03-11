const mongoose = require("mongoose");

const quartoSchema = new mongoose.Schema({
    titulo: { type: String, required: true },
    fotos: [{ type: String }],     
    valorDiaria: { type: Number, required: true },
    estaAlugado: { type: Boolean, default: false },
    diasAlugados: [{ type: Date }],         
    reservas: [{ type: mongoose.Schema.Types.ObjectId, ref: "Reserva" }]
});

module.exports = mongoose.model("Quarto", quartoSchema);

