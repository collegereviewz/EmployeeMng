import Task from '../models/Task.js';
import User from '../models/User.js';
import { sendEmail } from '../utils/email.js';

/**
 * Create a new task
 * @param {object} taskData - Task data
 * @param {string} assignedBy - Admin user ID
 * @returns {object} Created task
 */
/**
 * Create a new task
 * @param {object} taskData - Task data
 * @param {string} assignedBy - Admin user ID
 * @returns {object} Created task
 */
const createTask = async (taskData, assignedBy) => {
  const { title, description, assignedTo, dueDate, role } = taskData;

  if (!title || !assignedTo) {
    throw new Error('Title and assignedTo are required');
  }

  // Handle assignedTo as an array (bulk assignment) or string (single assignment)
  const employeeIds = Array.isArray(assignedTo) ? assignedTo : [assignedTo];

  if (employeeIds.length === 0) {
    throw new Error('At least one employee must be assigned');
  }

  const createdTasks = [];
  const eventBus = (await import('../eventBus.js')).default;

  for (const employeeId of employeeIds) {
    const employee = await User.findById(employeeId);
    if (!employee || employee.role !== 'employee') {
      // Skip invalid employees or non-employees, or throw error depending on strictness.
      // For now, we'll log and continue or throw if critical. 
      // Let's throw to be safe as per original logic.
      throw new Error(`Employee not found or invalid: ${employeeId}`);
    }

    const task = new Task({
      title,
      description: description || '',
      assignedTo: employeeId,
      assignedBy,
      dueDate: dueDate || null,
      role: role || null
    });

    await task.save();
    // Populate for response/email/socket
    await task.populate('assignedTo', 'name email');

    createdTasks.push(task);

    // Send assignment email to employee (best-effort)
    try {
      await sendEmail({
        to: employee.email,
        subject: `New task assigned: ${task.title}`,
        text: `Hello ${employee.name},\n\nA new task has been assigned to you: ${task.title}\n\nDescription: ${task.description || 'No description'}\nDue: ${task.dueDate ? new Date(task.dueDate).toLocaleString() : 'No due date'}\n\nPlease check your dashboard.`
      });
    } catch (err) {
      console.error('Failed to send task assignment email:', err);
    }

    // Emit an internal event so sockets can notify the user in real-time
    try {
      eventBus.emit('taskAssigned', { task: task.toObject ? task.toObject() : task, employeeId: employeeId });
    } catch (err) {
      console.error('Failed to emit taskAssigned event:', err);
    }
  }

  // Return the first task if single, or array if multiple. 
  // However, controller expects a single object usually or we adapt controller.
  // To minimize controller changes, if it was an array input, return array.
  return Array.isArray(assignedTo) ? createdTasks : createdTasks[0];
};

/**
 * Get all tasks
 * @returns {array} List of tasks
 */
const getAllTasks = async () => {
  return await Task.find()
    .populate('assignedTo', 'name email')
    .populate('assignedBy', 'name email')
    .sort({ createdAt: -1 });
};

/**
 * Get tasks assigned to employee
 * @param {string} employeeId - Employee ID
 * @returns {array} List of tasks
 */
const getEmployeeTasks = async (employeeId) => {
  return await Task.find({ assignedTo: employeeId })
    .populate('assignedBy', 'name email')
    .sort({ createdAt: -1 });
};

/**
 * Update task status
 * @param {string} taskId - Task ID
 * @param {string} employeeId - Employee ID
 * @param {string} status - New status
 * @returns {object} Updated task
 */
const updateTaskStatus = async (taskId, employeeId, status) => {
  if (!['pending', 'in-progress', 'completed'].includes(status)) {
    throw new Error('Invalid status');
  }

  const task = await Task.findOneAndUpdate(
    { _id: taskId, assignedTo: employeeId },
    { status },
    { new: true }
  ).populate('assignedBy', 'name email');

  if (!task) {
    throw new Error('Task not found');
  }

  // Notify the assigner (Admin) about the status update
  if (task.assignedBy && task.assignedBy.email) {
    try {
      await sendEmail({
        to: task.assignedBy.email,
        subject: `Task Update: ${task.title}`,
        text: `Hello ${task.assignedBy.name},\n\nThe status of the task "${task.title}" has been updated to: ${status.toUpperCase()}.\n\nAssigned to: ${task.assignedTo ? (task.assignedTo.name || 'Employee') : 'Employee'}\n\nRegards,\nSystem`
      });
    } catch (err) {
      console.error('Failed to send task update email:', err);
    }
  }

  return task;
};

export {
  createTask,
  getAllTasks,
  getEmployeeTasks,
  updateTaskStatus
};
