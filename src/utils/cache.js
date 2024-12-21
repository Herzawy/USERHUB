const redisClient = require('../config/redis');
const CACHE_EXPIRATION = parseInt(process.env.CACHE_EXPIRATION) || 3;

const set = async (key, value) => {
  await redisClient.set(key, value);
  await redisClient.expire(key, CACHE_EXPIRATION);

};

const get = async (key) => {
  return await redisClient.get(key);
};

const del = async (key) => {
  await redisClient.del(key);
};

module.exports = {
  set,
  get,
  del,
};