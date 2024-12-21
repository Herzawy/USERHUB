const User = require('../models/User');
const cacheQueue = require('../jobs/cacheQueue');
const cache = require('../utils/cache');

const mongoose = require('mongoose');

// Validate MongoDB ObjectId
function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

// Create a new user and add cache job to the queue
const createUser = async (userData) => {
  try {
    const user = await User.create(userData);

    // Add a job to set the user cache
    await cacheQueue.add({
      action: 'set',
      key: `users:${user._id}`,
      value: JSON.stringify(user)
    });
    await cacheQueue.add({
      action: 'update',
      key: 'users',
    });

    return user;
  } catch (error) {
    console.error('Error creating user:', error);
    throw new Error('Failed to create user: ' + error);
  }
};

// Fetch all users, caching the result if not present
const getUsers = async () => {
  try {
    const cachedUsers = await cache.get('users');

    if (cachedUsers) {
      return JSON.parse(cachedUsers);
    }

    const users = await User.find();

    // Add a job to set the users cache
    await cacheQueue.add({
      action: 'set',
      key: 'users',
      value: JSON.stringify(users)
    });

    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw new Error('Failed to fetch users');
  }
};

// Fetch a single user by ID, and add cache job to the queue
const getUserById = async (id) => {
  if (!isValidObjectId(id)) {
    throw new Error('Invalid user ID format');
  }
  try {
    const cachedUser = await cache.get(`users:${id}`);

    if (cachedUser) {
      return JSON.parse(cachedUser);
    }

    const user = await User.findById(id);
    if (!user) {
      throw new Error(`User with ID ${id} not found`);
    }

    // Add a job to set the user cache
    await cacheQueue.add({
      action: 'set',
      key: `users:${id}`,
      value: JSON.stringify(user)
    });

    return user;
  } catch (error) {
    console.error(`Error fetching user with ID ${id}:`, error);
    throw new Error('Failed to fetch user');
  }
};

// Update a user by ID, and add cache job to the queue
const updateUser = async (id, userData) => {
  if (!isValidObjectId(id)) {
    throw new Error('Invalid user ID format');
  }
  try {
    const user = await User.findByIdAndUpdate(id, userData, { new: true });
    if (!user) {
      throw new Error(`User with ID ${id} not found`);
    }


    await cacheQueue.add({
      action: 'set',
      key: `users:${id}`,
      value: JSON.stringify(user)
    });

    await cacheQueue.add({
      action: 'update',
      key: 'users',
    });

    return user;
  } catch (error) {
    console.error(`Error updating user with ID ${id}:`, error);
    throw new Error('Failed to update user');
  }
};

// Delete a user by ID, and add cache job to the queue
const deleteUser = async (id) => {
  if (!isValidObjectId(id)) {
    throw new Error('Invalid user ID format');
  }
  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      throw new Error(`User with ID ${id} not found`);
    }

    await cacheQueue.add({
      action: 'del',
      key: `users:${id}`,
    });

    await cacheQueue.add({
      action: 'update',
      key: 'users'
    });

    return user;
  } catch (error) {
    console.error(`Error deleting user with ID ${id}:`, error);
    throw new Error('Failed to delete user');
  }
};


module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser
};
