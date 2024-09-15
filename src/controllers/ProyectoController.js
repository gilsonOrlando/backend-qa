const express = require('express');
const router = express.Router();
const Proyecto = require('../models/Proyecto');

// Create a new Proyecto
router.post('/', async (req, res) => {
    try {
        const { nombre, link, idPersona, branch, githubtoken } = req.body;
        
        // Crear un nuevo proyecto con los campos correspondientes
        const newProyecto = new Proyecto({
            nombre,
            link,
            idPersona,
            branch,         // Añadir branch al proyecto
            githubtoken     // Añadir githubtoken al proyecto
        });
        
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

// Get all Proyectos by Persona ID
router.get('/persona/:idPersona', async (req, res) => {
    try {
        const proyectos = await Proyecto.find({ idPersona: req.params.idPersona });
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
        const { nombre, link, branch, githubtoken } = req.body;

        // Actualizar proyecto con los nuevos campos si están presentes
        const updatedProyecto = await Proyecto.findByIdAndUpdate(
            req.params.id,
            {
                ...(nombre && { nombre }),
                ...(link && { link }),
                ...(branch && { branch }),            // Actualizar branch si está en el request
                ...(githubtoken && { githubtoken })   // Actualizar githubtoken si está en el request
            },
            { new: true }
        );

        if (!updatedProyecto) {
            return res.status(404).send('Proyecto not found');
        }
        res.json(updatedProyecto);
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
