const cacheQueue = require('../jobs/cacheQueue');

const addCacheJob = async (action, key, value) => {
    try {
        const job = await cacheQueue.add({
            action,
            key,
            value
        });
        return job;
    } catch (error) {
        console.error('Error adding job to queue:', error);
        throw new Error('Failed to add job to queue');
    }
};

const getAllJobs = async () => {
    try {
        const jobs = await cacheQueue.getJobs(['waiting', 'active', 'completed', 'failed']);
        if (!jobs) {
            throw new Error('No jobs found in the queue');
        }
        const jobDetails = await Promise.all(jobs.map(async (job) => {
            return {
                id: job.id,
                state: await job.getState(),
                progress: job.progress,
                data: job.data,
                finishedOn: job.finishedOn,
                failedReason: job.failedReason,
            };
        }));

        return jobDetails;
    } catch (error) {
        console.error('Error fetching all jobs:', error);
        throw new Error('Failed to fetch all jobs');
    }
};


const getJobStatus = async (jobId) => {
    try {
        const job = await cacheQueue.getJob(jobId);
        if (job) {
            return job.getState();
        } else {
            throw new Error('Job not found');
        }
    } catch (error) {
        console.error('Error fetching job status:', error);
        throw new Error('Failed to fetch job status');
    }
};

module.exports = {
    addCacheJob,
    getJobStatus,
    getAllJobs
};
