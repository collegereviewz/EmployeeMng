import * as timeEntryService from '../services/timeEntryService.js';
import * as taskService from '../services/taskService.js'; // Corrected the import statement
import * as leaveService from '../services/leaveService.js';
import * as meetingService from '../services/meetingService.js';

/**
 * Record login time (clock in)
 */
const recordLoginTime = async (req, res) => {
  try {
    const timeEntry = await timeEntryService.recordLoginTime(req.user._id);
    res.status(201).json({
      message: 'Login time recorded',
      timeEntry
    });
  } catch (error) {
    if (error.message === 'Already logged in today') {
      return res.status(400).json({ message: error.message });
    }
    console.error('Login time error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Record logout time (clock out)
 */
const recordLogoutTime = async (req, res) => {
  try {
    const timeEntry = await timeEntryService.recordLogoutTime(req.user._id);
    res.json({
      message: 'Logout time recorded',
      timeEntry
    });
  } catch (error) {
    if (error.message === 'No active login found') {
      return res.status(400).json({ message: error.message });
    }
    console.error('Logout time error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get employee dashboard data
 */
const getDashboard = async (req, res) => {
  try {
    const dashboardData = await timeEntryService.getDashboardData(req.user._id);
    const tasks = await taskService.getEmployeeTasks(req.user._id);

    res.json({
      ...dashboardData,
      tasks: tasks.slice(0, 10) // Latest 10 tasks
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get all tasks assigned to employee
 */
const getTasks = async (req, res) => {
  try {
    const tasks = await taskService.getEmployeeTasks(req.user._id);
    res.json(tasks);
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Update task status
 */
const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const task = await taskService.updateTaskStatus(req.params.id, req.user._id, status);
    res.json({
      message: 'Task status updated',
      task
    });
  } catch (error) {
    if (error.message === 'Invalid status' || error.message === 'Task not found') {
      return res.status(error.message === 'Task not found' ? 404 : 400).json({ message: error.message });
    }
    console.error('Update task status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get monthly time entries
 */
const getTimeEntries = async (req, res) => {
  try {
    const { month, year, startDate, endDate } = req.query;
    const timeEntries = await timeEntryService.getTimeEntries(req.user._id, month, year, startDate, endDate);
    res.json(timeEntries);
  } catch (error) {
    console.error('Get time entries error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Apply for leave
 */
const applyLeave = async (req, res) => {
  try {
    const leave = await leaveService.applyLeave(req.user._id, req.body);
    res.status(201).json({ message: 'Leave applied', leave });
  } catch (error) {
    if (error.message === 'Start and end dates are required' || error.message === 'Employee not found') {
      return res.status(400).json({ message: error.message });
    }
    console.error('Apply leave error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get leaves for current employee
 */
const getMyLeaves = async (req, res) => {
  try {
    const leaves = await leaveService.getEmployeeLeaves(req.user._id);
    res.json(leaves);
  } catch (error) {
    console.error('Get my leaves error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const createMeetingForUser = async (req, res) => {
  try {
    const meeting = await meetingService.createMeeting(req.body, req.user._id);
    res.status(201).json({ message: 'Meeting created', meeting });
  } catch (error) {
    console.error('Create meeting error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getMyMeetings = async (req, res) => {
  try {
    const meetings = await meetingService.getMeetingsForUser(req.user._id);
    res.json(meetings);
  } catch (error) {
    console.error('Get meetings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getAllEmployeesForUser = async (req, res) => {
  try {
    const employees = await (await import('../services/employeeService.js')).getAllEmployees();
    res.json(employees);
  } catch (error) {
    console.error('Get employees for user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export {
  recordLoginTime,
  recordLogoutTime,
  getDashboard,
  getTasks,
  updateTaskStatus,
  getTimeEntries,
  applyLeave,
  getMyLeaves,
  getMyMeetings,
  createMeetingForUser,
  getAllEmployeesForUser
};
