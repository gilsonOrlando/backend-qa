const express = require('express');
const router = express.Router();
const Metrica = require('../models/Metrica');
const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

// Create a new Metrica
router.post('/', async (req, res) => {
    try {
        const newMetrica = new Metrica(req.body);
        const metrica = await newMetrica.save();
        res.json(metrica);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Get all Metricas
router.get('/', async (req, res) => {
    try {
        const metricas = await Metrica.find().populate('listaVerificacion');
        res.json(metricas);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Función para eliminar duplicados por id y nombre entre diferentes subcaracterísticas
const removeDuplicatesGlobally = (array, globalSet) => {
    return array.filter(item => {
        const uniqueKey = `${item._id.toString()}-${item.nombre}`;
        console.log(`Evaluando item con uniqueKey: ${uniqueKey}`); // Log para ver la clave única
        if (globalSet.has(uniqueKey)) {
            console.log(`Duplicado global encontrado: ${uniqueKey}`); // Log si se encuentra un duplicado global
            return false;
        }
        globalSet.add(uniqueKey);
        return true;
    });
};

router.get('/all', async (req, res) => {
    try {
        // Recupera todas las métricas con lista de verificación y pautas anidadas
        const metricas = await Metrica.find().populate({
            path: 'listaVerificacion',
            populate: {
                path: 'pautas'
            }
        }).lean(); // Convierte los documentos de Mongoose a objetos JavaScript planos

        console.log(`Métricas recuperadas: ${JSON.stringify(metricas, null, 2)}`); // Log para ver los datos recuperados

        // Set global para rastrear métricas únicas entre todas las subcaracterísticas
        const globalUniqueSet = new Set();

        // Eliminar duplicados globalmente
        const uniqueMetricas = removeDuplicatesGlobally(metricas, globalUniqueSet);

        res.status(200).json(uniqueMetricas);
    } catch (error) {
        console.error(`Error al obtener métricas: ${error.message}`); // Log para errores
        res.status(500).json({ message: 'Error al obtener métricas', error });
    }
});


router.get('/one/:id', async (req, res) => {
    const { id } = req.params;

    // Verificar si el ID es un ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'ID inválido' });
    }

    try {
        const metrica = await Metrica.findById(id).populate({
            path: 'listaVerificacion',
            populate: {
                path: 'pautas'
            }
        }).lean();

        if (!metrica) {
            return res.status(404).json({ message: 'Métrica no encontrada' });
        }

        res.status(200).json(metrica);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener métrica', error });
    }
})

// Get a single Metrica by ID
router.get('/:id', async (req, res) => {
    try {
        const metrica = await Metrica.findById(req.params.id).populate('listaVerificacion');
        if (!metrica) {
            return res.status(404).send('Metrica not found');
        }
        res.json(metrica);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Update a Metrica by ID
router.put('/:id', async (req, res) => {
    try {
        const metrica = await Metrica.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('listaVerificacion');
        if (!metrica) {
            return res.status(404).send('Metrica not found');
        }
        res.json(metrica);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Delete a Metrica by ID
router.delete('/:id', async (req, res) => {
    try {
        const metrica = await Metrica.findByIdAndDelete(req.params.id);
        if (!metrica) {
            return res.status(404).send('Metrica not found');
        }
        res.send('Metrica deleted');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = router;
