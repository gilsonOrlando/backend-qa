const mongoose = require('mongoose');

const ListaVerificacionSchema = new mongoose.Schema({
    nombre: String,
    pautas: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Pauta' }]
});

module.exports = mongoose.model('ListaVerificacion', ListaVerificacionSchema);
