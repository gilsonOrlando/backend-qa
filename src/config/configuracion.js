const mongoose = require('mongoose');

// URL de conexión a MongoDB
const url = 'mongodb+srv://gilsonquezada:qwMH1g6vGRplmoD0@cluster0.uhbvmbr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'; // Cambia esto según tu configuración

// Conectar a MongoDB
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Conectado a MongoDB');
        updateProjects(); // Llamar a la función después de la conexión
    })
    .catch(err => {
        console.error('Error de conexión:', err);
    });

// Definir el esquema y el modelo
const proyectoSchema = new mongoose.Schema({
    nombre: String,
    link: String,
    idPersona: String
});

const Proyecto = mongoose.model('Proyecto', proyectoSchema);

async function updateProjects() {
    try {
        // ID del nuevo idPersona
        const newIdPersona = '27bf48dd-c12d-419b-9dc5-c05c01e5ea28';

        // IDs de los proyectos a actualizar
        const projectIds = [
            '66dcad880b7f4f0ba4372fa0',
            '66e212ffc76fb2696b9dd790'
        ];

        // Convertir IDs a ObjectId usando una función alternativa
        const objectIds = projectIds.map(id => new mongoose.Types.ObjectId(id));

        // Actualizar los proyectos
        const result = await Proyecto.updateMany(
            { _id: { $in: objectIds } },
            { $set: { idPersona: newIdPersona } }
        );

        console.log(`${result.matchedCount} documentos coinciden y ${result.modifiedCount} documentos fueron actualizados.`);
    } catch (err) {
        console.error('Error al actualizar los proyectos:', err);
    } finally {
        // Cerrar la conexión
        mongoose.connection.close();
    }
}
