import React, { useState, useEffect } from 'react';
import { getTasks, updateTaskStatus } from '../../services/employeeService';
import { formatDate } from '../../utils/format';
import './EmployeeTasks.css';

const EmployeeTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const data = await getTasks();
      setTasks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      setError('');
      await updateTaskStatus(taskId, newStatus);
      loadTasks();
    } catch (err) {
      setError(err.message);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return '#27ae60';
      case 'in-progress':
        return '#3498db';
      default:
        return '#95a5a6';
    }
  };

  if (loading) {
    return <div className="loading">Loading tasks...</div>;
  }

  return (
    <div className="employee-tasks">
      <h1>My Tasks</h1>

      {error && <div className="error-message">{error}</div>}

      {tasks.length === 0 ? (
        <div className="no-tasks">
          <p>No tasks assigned to you yet.</p>
        </div>
      ) : (
        <div className="tasks-container">
          {tasks.map((task) => (
            <div key={task._id} className="task-card">
              <div className="task-header">
                <h3>{task.title}</h3>
                <span
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(task.status) }}
                >
                  {task.status}
                </span>
              </div>

              {task.description && (
                <p className="task-description">{task.description}</p>
              )}

              <div className="task-meta">
                <div className="meta-item">
                  <span className="meta-label">Assigned by:</span>
                  <span className="meta-value">
                    {task.assignedBy?.name || 'Admin'}
                  </span>
                </div>
                {task.role && (
                  <div className="meta-item">
                    <span className="meta-label">Role:</span>
                    <span className="meta-value">{task.role}</span>
                  </div>
                )}
                {task.dueDate && (
                  <div className="meta-item">
                    <span className="meta-label">Due date:</span>
                    <span className="meta-value">{formatDate(task.dueDate)}</span>
                  </div>
                )}
                <div className="meta-item">
                  <span className="meta-label">Created:</span>
                  <span className="meta-value">{formatDate(task.createdAt)}</span>
                </div>
              </div>

              <div className="task-actions">
                <label>Update Status:</label>
                <select
                  value={task.status}
                  onChange={(e) => handleStatusChange(task._id, e.target.value)}
                  className="status-select"
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EmployeeTasks;
