const redis = require("redis");

const redisClient = redis.createClient({
    url: process.env.REDIS_URI || "redis://redis:6379",
});


redisClient.on("connect", () => {
    console.log("Redis client connected successfully.");
});


redisClient.on("error", (err) => {
    console.error("Redis error:", err);
});

(async () => {
    try {
        await redisClient.connect();
    } catch (err) {
        console.error("Failed to connect to Redis:", err);
        process.exit(1);
    }
})();

module.exports = redisClient;
