const userService = require('../services/userService');
const asyncHandler = require('express-async-handler');

const createUser = asyncHandler(async (req, res) => {
  const user = await userService.createUser(req.body);
  res.status(201).json(user);
});

const getUsers = asyncHandler(async (req, res) => {
  const users = await userService.getUsers();
  res.status(200).json(users);
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  if (!user) {
    res.status(404).json({ message: 'User not found' });
  }
  res.status(200).json(user);
});

const updateUser = asyncHandler(async (req, res) => {
  const user = await userService.updateUser(req.params.id, req.body);
  if (!user) {
    res.status(404).json({ message: 'User not found' });
  }
  res.status(200).json(user);
});

const deleteUser = asyncHandler(async (req, res) => {
  const user = await userService.deleteUser(req.params.id);
  if (!user) {
    res.status(404).json({ message: 'User not found' });
  }
  res.status(200).json({ message: 'User deleted' });
});

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
};