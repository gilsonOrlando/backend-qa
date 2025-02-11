const express = require('express');
const router = express.Router();

const PautaController = require('../controllers/PautaController');
const ListaVerificacionController = require('../controllers/ListaVerificacionController');
const MetricaController = require('../controllers/MetricaController');
const SubcaracteristicaController = require('../controllers/SubcaracteristicaController');
const ProyectoController = require('../controllers/ProyectoController');
const RespuestaController = require('../controllers/RespuestaController');
const calculosController = require('../controllers/CalculosController')
const SonarQubeController = require('../controllers/SonarQube');
const CriteriosValoracion = require('../controllers/CriteriosValoracionController');
const ValoracionMantenibilidad = require('../controllers/ValoracionMantenibilidadController');
const PropiedadCalidad = require('../controllers/PropiedadCalidadController');

router.use('/pautas', PautaController);
router.use('/listasVerificacion', ListaVerificacionController);
router.use('/metricas', MetricaController);
router.use('/subcaracteristicas', SubcaracteristicaController);
router.use('/proyectos', ProyectoController);
router.use('/respuestas', RespuestaController);
router.use('/calculos', calculosController)
router.use('/sonarqube', SonarQubeController);
router.use('/criteriosValoracion', CriteriosValoracion);
router.use('/valoracionMantenibilidad', ValoracionMantenibilidad);
router.use('/propiedadCalidad', PropiedadCalidad);

module.exports = router;
