const express = require('express');
const router = express.Router();

const PautaController = require('../controllers/PautaController');
const ListaVerificacionController = require('../controllers/ListaVerificacionController');
const MetricaController = require('../controllers/MetricaController');
const SubcaracteristicaController = require('../controllers/SubcaracteristicaController');
const ProyectoController = require('../controllers/ProyectoController');
const RespuestaController = require('../controllers/RespuestaController');
const calculosController = require('../controllers/CalculosController')

router.use('/pautas', PautaController);
router.use('/listasVerificacion', ListaVerificacionController);
router.use('/metricas', MetricaController);
router.use('/subcaracteristicas', SubcaracteristicaController);
router.use('/proyectos', ProyectoController);
router.use('/respuestas', RespuestaController);
router.use('/calculos', calculosController)

module.exports = router;
