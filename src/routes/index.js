const express = require('express');
const router = express.Router();

const PautaController = require('../controllers/PautaController');
const ListaVerificacionController = require('../controllers/ListaVerificacionController');
const MetricaController = require('../controllers/MetricaController');
const SubcaracteristicaController = require('../controllers/SubcaracteristicaController');
const ProyectoController = require('../controllers/ProyectoController');

router.use('/pautas', PautaController);
router.use('/listasVerificacion', ListaVerificacionController);
router.use('/metricas', MetricaController);
router.use('/subcaracteristicas', SubcaracteristicaController);
router.use('/proyectos', ProyectoController);

module.exports = router;
