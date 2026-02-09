import User from '../models/User.js';
import { generateToken } from '../utils/jwt.js';

/**
 * Authenticate user and return token
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {object} Token and user data
 */
export const login = async (email, password) => {
  if (!email || !password) {
    throw new Error('Please provide email and password');
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  const token = generateToken(user._id);

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  };
};

/**
 * Get user by ID
 * @param {string} userId - User ID
 * @returns {object} User data
 */
export const getUserById = async (userId) => {
  const user = await User.findById(userId).select('-password');
  if (!user) {
    throw new Error('User not found');
  }

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    salary: user.salary,
    workHours: user.workHours
  };
};
