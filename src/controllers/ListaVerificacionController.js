const express = require('express');
const router = express.Router();
const ListaVerificacion = require('../models/ListaDeVerificacion');
const mongoose = require('mongoose');

// Create a new ListaVerificacion
router.post('/', async (req, res) => {
    try {
        const newLista = new ListaVerificacion(req.body);
        const lista = await newLista.save();
        res.json(lista);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Get all ListasVerificacion
router.get('/', async (req, res) => {
    try {
        const listas = await ListaVerificacion.find().populate('pautas');
        res.json(listas);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Get a single ListaVerificacion by ID
router.get('/:id', async (req, res) => {
    try {
        const lista = await ListaVerificacion.findById(req.params.id).populate('pautas');
        if (!lista) {
            return res.status(404).send('ListaVerificacion not found');
        }
        res.json(lista);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.get('/availablePautas/:id', async (req, res) => {
    try {
        const listaVerificacionId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(listaVerificacionId)) {
            return res.status(400).json({ error: 'ID de Lista de Verificación no es válido' });
        }

        const listaVerificacion = await ListaVerificacion.findById(listaVerificacionId);

        if (!listaVerificacion) {
            return res.status(404).json({ error: 'Lista de Verificación no encontrada' });
        }

        res.status(200).json(listaVerificacion.pautas);
    } catch (error) {
        console.error('Error al obtener pautas disponibles:', error);
        res.status(500).json({ error: 'Error al obtener pautas disponibles' });
    }
});

// llamar a las listas de verificación para listarlas 
router.post('/batch', async (req, res) => {
    try {
        const { ids } = req.body;
        const listasVerificacion = await ListaVerificacion.find({ _id: { $in: ids } });
        res.json(listasVerificacion);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener listas de verificación' });
    }
});


// Update a ListaVerificacion by ID
router.put('/:id', async (req, res) => {
    try {
        const lista = await ListaVerificacion.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('pautas');
        if (!lista) {
            return res.status(404).send('ListaVerificacion not found');
        }
        res.json(lista);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Delete a ListaVerificacion by ID
router.delete('/:id', async (req, res) => {
    try {
        const lista = await ListaVerificacion.findByIdAndDelete(req.params.id);
        if (!lista) {
            return res.status(404).send('ListaVerificacion not found');
        }
        res.send('ListaVerificacion deleted');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = router;
