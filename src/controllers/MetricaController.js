const express = require('express');
const router = express.Router();
const Metrica = require('../models/Metrica');

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

router.get('/all',async (req, res) =>{
    try {
        const metricas = await Metrica.find().populate({
            path: 'listaVerificacion',
            populate: {
                path: 'pautas'
            }
        });

        // Eliminar duplicados
        const uniqueMetricas = Array.from(new Set(metricas.map(m => m._id.toString())))
            .map(id => metricas.find(m => m._id.toString() === id));

        res.status(200).json(uniqueMetricas);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener métricas', error });
    }
});

router.get('one/:id', async (req, res) =>{
    try {
        const metrica = await Metrica.findById(req.params.id).populate({
            path: 'listaVerificacion',
            populate: {
                path: 'pautas'
            }
        });

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
