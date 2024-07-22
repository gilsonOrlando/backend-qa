const express = require('express');
const router = express.Router();
const Pauta = require('../models/Pauta');

// Create a new Pauta
router.post('/', async (req, res) => {
    try {
        const newPauta = new Pauta(req.body);
        const pauta = await newPauta.save();
        res.json(pauta);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Get all Pautas
router.get('/', async (req, res) => {
    try {
        const pautas = await Pauta.find();
        res.json(pautas);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Get a single Pauta by ID
router.get('/:id', async (req, res) => {
    try {
        const pauta = await Pauta.findById(req.params.id);
        if (!pauta) {
            return res.status(404).send('Pauta not found');
        }
        res.json(pauta);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Update a Pauta by ID
router.put('/:id', async (req, res) => {
    try {
        const pauta = await Pauta.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!pauta) {
            return res.status(404).send('Pauta not found');
        }
        res.json(pauta);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Delete a Pauta by ID
router.delete('/:id', async (req, res) => {
    try {
        const pauta = await Pauta.findByIdAndDelete(req.params.id);
        if (!pauta) {
            return res.status(404).send('Pauta not found');
        }
        res.send('Pauta deleted');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = router;
