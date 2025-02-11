const mongoose = require('mongoose');

const newPropiedadCalidad = new mongoose.Schema({
    propiedad: { type: String, required: true },
    valor: { type: Number, required: true },
});
module.exports = mongoose.model('PropiedadCalidad', newPropiedadCalidad);