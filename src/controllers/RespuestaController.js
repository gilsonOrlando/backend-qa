// routes/respuestas.js
const express = require('express');
const router = express.Router();
const Respuesta = require('../models/Respuesta');

router.post('/guardar-respuestas', async (req, res) => {
    try {
        const { proyectoId, tipo, subcaracteristicaId, metricaId, respuestas, nombre, intentos } = req.body;

        const nuevaRespuesta = new Respuesta({
            proyectoId,
            tipo,
            subcaracteristicaId,
            metricaId,
            respuestas,
            nombre, // Guardar el nombre de la respuesta
            intentos
        });

        await nuevaRespuesta.save();
        res.status(201).json({ message: 'Respuestas guardadas exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al guardar las respuestas' });
    }
});

// Obtener respuestas por proyecto
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Buscar respuestas por el ID del proyecto
        const respuestas = await Respuesta.find({ proyectoId: id });

        if (!respuestas.length) {
            return res.status(404).json({ message: 'No se encontraron respuestas para este proyecto' });
        }

        res.status(200).json(respuestas);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las respuestas' });
    }
});


router.post('/verificar-existencia', async (req, res) => {
    try {
        const { proyectoId, subcaracteristicaId, metricaId } = req.body;

        // Buscar si ya existe una respuesta para la subcaracterística o métrica en el proyecto
        const respuestaExistente = await Respuesta.findOne({
            proyectoId,
            $or: [{ subcaracteristicaId }, { metricaId }]
        });

        if (respuestaExistente) {
            return res.status(200).json({ existe: true, message: 'Ya existe una prueba para esta subcaracterística o métrica.' });
        }

        res.status(200).json({ existe: false });
    } catch (error) {
        res.status(500).json({ error: 'Error al verificar la existencia de la prueba' });
    }
});

// Ruta para verificar existencia de respuesta para una subcaracterística
router.post('/subcaracteristica', async (req, res) => {
    try {
        const { proyectoId, subcaracteristicaId } = req.body;
        const respuesta = await Respuesta.findOne({ proyectoId, subcaracteristicaId });

        if (respuesta) {
            return res.status(200).json({ existe: true, message: 'Ya existe una respuesta para esta subcaracterística' });
        }
        
        res.status(200).json({ existe: false });
    } catch (error) {
        res.status(500).json({ error: 'Error al verificar la existencia de la subcaracterística' });
    }
});

// Ruta para verificar existencia de respuesta para una métrica
router.post('/metrica', async (req, res) => {
    try {
        const { proyectoId, metricaId } = req.body;
        const respuesta = await Respuesta.findOne({ proyectoId, metricaId });

        if (respuesta) {
            return res.status(200).json({ existe: true, message: 'Ya existe una respuesta para esta métrica' });
        }
        
        res.status(200).json({ existe: false });
    } catch (error) {
        res.status(500).json({ error: 'Error al verificar la existencia de la métrica' });
    }
});


module.exports = router;
