const express = require('express');
const router = express.Router();
const Subcaracteristica = require('../models/Subcaracteristica');
const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');


// Create a new Subcaracteristica
router.post('/', async (req, res) => {
    try {
        const newSubcaracteristica = new Subcaracteristica(req.body);
        const subcaracteristica = await newSubcaracteristica.save();
        res.json(subcaracteristica);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Get all Subcaracteristicas
router.get('/', async (req, res) => {
    try {
        const subcaracteristicas = await Subcaracteristica.find().populate('metricas');
        res.json(subcaracteristicas);
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
        // Recupera todas las subcaracterísticas con métricas anidadas
        const subcaracteristicas = await Subcaracteristica.find().populate({
            path: 'metricas',
            populate: {
                path: 'listaVerificacion',
                populate: {
                    path: 'pautas'
                }
            }
        }).lean(); // Convierte los documentos de Mongoose a objetos JavaScript planos

        console.log(`Subcaracterísticas recuperadas: ${JSON.stringify(subcaracteristicas, null, 2)}`); // Log para ver los datos recuperados
        
        // Set global para rastrear métricas únicas entre todas las subcaracterísticas
        const globalUniqueSet = new Set();

        // Procesa las subcaracterísticas para eliminar métricas duplicadas globalmente
        const uniqueSubcaracteristicas = subcaracteristicas.map(subcaracteristica => {
            const uniqueMetricas = removeDuplicatesGlobally(subcaracteristica.metricas, globalUniqueSet);
            console.log(`Métricas únicas para subcaracterística ${subcaracteristica._id}: ${JSON.stringify(uniqueMetricas, null, 2)}`); // Log para ver las métricas únicas
            return {
                ...subcaracteristica,
                metricas: uniqueMetricas
            };
        });

        res.status(200).json(uniqueSubcaracteristicas);
    } catch (error) {
        console.error(`Error al obtener subcaracterísticas: ${error.message}`); // Log para errores
        res.status(500).json({ message: 'Error al obtener subcaracterísticas', error });
    }
});

// Get a single Subcaracteristica by ID
router.get('/:id', async (req, res) => {
    try {
        const subcaracteristica = await Subcaracteristica.findById(req.params.id).populate('metricas');
        if (!subcaracteristica) {
            return res.status(404).send('Subcaracteristica not found');
        }
        res.json(subcaracteristica);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.get('/one/:id', async (req, res) => {
    const { id } = req.params;

    // Verificar si el ID es un ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'ID inválido' });
    }

    try {
        // Buscar el documento por ID
        const subcaracteristica = await Subcaracteristica.findById(id).populate({
            path: 'metricas',
            populate: {
                path: 'listaVerificacion',
                populate: {
                    path: 'pautas'
                }
            }
        }).lean(); 

        // Comprobar si el documento fue encontrado
        if (!subcaracteristica) {
            return res.status(404).json({ message: 'Subcaracterística no encontrada' });
        }

        // Enviar el documento como respuesta
        res.status(200).json(subcaracteristica);
    } catch (error) {
        console.error('Error al obtener subcaracterística:', error);
        res.status(500).json({ message: 'Error al obtener subcaracterística', error });
    }
});

// Update a Subcaracteristica by ID
router.put('/:id', async (req, res) => {
    try {
        const subcaracteristica = await Subcaracteristica.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('metricas');
        if (!subcaracteristica) {
            return res.status(404).send('Subcaracteristica not found');
        }
        res.json(subcaracteristica);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Delete a Subcaracteristica by ID
router.delete('/:id', async (req, res) => {
    try {
        const subcaracteristica = await Subcaracteristica.findByIdAndDelete(req.params.id);
        if (!subcaracteristica) {
            return res.status(404).send('Subcaracteristica not found');
        }
        res.send('Subcaracteristica deleted');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = router;
