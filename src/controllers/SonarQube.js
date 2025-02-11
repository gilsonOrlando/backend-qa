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
    console.log('nombre' + name)
    console.log('proyecto' + project)
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
        if (response.status === 204) {
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

router.get('/measures/component_tree', checkAuth, async (req, res) => {
    const { component, metricKeys } = req.query;

    console.log(req.headers.cookie);  // Esto puede ayudarte a verificar que la autenticación funciona correctamente.

    try {
        // Realizamos la solicitud al endpoint component_tree de SonarQube
        const response = await axios.get(`${SONARQUBE_URL}/api/measures/component_tree`, {
            params: { component, metricKeys },
            headers: {
                'Content-Type': 'application/json',
            }
        });

        // Verificamos si la respuesta fue exitosa
        if (response.status === 200) {
            // Si todo está bien, respondemos con los datos obtenidos
            return res.status(200).json({
                message: 'Component tree measures fetched successfully',
                data: response.data,
            });
        } else {
            // Si no fue exitoso, respondemos con un error
            return res.status(401).json({
                message: 'Failed to fetch component tree measures',
            });
        }
    } catch (error) {
        console.error('Error fetching component tree measures:', error);
        // Si ocurrió un error, respondemos con el mensaje de error
        return res.status(500).json({
            message: 'Error fetching component tree measures',
            error: error.message,
        });
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
            response = null;
        } else {
            return res.status(400).json({ message: 'Error al crear el proyecto', error: response.data });
        }
    } catch (error) {
        console.error('Error al crear el proyecto:', error);
        return res.status(500).json({ message: 'Error al crear el proyecto', error: error.message });
    }
});

router.get('/issues', checkAuth, async (req, res) => {
    const { projectKey } = req.query; // Se espera recibir el projectKey como parámetro en la URL

    if (!projectKey) {
        return res.status(400).json({ message: 'Se requiere el parámetro projectKey' });
    }

    try {
        const response = await axios.get(`${SONARQUBE_URL}/api/issues/search`, {
            params: { componentKeys: projectKey },
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.status === 200) {
            const issues = response.data.issues.map(issue => ({
                archivo: issue.component,
                linea: issue.line || 'No especificado',
                regla: issue.rule,
                severidad: issue.severity,
                descripcion: issue.message,
                estado: issue.status,
                tipo: issue.type,
                tiempo_estimado: issue.effort,
                categoria: issue.tags || 'No disponible',
                linea_afectada: issue.textRange
            }));

            return res.status(200).json({ message: 'Issues obtenidos correctamente', issues });
        } else {
            return res.status(400).json({ message: 'Error al obtener issues' });
        }
    } catch (error) {
        console.error('Error al obtener issues:', error);
        return res.status(500).json({ message: 'Error al obtener issues', error: error.message });
    }
});

// Obtener el contenido en bruto (raw) de un archivo fuente en SonarQube
router.get('/raw', checkAuth, async (req, res) => {
    const { key } = req.query; // Se espera recibir el parámetro "key" del archivo

    if (!key) {
        return res.status(400).json({ message: 'Se requiere el parámetro key' });
    }
    console.log(`Obteniendo raw data para la clave: ${key}`);

    try {
        const response = await axios.get(`${SONARQUBE_URL}/api/sources/raw`, {
            params: { key },
            headers: {
                'Content-Type': 'application/json'
            }
        });
        console.log(`Respuesta de SonarQube: ${response.status}`);

        if (response.status === 200) {
            return res.status(200).json({ message: 'Raw data fetched successfully', rawData: response.data });
        } else {
            return res.status(400).json({ message: 'Failed to fetch raw data' });
        }
    } catch (error) {
        console.error('Error fetching raw data:', error);
        return res.status(500).json({ message: 'Error fetching raw data', error: error.message });
    }
});

router.get("/sonar-file", checkAuth, async (req, res) => {
    console.log("Se recibió una petición a /api/sonarqube/sonar-file con key:", req.query.key);

    const token = "304b8ac9ea8cfb88084de6f21609e4ccf9068126";
    const fileKey = req.query.key;

    try {
        const response = await axios.get(`https://sonarcloud.io/api/sources/raw?key=${fileKey}`, {
            headers: {
                "Authorization": `Bearer ${token}`,
                
                  // Asegura que se reciba como texto
            },
            responseType: "text",
        });
        res.setHeader("Content-Type", "text/plain");
        res.send(response.data);
    } catch (error) {
        console.error("Error en la petición a SonarCloud:", error.response ? error.response.data : error.message);
        res.status(500).json({ message: "Error al obtener el archivo" });
    }
});

module.exports = router;
