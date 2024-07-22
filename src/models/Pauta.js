const mongoose = require('mongoose');

const pautaSchema = new mongoose.Schema({
    descripcion: { type: String, required: true },
    pregunta: { type: String, required: true },
    nivelesCumplimiento: [{
        descripcion: { type: String, required: true },
        valor: { type: Number, required: true }
    }]
});

module.exports = mongoose.model('Pauta', pautaSchema);
