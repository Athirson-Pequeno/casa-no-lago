const mongoose = require("mongoose");

const diariaSchema = new mongoose.Schema({
    dataInicio: { type: Date, required: true },
    dataFim:    { type: Date, required: true },
    valor:      { type: Number, required: true }
}, { _id: false });

const reservaSchema = new mongoose.Schema({
    
    userId:  { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // userId liga a reserva diretamente ao usuário logado
    cliente: { type: mongoose.Schema.Types.ObjectId, ref: "Cliente", required: true },
    quarto:  { type: mongoose.Schema.Types.ObjectId, ref: "Quarto", required: true },
    diaria:  { type: diariaSchema, required: true }
}, { timestamps: true });

module.exports = mongoose.model("Reserva", reservaSchema);
