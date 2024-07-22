const mongoose = require('mongoose');

const SubcaracteristicaSchema = new mongoose.Schema({
    nombre: String,
    metricas: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Metrica' }]
});

module.exports = mongoose.model('Subcaracteristica', SubcaracteristicaSchema);
