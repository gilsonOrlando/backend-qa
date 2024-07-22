const express = require('express');
const connectDB = require('./config/config');
const routes = require('./routes/index');
const cors = require('cors');

const app = express();

// Connect to the database
connectDB();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api', routes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
