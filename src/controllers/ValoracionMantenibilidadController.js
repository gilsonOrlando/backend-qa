const express = require('express');
const router = express.Router();
const ValoracionMantenibilidad = require('../models/ValoracionMantenibilidad');

// Create a new valoracionMantenibilidad
router.post('/', async (req, res) => {
    try {
        const { valor1, valor2, criterio} = req.body;
        
        // Crear un nuevo ValoracionMantenibilidad con los campos correspondientes
        const newValoracionMantenibilidad = new ValoracionMantenibilidad({
            valor1,
            valor2,
            criterio,
        });
        const valoracionMantenibilidad = await newValoracionMantenibilidad.save();
        res.json(valoracionMantenibilidad);
    } catch (err) {
        res.status(500).send(err.message);
    }
});
// Get a single valoracionMantenibilidad by ID
router.get('/:id', async (req, res) => {
    try {
        const valoracionMantenibilidad = await ValoracionMantenibilidad.findById(req.params.id);
        if (!valoracionMantenibilidad) {
            return res.status(404).send('CriteriosValoracion not found');
        }
        res.json(valoracionMantenibilidad);
    } catch (err) {
        res.status(500).send(err.message);
    }
});
// Get all ValoracionMantenibilidad
router.get('/', async (req, res) => {
    try {
        const valoracionMantenibilidad = await ValoracionMantenibilidad.find();
        res.json(valoracionMantenibilidad);
    } catch (err) {
        res.status(500).send(err.message);
    }
});
// Update a ValoracionMantenibilidad by ID
router.put('/:id', async (req, res) => {
    try {
        const { valor1, valor2, criterio } = req.body;

        // Actualizar ValoracionMantenibilidad con los nuevos campos si están presentes
        const updatedValoracionMantenibilidad = await ValoracionMantenibilidad.findByIdAndUpdate(
            req.params.id,
            {
                ...(valor1 && { valor1 }),
                ...(valor2 && { valor2 }),
                ...(criterio && { criterio }),
            },
            { new: true }
        );

        if (!updatedValoracionMantenibilidad) {
            return res.status(404).send('ValoracionMantenibilidad not found');
        }
        res.json(updatedValoracionMantenibilidad);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = router;
