import User from '../models/User.js';
import { generateRandomPassword } from '../utils/password.js';
import { sendEmail } from '../utils/email.js';

/**
 * Create a new employee
 * @param {object} employeeData - Employee data
 * @returns {object} Created employee
 */
const createEmployee = async (employeeData) => {
  const { name, email, salary, workHours } = employeeData;

  if (!name || !email) {
    throw new Error('Name and email are required');
  }

  const password = generateRandomPassword();

  const employee = new User({
    name,
    email,
    password,
    role: 'employee',
    salary: salary || 0,
    workHours: workHours || 8,
    employeeType: employeeData.employeeType || 'Full Time',
    designation: employeeData.designation || 'Employee'
  });

  await employee.save();

  return {
    id: employee._id,
    name: employee.name,
    email: employee.email,
    salary: employee.salary,
    workHours: employee.workHours,
    password // Return password so admin can share it
  };
};

/**
 * Get all employees
 * @returns {array} List of employees
 */
const getAllEmployees = async () => {
  return await User.find({ role: 'employee' })
    .select('-password')
    .sort({ createdAt: -1 });
};

/**
 * Get employee by ID
 * @param {string} employeeId - Employee ID
 * @returns {object} Employee data
 */
const getEmployeeById = async (employeeId) => {
  const employee = await User.findById(employeeId).select('-password');

  if (!employee || employee.role !== 'employee') {
    throw new Error('Employee not found');
  }

  return employee;
};

/**
 * Update employee salary
 * @param {string} employeeId - Employee ID
 * @param {number} salary - New salary
 * @returns {object} Updated employee
 */
const updateEmployeeSalary = async (employeeId, salary) => {
  if (salary === undefined || salary < 0) {
    throw new Error('Valid salary is required');
  }

  const employee = await User.findByIdAndUpdate(
    employeeId,
    { salary },
    { new: true }
  ).select('-password');

  if (!employee || employee.role !== 'employee') {
    throw new Error('Employee not found');
  }

  return employee;
};

/**
 * Update employee work hours
 * @param {string} employeeId - Employee ID
 * @param {number} workHours - New work hours
 * @returns {object} Updated employee
 */
const updateEmployeeWorkHours = async (employeeId, workHours) => {
  if (workHours === undefined || workHours < 0) {
    throw new Error('Valid work hours is required');
  }

  const employee = await User.findByIdAndUpdate(
    employeeId,
    { workHours },
    { new: true }
  ).select('-password');

  if (!employee || employee.role !== 'employee') {
    throw new Error('Employee not found');
  }

  return employee;
};

const changePassword = async (userId, newPassword) => {
  if (!newPassword || newPassword.length < 6) throw new Error('Password must be at least 6 characters');

  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  user.password = newPassword;
  await user.save(); // pre-save hook will hash

  return { id: user._id, email: user.email };
};

const changeOwnPassword = async (userId, oldPassword, newPassword, newEmail) => {
  if (!oldPassword || !newPassword) throw new Error('Old and new passwords are required');
  if (newPassword.length < 6) throw new Error('Password must be at least 6 characters');

  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  const matches = await user.comparePassword(oldPassword);
  if (!matches) throw new Error('Old password is incorrect');

  user.password = newPassword;

  // Update email if provided and different
  if (newEmail && newEmail !== user.email) {
    // Check if email is already taken
    const existing = await User.findOne({ email: newEmail });
    if (existing && existing._id.toString() !== userId.toString()) {
      throw new Error('Email is already in use');
    }
    user.email = newEmail;
  }

  await user.save();

  return { id: user._id, email: user.email, role: user.role };
};

const terminateEmployee = async (userId, reason) => {
  if (!reason) throw new Error('Termination reason is required');

  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  user.status = 'terminated';
  user.terminationReason = reason;
  await user.save();

  // Send termination email
  try {
    await sendEmail({
      to: user.email,
      subject: 'Important: Termination of Employment',
      text: `Dear ${user.name},\n\nWe regret to inform you that your employment has been terminated effective immediately.\n\nReason: ${reason}\n\nPlease contact HR for further details.\n\nRegards,\nManagement`
    });
  } catch (err) {
    console.error('Failed to send termination email:', err);
  }

  return { id: user._id, email: user.email, status: user.status };
};

const promoteEmployee = async (userId, newDesignation, promotedBy) => {
  if (!newDesignation) throw new Error('New designation is required');

  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  // Add to history
  user.promotionHistory.push({
    designation: user.designation,
    date: new Date(),
    promotedBy
  });

  user.designation = newDesignation;
  await user.save();

  // Send promotion email
  try {
    await sendEmail({
      to: user.email,
      subject: 'Congratulations on your Promotion!',
      text: `Dear ${user.name},\n\nWe are pleased to inform you that you have been promoted to: ${newDesignation}!\n\nCongratulations on this well-deserved achievement.\n\nRegards,\nManagement`
    });
  } catch (err) {
    console.error('Failed to send promotion email:', err);
  }

  return user;
};

export {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployeeSalary,
  updateEmployeeWorkHours,
  changePassword,
  changeOwnPassword,

  terminateEmployee,
  promoteEmployee
};
