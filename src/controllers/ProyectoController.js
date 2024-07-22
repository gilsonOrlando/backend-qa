const express = require('express');
const router = express.Router();
const Proyecto = require('../models/Proyecto');

// Create a new Proyecto
router.post('/', async (req, res) => {
    try {
        const newProyecto = new Proyecto(req.body);
        const proyecto = await newProyecto.save();
        res.json(proyecto);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Get all Proyectos
router.get('/', async (req, res) => {
    try {
        const proyectos = await Proyecto.find();
        res.json(proyectos);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Get a single Proyecto by ID
router.get('/:id', async (req, res) => {
    try {
        const proyecto = await Proyecto.findById(req.params.id);
        if (!proyecto) {
            return res.status(404).send('Proyecto not found');
        }
        res.json(proyecto);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Update a Proyecto by ID
router.put('/:id', async (req, res) => {
    try {
        const proyecto = await Proyecto.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!proyecto) {
            return res.status(404).send('Proyecto not found');
        }
        res.json(proyecto);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Delete a Proyecto by ID
router.delete('/:id', async (req, res) => {
    try {
        const proyecto = await Proyecto.findByIdAndDelete(req.params.id);
        if (!proyecto) {
            return res.status(404).send('Proyecto not found');
        }
        res.send('Proyecto deleted');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = router;
