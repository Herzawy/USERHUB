const express = require("express");
require("dotenv").config();
const cors = require('cors');
const helmet = require('helmet');

require("./config/database");
const userRoutes = require("./routes/userRoutes");
const jobsRoutes = require("./routes/jobRoutes");
const setupSwagger = require("./config/swagger");
const errorHandler = require('./middleware/errorMiddleware');

const app = express();
app.use(cors()); 
app.use(helmet()); 
app.use(express.json());

// Swagger Documentation
setupSwagger(app);

// Routes
app.use("/api", userRoutes);
app.use("/api",jobsRoutes);

app.use(errorHandler);

module.exports = app;