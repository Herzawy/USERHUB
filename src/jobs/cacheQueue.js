const Queue = require('bull');
const cache = require('../utils/cache');
const cacheService = require('../services/cacheService');
const CACHE_EXPIRATION = parseInt(process.env.CACHE_EXPIRATION) || 3;
const REDIS_PORT = parseInt(process.env.REDIS_PORT) || 6379;
const cacheQueue = new Queue('cacheQueue', {
    redis: {
        host: 'redis',
        port: REDIS_PORT,
    }
});
cacheQueue.on('error', (err) => {
    console.error('Queue error:', err);
});

cacheQueue.process(async (job) => {
    const { action, key, value } = job.data;

    switch (action) {
        case 'set':
            await cache.set(key, value);
            break;

        case 'del':
            await cache.del(key);
            break;

        case 'update':
            await cacheService.updateAllUsersInCache(CACHE_EXPIRATION);
            break;

        default:
            console.error('Unknown cache action');
    }
});

module.exports = cacheQueue;
