const express = require('express');
const axios = require('axios');
const router = express.Router();
const cookieParser = require('cookie-parser');
const ngrok = require('ngrok');

// URL base de SonarQube
const SONARQUBE_URL = 'https://sonarcloud.io';
let sonarQubeSessionToken = 'bda650c195bd537f57431c78763720da67937d7d';

// Configurar el middleware para manejar cookies
router.use(cookieParser());

// Middleware para verificar autenticación
const checkAuth = (req, res, next) => {
    if (!sonarQubeSessionToken) {
        return res.status(401).json({ message: 'Not authenticated' });
    }
    next();
};


// Login a SonarQube
router.get('/login', async (req, res) => {

    try {
        const response = await axios.get(`${SONARQUBE_URL}/api/authentication/validate`, null, {
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.status === 200) {

            // Obtener el token de la respuesta, si está disponible
            sonarQubeSessionToken = `Bearer ${response.data.token}`; // Ajusta según cómo obtengas el token
            console.log(sonarQubeSessionToken)
            return res.status(200).json({ message: 'Login successful' });
        } else {
            return res.status(401).json({ message: 'Login failed' });
        }
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ message: 'Error during login', error: error.message });
    }
});


router.post('/rename', async (req, res) => {
    const { name, project } = req.body;
    console.log('nombre'+name)
    console.log('proyecto'+project)
    const keyProyecto = `gilsonOrlando_${project}`;
    try {
        const response = await axios.post(`${SONARQUBE_URL}/api/project_branches/rename`, null, {
            params: { 
                name: name, 
                project: keyProyecto
            },
            headers: {
                'Authorization': 'Bearer 304b8ac9ea8cfb88084de6f21609e4ccf9068126',
                'Content-Type': 'application/json'
            }
        });
        if (response.status === 204){
            console.log('rename successfully')
            return res.status(200).json({ message: 'Rename Change Successfully' })
        }
    } catch (error) {
        return res.status(500).json({ message: 'Error Rename Change', error })
    }
}
)

// Obtener todas las metricKeys de SonarQube
router.get('/metrics', checkAuth, async (req, res) => {
    try {
        const response = await axios.get(`${SONARQUBE_URL}/api/metrics/search`, null, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.status === 200) {
            const metricKeys = response.data.metrics.map(metric => metric.key);
            return res.status(200).json({ message: 'Metrics fetched successfully', metricKeys });
        } else {
            return res.status(401).json({ message: 'Failed to fetch metrics' });
        }
    } catch (error) {
        console.error('Error fetching metrics:', error);
        return res.status(500).json({ message: 'Error fetching metrics', error: error.message });
    }
});

// Obtener medidas de SonarQube
router.get('/measures', checkAuth, async (req, res) => {
    const { component, metricKeys } = req.query;
    console.log(req.headers.cookie)
    try {
        const response = await axios.get(`${SONARQUBE_URL}/api/measures/component`, {
            params: { component, metricKeys },
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (response.status === 200) {
            return res.status(200).json({ message: 'Measures fetched successfully', data: response.data });
        } else {
            return res.status(401).json({ message: 'Failed to fetch measures' });
        }
    } catch (error) {
        console.error('Error fetching measures:', error);
        return res.status(500).json({ message: 'Error fetching measures', error: error.message });
    }
});

// Crear un nuevo proyecto en SonarCloud
router.post('/proyectos/crear', checkAuth, async (req, res) => {
    const { nombreProyecto } = req.body;

    // Crear el key del proyecto siguiendo la estructura gilsonOrlando_nombreProyecto
    const keyProyecto = `gilsonOrlando_${nombreProyecto}`;

    try {
        // Realizar la solicitud a SonarCloud para crear el proyecto
        const response = await axios.post(`${SONARQUBE_URL}/api/projects/create`, null, {
            params: {
                name: nombreProyecto,
                organization: 'gilsonorlando', // Organización fija
                project: keyProyecto,
                visibility: 'public' // Puedes cambiar a 'private' si es necesario
            },
            headers: {
                'Authorization': sonarQubeSessionToken, // Asegúrate de que el token esté configurado correctamente
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        if (response.status === 200) {
            return res.status(200).json({ message: 'Proyecto creado exitosamente', data: response.data });
        } else {
            return res.status(400).json({ message: 'Error al crear el proyecto', error: response.data });
        }
    } catch (error) {
        console.error('Error al crear el proyecto:', error);
        return res.status(500).json({ message: 'Error al crear el proyecto', error: error.message });
    }
});


module.exports = router;
