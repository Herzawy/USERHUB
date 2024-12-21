const cache = require('../utils/cache');
const User = require('../models/User');

const updateAllUsersInCache = async (expiration) => {
  try {
    const users = await User.find();
    await cache.set('users', JSON.stringify(users));
  } catch (error) {
    console.error('Error updating all users in cache:', error);
  }
};

module.exports = {
  updateAllUsersInCache
};
