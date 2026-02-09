import express from 'express';
import { auth, isAdmin } from '../middleware/auth.js';
import {
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
} from '../controllers/adminController.js';

const router = express.Router();

// All routes require admin authentication
router.use(auth);
router.use(isAdmin);

// Employee routes
router.post('/employees', createEmployee);
router.get('/employees', getAllEmployees);
router.put('/employees/:id/salary', updateEmployeeSalary);
router.put('/employees/:id/work-hours', updateEmployeeWorkHours);
router.get('/employees/:id/time-entries', getEmployeeTimeEntries);
router.put('/employees/:id/password', changeUserPassword); // Admin can change employee password
router.put('/employees/:id/terminate', terminateEmployee);

// Task routes
router.post('/tasks', assignTask);
router.get('/tasks', getAllTasks);

// Leave routes
router.get('/leaves', getAllLeaves);
router.put('/leaves/:id/decide', decideLeave);

// Meeting routes
router.post('/meetings', createMeeting);
router.get('/meetings', getAllMeetings);

export default router;