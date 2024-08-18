const mongoose = require('mongoose');

const ConfiguracionSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    tipo: { type: String, enum: ['allSubcaracteristicas', 'singleSubcaracteristica', 'allMetricas', 'singleMetrica'], required: true },
    subcaracteristicaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subcaracteristica', default: null },
    metricaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Metrica', default: null },
    respuestas: [{
        pautaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pauta', required: true },
        valor: { type: Number, required: true }
    }]
});


module.exports = mongoose.model('Configuracion', ConfiguracionSchema);