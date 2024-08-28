const mongoose = require('mongoose');

const RespuestaSchema = new mongoose.Schema({
    proyectoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Proyecto', required: true },
    tipo: { type: String, enum: ['allSubcaracteristicas', 'singleSubcaracteristica', 'allMetricas', 'singleMetrica'], required: true },
    subcaracteristicaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subcaracteristica' },
    metricaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Metrica' },
    respuestas: [{
        pautaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pauta', required: false },
        listaVerificacion: { type: mongoose.Schema.Types.ObjectId, ref: 'ListaVerificacion' }, // Agregado
        valor: { type: Number, required: false },
        comentario: { type: String, required: false }
    }],
    nombre: { type: String, required: true }
});

module.exports = mongoose.model('Respuesta', RespuestaSchema);
