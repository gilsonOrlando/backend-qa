const express = require('express');
const router = express.Router();
const CriteriosValoracion = require('../models/CriteriosValoracion');

// Create a new CriteriosValoracion
router.post('/', async (req, res) => {
    try {
        const { valor1, valor2, criterio} = req.body;
        
        // Crear un nuevo CriteriosValoracion con los campos correspondientes
        const newCriteriosValoracion = new CriteriosValoracion({
            valor1,
            valor2,
            criterio,
        });
        const criteriosValoracion = await newCriteriosValoracion.save();
        res.json(criteriosValoracion);
    } catch (err) {
        res.status(500).send(err.message);
    }
});
// Get a single CriteriosValoracion by ID
router.get('/:id', async (req, res) => {
    try {
        const criteriosValoracion = await CriteriosValoracion.findById(req.params.id);
        if (!criteriosValoracion) {
            return res.status(404).send('CriteriosValoracion not found');
        }
        res.json(criteriosValoracion);
    } catch (err) {
        res.status(500).send(err.message);
    }
});
// Get all CriteriosValoracion
router.get('/', async (req, res) => {
    try {
        const criteriosValoracion = await CriteriosValoracion.find();
        res.json(criteriosValoracion);
    } catch (err) {
        res.status(500).send(err.message);
    }
});
// Update a CriteriosValoracion by ID
router.put('/:id', async (req, res) => {
    try {
        const { valor1, valor2, criterio } = req.body;

        // Actualizar CriteriosValoracion con los nuevos campos si están presentes
        const updatedCriteriosValoracion = await CriteriosValoracion.findByIdAndUpdate(
            req.params.id,
            {
                ...(valor1 && { valor1 }),
                ...(valor2 && { valor2 }),
                ...(criterio && { criterio }),
            },
            { new: true }
        );

        if (!updatedCriteriosValoracion) {
            return res.status(404).send('CriteriosValoracion not found');
        }
        res.json(updatedCriteriosValoracion);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = router;
