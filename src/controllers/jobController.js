const jobService = require('../services/jobService');


const getAllJobs = async (req, res) => {
    try {
      const jobs = await jobService.getAllJobs();
      res.status(200).json({ jobs });
    } catch (error) {
      console.error('Error fetching jobs:', error);
      res.status(500).json({ error: 'Failed to fetch jobs' });
    }
  };
  
const getJobStatus = async (req, res) => {
  try {
    const jobId = req.params.id;
    const status = await jobService.getJobStatus(jobId);
    res.status(200).json({ jobId, status });
  } catch (error) {
    console.error('Error fetching job status:', error);
    res.status(500).json({ error: 'Failed to fetch job status' });
  }
};

module.exports = {
  getAllJobs,
  getJobStatus
};
