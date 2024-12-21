const redis = require('redis');
const userService = require('../../services/userService');
const User = require('../../models/User');
const cacheQueue = require('../../jobs/cacheQueue');
const cache = require('../../utils/cache');

jest.mock('redis', () => ({
  createClient: jest.fn(() => ({
    connect: jest.fn(),
    quit: jest.fn(),
    on: jest.fn(),
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
  })),
}));

let redisClient;

jest.mock('../../models/User');
jest.mock('../../jobs/cacheQueue');
jest.mock('../../utils/cache');

beforeAll(() => {
  redisClient = redis.createClient({
    url: process.env.REDIS_URI || 'redis://localhost:6379',
  });

  redisClient.connect();
});

afterAll(async () => {
  await redisClient.quit();
});

describe('UserService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    console.log = jest.fn();
  });

  // Test createUser
  it('should create a user and add cache job to the queue', async () => {
    const userData = { name: 'John Doe', email: 'john@example.com' };

    const mockUser = { _id: '67634c9df84cf4e60d11cf29', ...userData };
    User.create.mockResolvedValue(mockUser);

    // Mock cacheQueue.add to resolve without doing anything
    cacheQueue.add.mockResolvedValue();

    const result = await userService.createUser(userData);

    expect(result).toEqual(mockUser); // Expect the result to be the mock user
    expect(User.create).toHaveBeenCalledWith(userData); // Expect User.create to be called with userData
    expect(cacheQueue.add).toHaveBeenCalledWith({
      action: 'set',
      key: `users:${mockUser._id}`,
      value: JSON.stringify(mockUser),
    }); // Expect the cache job to be added
  });

  // Test getUsers
  it('should fetch users from cache if present', async () => {
    const cachedUsers = '[{"_id": "67634c9df84cf4e60d11cf29", "name": "John Doe"}]';
    cache.get.mockResolvedValue(cachedUsers); // Mock the cache to return cached users

    const result = await userService.getUsers();

    expect(result).toEqual(JSON.parse(cachedUsers)); // Expect the result to be the cached users
    expect(cache.get).toHaveBeenCalledWith('users'); // Expect the cache to be queried for users
    expect(User.find).not.toHaveBeenCalled(); // Ensure that User.find was not called (since data is cached)
  });

  // Test getUserById
  it('should fetch a user by ID and cache it if not cached', async () => {
    const userId = '67634c9df84cf4e60d11cf29';
    const mockUser = { _id: userId, name: 'John Doe' };

    cache.get.mockResolvedValue(null); // Simulate that the user is not cached
    User.findById.mockResolvedValue(mockUser); // Mock User.findById to return the user

    const result = await userService.getUserById(userId);

    expect(result).toEqual(mockUser); // Expect the result to be the mock user
    expect(cache.get).toHaveBeenCalledWith(`users:${userId}`); // Expect cache to be checked
    expect(User.findById).toHaveBeenCalledWith(userId); // Expect User.findById to be called with the correct ID
    expect(cacheQueue.add).toHaveBeenCalledWith({
      action: 'set',
      key: `users:${userId}`,
      value: JSON.stringify(mockUser),
    }); // Expect the cache job to be added
  });

  // Test updateUser
  it('should update a user and update cache', async () => {
    const userId = '67634c9df84cf4e60d11cf29';
    const userData = { name: 'John Doe Updated' };
    const mockUpdatedUser = { _id: userId, ...userData };

    // Mock User.findByIdAndUpdate to return the updated user
    User.findByIdAndUpdate.mockResolvedValue(mockUpdatedUser);
    cacheQueue.add.mockResolvedValue(); // Mock cacheQueue.add to resolve without doing anything

    const result = await userService.updateUser(userId, userData);

    expect(result).toEqual(mockUpdatedUser); // Expect the updated user to be returned
    expect(User.findByIdAndUpdate).toHaveBeenCalledWith(userId, userData, { new: true });
    expect(cacheQueue.add).toHaveBeenCalledWith({
      action: 'set',
      key: `users:${userId}`,
      value: JSON.stringify(mockUpdatedUser),
    });
    expect(cacheQueue.add).toHaveBeenCalledWith({
      action: 'update',
      key: 'users',
    }); // Expect cache update job to be queued
  });

  // Test deleteUser
  it('should delete a user and invalidate cache', async () => {
    const userId = '67634c9df84cf4e60d11cf29';
    const mockUser = { _id: userId, name: 'John Doe' };

    // Mock User.findByIdAndDelete to return the deleted user
    User.findByIdAndDelete.mockResolvedValue(mockUser);
    cacheQueue.add.mockResolvedValue(); // Mock cacheQueue.add to resolve without doing anything

    const result = await userService.deleteUser(userId);

    expect(result).toEqual(mockUser); // Expect the deleted user to be returned
    expect(User.findByIdAndDelete).toHaveBeenCalledWith(userId);
    expect(cacheQueue.add).toHaveBeenCalledWith({
      action: 'del',
      key: `users:${userId}`,
    });
    expect(cacheQueue.add).toHaveBeenCalledWith({
      action: 'update',
      key: 'users',
    }); // Expect cache update job to be queued
  });
});
