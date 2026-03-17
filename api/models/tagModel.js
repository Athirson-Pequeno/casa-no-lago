const mongoose = require("mongoose");

const tagSchema = new mongoose.Schema({
    nome: { type: String, required: true, unique: true, trim: true },
    quartos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Quarto" }]
});

module.exports = mongoose.model("Tag", tagSchema);