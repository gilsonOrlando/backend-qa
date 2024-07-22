const mongoose = require('mongoose');

const MetricaSchema = new mongoose.Schema({
    nombre: String,
    listaVerificacion: { type: mongoose.Schema.Types.ObjectId, ref: 'ListaVerificacion' }
});

module.exports = mongoose.model('Metrica', MetricaSchema);
