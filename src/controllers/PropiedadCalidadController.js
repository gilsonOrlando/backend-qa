const express = require('express');
const router = express.Router();
const PropiedadCalidad = require('../models/PropiedadCalidad');

// Create a new propiedadCalidad
router.post('/', async (req, res) => {
    try {
        const { propiedad, valor } = req.body;

        // Crear un nuevo propiedadCalidad con los campos correspondientes
        const newPropiedadCalidad = new PropiedadCalidad({
            propiedad,
            valor
        });
        const propiedadCalidad = await newPropiedadCalidad.save();
        res.json(propiedadCalidad);
    } catch (err) {
        res.status(500).send(err.message);
    }
});
// Get a single propiedadCalidad by ID
router.get('/:id', async (req, res) => {
    try {
        const propiedadCalidad = await PropiedadCalidad.findById(req.params.id);
        if (!propiedadCalidad) {
            return res.status(404).send('propiedadCalidad not found');
        }
        res.json(propiedadCalidad);
    } catch (err) {
        res.status(500).send(err.message);
    }
});
// Get all propiedadCalidad
router.get('/', async (req, res) => {
    try {
        const propiedadCalidad = await PropiedadCalidad.find();
        res.json(propiedadCalidad);
    } catch (err) {
        res.status(500).send(err.message);
    }
});
// Update a propiedadCalidad by ID
router.put('/:id', async (req, res) => {
    try {
        const { propiedad, valor } = req.body;

        // Actualizar PropiedadCalidad con los nuevos campos si están presentes
        const updatedPropiedadCalidad = await PropiedadCalidad.findByIdAndUpdate(
            req.params.id,
            {
                ...(propiedad && { propiedad }),
                ...(valor && { valor }),
            },
            { new: true }
        );

        if (!updatedPropiedadCalidad) {
            return res.status(404).send('PropiedadCalidad not found');
        }
        res.json(updatedPropiedadCalidad);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = router;
