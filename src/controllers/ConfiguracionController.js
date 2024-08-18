// controllers/configuracionController.js

const express = require('express');
const router = express.Router();
const Configuracion = require('../models/Configuracion');
const Pauta = require('../models/Pauta');
const Subcaracteristica = require('../models/Subcaracteristica');
const Metrica = require('../models/Metrica');

// Obtener todas las configuraciones guardadas
router.get('/', async (req, res) => {
    try {
        const configuraciones = await Configuracion.find()
            .populate('subcaracteristicaId')
            .populate('metricaId')
            .populate('respuestas.pautaId');
        res.json(configuraciones);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las configuraciones', error });
    }
});

router.post('/', async (req, res) => {
    try {
        const { nombre, tipo, subcaracteristicaId, metricaId, respuestas } = req.body;

        // Validar que los campos requeridos están presentes
        if (!nombre || !tipo || !respuestas || respuestas.length === 0) {
            return res.status(400).json({ message: 'Campos requeridos faltantes o respuestas vacías' });
        }

        // Validar que las respuestas tengan el formato correcto
        const validRespuestas = await Promise.all(respuestas.map(async (respuesta) => {
            const pauta = await Pauta.findById(respuesta.pautaId);
            if (!pauta) {
                throw new Error(`Pauta no encontrada: ${respuesta.pautaId}`);
            }
            return {
                pautaId: respuesta.pautaId,
                valor: respuesta.valor
            };
        }));

        const nuevaConfiguracion = new Configuracion({
            nombre,
            tipo,
            subcaracteristicaId: subcaracteristicaId || null,
            metricaId: metricaId || null,
            respuestas: validRespuestas
        });

        await nuevaConfiguracion.save();
        res.status(201).json(nuevaConfiguracion);
    } catch (error) {
        console.error('Error al crear la configuración:', error);
        res.status(500).json({ message: 'Error al crear la configuración', error: error.message });
    }
});

// Obtener pautas de una subcaracterística
router.get('/subcaracteristicas/:id/pautas', async (req, res) => {
    try {
        const subcaracteristica = await Subcaracteristica.findById(req.params.id)
            .populate({
                path: 'metricas',
                populate: {
                    path: 'listaVerificacion',
                    populate: {
                        path: 'pautas'
                    }
                }
            });
        if (!subcaracteristica) {
            return res.status(404).json({ message: 'Subcaracterística no encontrada' });
        }
        const pautas = subcaracteristica.metricas.reduce((acc, metrica) => {
            return acc.concat(metrica.listaVerificacion.pautas);
        }, []);
        res.json(pautas);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener pautas', error });
    }
});

// Obtener pautas de una métrica
router.get('/metricas/:id/pautas', async (req, res) => {
    try {
        const metrica = await Metrica.findById(req.params.id)
            .populate({
                path: 'listaVerificacion',
                populate: {
                    path: 'pautas'
                }
            });
        if (!metrica) {
            return res.status(404).json({ message: 'Métrica no encontrada' });
        }
        res.json(metrica.listaVerificacion.pautas);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener pautas', error });
    }
});

module.exports = router;
