import * as employeeService from '../services/employeeService.js';
import * as taskService from '../services/taskService.js';
import * as timeEntryService from '../services/timeEntryService.js';
import * as leaveService from '../services/leaveService.js';
import * as meetingService from '../services/meetingService.js';

/**
 * Create a new employee
 */
const createEmployee = async (req, res) => {
  try {
    const employee = await employeeService.createEmployee(req.body);
    res.status(201).json({
      message: 'Employee created successfully',
      employee
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    if (error.message === 'Name and email are required') {
      return res.status(400).json({ message: error.message });
    }
    console.error('Create employee error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get all employees
 */
const getAllEmployees = async (req, res) => {
  try {
    const employees = await employeeService.getAllEmployees();
    res.json(employees);
  } catch (error) {
    console.error('Get employees error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Update employee salary
 */
const updateEmployeeSalary = async (req, res) => {
  try {
    const { salary } = req.body;
    const employee = await employeeService.updateEmployeeSalary(req.params.id, salary);
    res.json({
      message: 'Salary updated successfully',
      employee
    });
  } catch (error) {
    if (error.message === 'Valid salary is required' || error.message === 'Employee not found') {
      return res.status(error.message === 'Employee not found' ? 404 : 400).json({ message: error.message });
    }
    console.error('Update salary error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Update employee work hours
 */
const updateEmployeeWorkHours = async (req, res) => {
  try {
    const { workHours } = req.body;
    const employee = await employeeService.updateEmployeeWorkHours(req.params.id, workHours);
    res.json({
      message: 'Work hours updated successfully',
      employee
    });
  } catch (error) {
    if (error.message === 'Valid work hours is required' || error.message === 'Employee not found') {
      return res.status(error.message === 'Employee not found' ? 404 : 400).json({ message: error.message });
    }
    console.error('Update work hours error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Assign task to employee
 */
const assignTask = async (req, res) => {
  try {
    const task = await taskService.createTask(req.body, req.user._id);
    res.status(201).json({
      message: 'Task assigned successfully',
      task
    });
  } catch (error) {
    if (error.message === 'Title and assignedTo are required' || error.message === 'Employee not found') {
      return res.status(error.message === 'Employee not found' ? 404 : 400).json({ message: error.message });
    }
    console.error('Assign task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get all tasks
 */
const getAllTasks = async (req, res) => {
  try {
    const tasks = await taskService.getAllTasks();
    res.json(tasks);
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get employee time entries
 */
const getEmployeeTimeEntries = async (req, res) => {
  try {
    const { month, year } = req.query;
    const timeEntries = await timeEntryService.getTimeEntries(req.params.id, month, year);
    res.json(timeEntries);
  } catch (error) {
    console.error('Get time entries error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Admin: change a user's password
 */
const changeUserPassword = async (req, res) => {
  try {
    // Restrict admin password change to self only
    if (req.params.id !== String(req.user._id)) {
      return res.status(403).json({ message: 'Admins may only change their own password' });
    }

    const { password } = req.body;
    if (!password) return res.status(400).json({ message: 'Password is required' });

    const result = await employeeService.changePassword(req.params.id, password);
    res.json({ message: 'Password changed', user: result });
  } catch (error) {
    if (error.message === 'User not found' || error.message.startsWith('Password')) {
      return res.status(400).json({ message: error.message });
    }
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get all leave requests
 */
const getAllLeaves = async (req, res) => {
  try {
    const leaves = await leaveService.getAllLeaves();
    res.json(leaves);
  } catch (error) {
    console.error('Get leaves error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Approve or decline a leave
 */
const decideLeave = async (req, res) => {
  try {
    const { status } = req.body;
    const leave = await leaveService.decideLeave(req.params.id, req.user._id, status);
    res.json({ message: `Leave ${status}`, leave });
  } catch (error) {
    if (error.message === 'Leave not found' || error.message === 'Invalid status') {
      return res.status(400).json({ message: error.message });
    }
    console.error('Decide leave error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Schedule a meeting
 */
const createMeeting = async (req, res) => {
  try {
    const meeting = await meetingService.createMeeting(req.body, req.user._id);
    res.status(201).json({ message: 'Meeting created', meeting });
  } catch (error) {
    console.error('Create meeting error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getAllMeetings = async (req, res) => {
  try {
    const meetings = await meetingService.getAllMeetings();
    res.json(meetings);
  } catch (error) {
    console.error('Get all meetings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const terminateEmployee = async (req, res) => {
  try {
    const { reason } = req.body;
    const result = await employeeService.terminateEmployee(req.params.id, reason);
    res.json({ message: 'Employee terminated successfully', result });
  } catch (error) {
    if (error.message === 'Termination reason is required' || error.message === 'User not found') {
      return res.status(400).json({ message: error.message });
    }
    console.error('Terminate employee error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export {
  createEmployee,
  getAllEmployees,
  updateEmployeeSalary,
  updateEmployeeWorkHours,
  assignTask,
  getAllTasks,
  getEmployeeTimeEntries,
  changeUserPassword,
  getAllLeaves,
  decideLeave,
  createMeeting,
  getAllMeetings,
  terminateEmployee
};
