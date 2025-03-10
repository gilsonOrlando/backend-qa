const mongoose = require('mongoose');

const ProyectoSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    link: { type: String, required: true },
    idPersona: { type: String, required: true },
    branch: { type: String, required: true },
    githubtoken: { type: String, required: true }
});

module.exports = mongoose.model('Proyecto', ProyectoSchema);
