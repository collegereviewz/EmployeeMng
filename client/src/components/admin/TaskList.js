import React, { useState, useEffect } from 'react';
import { getAllTasks, assignTask, getAllEmployees } from '../../services/adminService';
import { formatDate } from '../../utils/format';
import './TaskList.css';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignedTo: [],
    dueDate: '',
    role: ''
  });

  const roles = [
    'Web Developer',
    'Application Developer',
    'Tester',
    'DevOps Engineer',
    'UI/UX Designer',
    'Data Analyst',
    'Backend Developer',
    'Frontend Developer',
    'Full Stack Developer',
    'QA Engineer',
    'Business Analyst',
    'Project Manager'
  ];
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [tasksData, employeesData] = await Promise.all([
        getAllTasks(),
        getAllEmployees()
      ]);
      setTasks(tasksData);
      setEmployees(employeesData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await assignTask({
        title: formData.title,
        description: formData.description,
        assignedTo: formData.assignedTo, // This is now an array
        dueDate: formData.dueDate || null,
        role: formData.role || null
      });
      setShowModal(false);
      setFormData({ title: '', description: '', assignedTo: [], dueDate: '', role: '' });
      loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCheckboxChange = (employeeId) => {
    setFormData(prev => {
      const currentAssigned = prev.assignedTo || [];
      if (currentAssigned.includes(employeeId)) {
        return { ...prev, assignedTo: currentAssigned.filter(id => id !== employeeId) };
      } else {
        return { ...prev, assignedTo: [...currentAssigned, employeeId] };
      }
    });
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
    <div className="task-list">
      <div className="page-header">
        <h1>Task Management</h1>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          Assign Task
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="tasks-container">
        {tasks.length === 0 ? (
          <p className="no-tasks">No tasks assigned yet.</p>
        ) : (
          <div className="table-wrapper">
            <table className="tasks-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Assigned To</th>
                  <th>Role</th>
                  <th>Assigned By</th>
                  <th>Status</th>
                  <th>Due Date</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task._id}>
                    <td>{task.title}</td>
                    <td>{task.description || '-'}</td>
                    <td>{task.assignedTo?.name || '-'}</td>
                    <td>{task.role || '-'}</td>
                    <td>{task.assignedBy?.name || '-'}</td>
                    <td>
                      <span
                        className="status-badge"
                        style={{ backgroundColor: getStatusColor(task.status) }}
                      >
                        {task.status}
                      </span>
                    </td>
                    <td>{task.dueDate ? formatDate(task.dueDate) : '-'}</td>
                    <td>{formatDate(task.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          {/* Added style here as a fallback, but CSS handles it mainly */}
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Assign New Task</h2>
            <form onSubmit={handleSubmit} className="task-modal-form">
              {error && <div className="error-message">{error}</div>}

              {/* Form Body Container for better scrolling control if needed */}
              <div className="form-body">
                <div className="form-group">
                  <label>Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    placeholder="Task title"
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Task description"
                    rows="4"
                  />
                </div>
                <div className="form-group">
                  <label>Assign To *</label>
                  <div className="checkbox-list">
                    {employees.map((emp) => (
                      <div key={emp._id} className="checkbox-item" onClick={() => handleCheckboxChange(emp._id)}>
                        <input
                          type="checkbox"
                          checked={(formData.assignedTo || []).includes(emp._id)}
                          onChange={() => { }} // Handled by div click
                        />
                        <label>{emp.name} ({emp.email})</label>
                      </div>
                    ))}
                    {employees.length === 0 && <div style={{ padding: '0.5rem', color: '#666' }}>No employees found</div>}
                  </div>
                  {(!formData.assignedTo || formData.assignedTo.length === 0) && (
                    <div style={{ color: '#c33', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                      * Please select at least one employee
                    </div>
                  )}
                </div>
                <div className="form-group">
                  <label>Due Date</label>
                  <input
                    type="date"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Role</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                  >
                    <option value="">Select role (optional)</option>
                    {roles.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Assign Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList;