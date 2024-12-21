const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');

router.get('/jobs', jobController.getAllJobs);

router.get('/jobs/:id', jobController.getJobStatus);

module.exports = router;
