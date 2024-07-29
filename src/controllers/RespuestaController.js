// routes/respuestas.js
const express = require('express');
const router = express.Router();
const Respuesta = require('../models/Respuesta');

router.post('/guardar-respuestas', async (req, res) => {
    try {
        const { proyectoId, tipo, subcaracteristicaId, metricaId, respuestas, nombre } = req.body;

        const nuevaRespuesta = new Respuesta({
            proyectoId,
            tipo,
            subcaracteristicaId,
            metricaId,
            respuestas,
            nombre // Guardar el nombre de la respuesta
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
        const respuestas = await Respuesta.find({ proyectoId: id }).select('nombre');

        if (!respuestas.length) {
            return res.status(404).json({ message: 'No se encontraron respuestas para este proyecto' });
        }

        res.status(200).json(respuestas);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las respuestas' });
    }
});

module.exports = router;
