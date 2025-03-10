const express = require('express');
const Respuesta = require('../models/Respuesta');
const router = express.Router();

router.get('/promedios/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Depuración: Verificar ID recibido
        console.log('ID recibido:', id);

        // Obtener la respuesta específica por ID
        const respuesta = await Respuesta.findById(id)
            .populate('respuestas.pautaId', 'descripcion pregunta nivelesCumplimiento') // Cargar campos necesarios de Pauta
            .populate('respuestas.listaVerificacion', 'nombre'); // Cargar campos necesarios de ListaVerificacion

        // Depuración: Verificar la respuesta obtenida
        console.log('Respuesta obtenida:', respuesta);

        if (!respuesta) {
            return res.status(404).json({ message: 'No se encontró la respuesta' });
        }

        const calculos = [];
        let totalSum = 0;
        let totalCount = 0;

        if (respuesta.tipo === 'allSubcaracteristicas' || respuesta.tipo === 'singleSubcaracteristica' || respuesta.tipo === 'allMetricas' || respuesta.tipo === 'singleMetrica') {
            const listaVerificaciones = {};

            // Agrupar las respuestas por lista de verificación
            for (const pauta of respuesta.respuestas) {
                const pautaId = pauta.pautaId; // Obtenemos la pauta
                const valor = pauta.valor || 0;
                const comentario = pauta.comentario || 'Sin comentario'; // Agregar el comentario de la pauta

                // Asegurarnos de que la pauta y lista de verificación están cargadas
                if (!pautaId || !pauta.listaVerificacion) continue;

                const listaVerificacion = pauta.listaVerificacion;
                const nivelCumplimiento = pautaId.nivelesCumplimiento.find(nc => nc.valor === valor);
                const nivelCumplimientoDescripcion = nivelCumplimiento?.descripcion || 'Nivel desconocido';    
                console.log(nivelCumplimiento)
                console.log(nivelCumplimientoDescripcion)           

                if (!listaVerificaciones[listaVerificacion._id]) {
                    listaVerificaciones[listaVerificacion._id] = { sum: 0, count: 0, nombre: listaVerificacion.nombre, comentarios: [] };
                }

                listaVerificaciones[listaVerificacion._id].sum += valor;
                listaVerificaciones[listaVerificacion._id].count += 1;
                listaVerificaciones[listaVerificacion._id].comentarios.push({
                    pregunta: pautaId.pregunta,
                    respuesta: nivelCumplimientoDescripcion,
                    comentario
                });
            }

            // Calcular promedio por cada lista de verificación
            for (const data of Object.values(listaVerificaciones)) {
                if (data.count > 0) {
                    const promedio = data.sum / data.count;
                    calculos.push({
                        nombre: `${data.nombre}`,
                        valor: data.valor,
                        promedio,
                        comentarios: data.comentarios
                    });
                    totalSum += data.sum;
                    totalCount += data.count;
                }
            }
        }

        // Agregar el promedio total
        if (totalCount > 0) {
            const promedioTotal = totalSum / totalCount;
            calculos.push({ nombre: 'Promedio Total', promedio: promedioTotal, comentarios: [] });
        }

        console.log('Cálculos calculados:', calculos);

        res.status(200).json(calculos);
    } catch (error) {
        console.error('Error al obtener cálculos:', error);
        res.status(500).json({ error: 'Error al obtener cálculos' });
    }
});

module.exports = router;
