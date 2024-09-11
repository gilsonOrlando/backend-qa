const express = require('express');
const axios = require('axios');
const router = express.Router();
const cookieParser = require('cookie-parser');
const ngrok = require('ngrok');

// URL base de SonarQube
const SONARQUBE_URL = 'http://localhost:9000';
let sonarQubeSessionToken = '';

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
router.post('/login', async (req, res) => {
    const { login, password } = req.body;

    try {
        const response = await axios.post(`${SONARQUBE_URL}/api/authentication/login`, null, {
            params: { login, password },
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.status === 200) {
           
            

            // Obtener el token de la respuesta, si está disponible
            sonarQubeSessionToken = `Bearer ${response.data.token}`; // Ajusta según cómo obtengas el token

            return res.status(200).json({ message: 'Login successful' });
        } else {
            return res.status(401).json({ message: 'Login failed' });
        }
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ message: 'Error during login', error: error.message });
    }
});

// Obtener todas las metricKeys de SonarQube
router.get('/metrics', checkAuth, async (req, res) => {
    try {
        const response = await axios.get(`${SONARQUBE_URL}/api/metrics/search`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': sonarQubeSessionToken,
                'Cookie': req.headers.cookie
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
                'Authorization': sonarQubeSessionToken,
                'Cookie': req.headers.cookie  // Pasa las cookies desde la solicitud del cliente
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

module.exports = router;
