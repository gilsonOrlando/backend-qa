const mongoose = require('mongoose');

const newValoracionMantenibilidad = new mongoose.Schema({
    valor1: { type: Number, required: true },
    valor2: { type: Number, required: true },
    criterio: { type: String, required: true },
});
module.exports = mongoose.model('ValoracionMantenibilidad', newValoracionMantenibilidad);