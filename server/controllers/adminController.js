import * as employeeService from '../services/employeeService.js';
import * as taskService from '../services/taskService.js';
import * as timeEntryService from '../services/timeEntryService.js';
import * as leaveService from '../services/leaveService.js';
import * as meetingService from '../services/meetingService.js';
import Holiday from '../models/Holiday.js';
import TimeEntry from '../models/TimeEntry.js';
import User from '../models/User.js';
import Payroll from '../models/Payroll.js';

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
 * Get employee by ID
 */
const getEmployeeById = async (req, res) => {
  try {
    const employee = await employeeService.getEmployeeById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json(employee);
  } catch (error) {
    console.error('Get employee by ID error:', error);
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
}


const promoteEmployee = async (req, res) => {
  try {
    const { designation } = req.body;
    const result = await employeeService.promoteEmployee(req.params.id, designation, req.user._id);
    res.json({ message: 'Employee promoted successfully', result });
  } catch (error) {
    if (error.message === 'New designation is required' || error.message === 'User not found') {
      return res.status(400).json({ message: error.message });
    }
    console.error('Promote employee error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getHolidays = async (req, res) => {
  try {
    const holidays = await Holiday.find().sort({ date: 1 });
    res.json(holidays);
  } catch (error) {
    console.error('Get holidays error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getAttendanceStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Daily Stats
    const totalEmployees = await User.countDocuments({ role: 'employee', status: 'active' });
    const presentToday = await TimeEntry.distinct('employeeId', {
      date: { $gte: today, $lt: tomorrow }
    });

    // Monthly Stats (Current Month)
    const currentMonth = today.getMonth() + 1; // 1-12
    const currentYear = today.getFullYear();

    // Aggregate total hours worked per day for the current month
    const monthlyStats = await TimeEntry.aggregate([
      {
        $match: {
          month: currentMonth,
          year: currentYear
        }
      },
      {
        $group: {
          _id: { day: { $dayOfMonth: "$date" } },
          totalHours: { $sum: "$hoursWorked" },
          presentCount: { $addToSet: "$employeeId" } // Unique employees
        }
      },
      {
        $project: {
          day: "$_id.day",
          totalHours: 1,
          presentCount: { $size: "$presentCount" },
          _id: 0
        }
      },
      { $sort: { day: 1 } }
    ]);

    res.json({
      daily: {
        total: totalEmployees,
        present: presentToday.length,
        absent: totalEmployees - presentToday.length
      },
      monthly: monthlyStats
    });

  } catch (error) {
    console.error('Get attendance stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Payroll operations
const paySalary = async (req, res) => {
  try {
    const { employeeId, month, year, basicSalary, allowances, deductions } = req.body;

    const netSalary = basicSalary + (allowances || 0) - (deductions || 0);

    // Check if already paid
    const existing = await Payroll.findOne({ employee: employeeId, month, year });
    if (existing) {
      return res.status(400).json({ message: 'Salary already paid for this month' });
    }

    const payroll = new Payroll({
      employee: employeeId,
      month,
      year,
      basicSalary,
      allowances: allowances || 0,
      deductions: deductions || 0,
      netSalary,
      paidBy: req.user._id
    });

    await payroll.save();
    res.status(201).json(payroll);
  } catch (error) {
    console.error('Pay salary error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getPayrollStatus = async (req, res) => {
  try {
    const { month, year } = req.query;
    if (!month || !year) {
      return res.status(400).json({ message: 'Month and year are required' });
    }

    // Return list of employee records who are paid for this month
    const paidRecords = await Payroll.find({ month, year }).select('employee paidAt netSalary basicSalary allowances deductions month year');
    res.json(paidRecords);
  } catch (error) {
    console.error('Get payroll status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getEmployeePayrollHistory = async (req, res) => {
  try {
    const records = await Payroll.find({ employee: req.params.employeeId })
      .sort({ year: -1, month: -1 });
    res.json(records);
  } catch (error) {
    console.error('Get employee payroll history error:', error);
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
  terminateEmployee,
  promoteEmployee,
  getHolidays,
  getAttendanceStats,
  paySalary,
  getPayrollStatus,
  getEmployeePayrollHistory,
  getEmployeeById
};
