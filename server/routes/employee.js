import express from 'express';
import { auth } from '../middleware/auth.js';
import {
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
} from '../controllers/employeeController.js';

const router = express.Router();

// All routes require authentication
router.use(auth);

// Time tracking routes
router.post('/login-time', recordLoginTime);
router.post('/logout-time', recordLogoutTime);
router.get('/time-entries', getTimeEntries);

// Dashboard route
router.get('/dashboard', getDashboard);

// Task routes
router.get('/tasks', getTasks);
router.put('/tasks/:id/status', updateTaskStatus);

// Leaves
router.post('/leaves', applyLeave);
router.get('/leaves', getMyLeaves);

// Meetings
router.post('/meetings', createMeetingForUser);
router.get('/meetings', getMyMeetings);

// Employee list (for assigning tasks/leaves - admin only)
router.get('/employees', getAllEmployeesForUser);

export default router;
