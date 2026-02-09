import React, { useState, useEffect } from 'react';
import { getAllEmployees } from '../../services/adminService';
import EmployeeCard from './EmployeeCard';
import CreateEmployeeModal from './CreateEmployeeModal';
import './EmployeeList.css';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      const data = await getAllEmployees();
      setEmployees(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEmployeeCreated = () => {
    setShowModal(false);
    loadEmployees();
  };

  if (loading) {
    return (
      <div className="employee-list loading-container">
        <div className="loading-spinner">Loading employees...</div>
      </div>
    );
  }

  return (
    <div className="employee-list">
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">Employee Management</h1>
          <p className="employee-count">{employees.length} employees</p>
        </div>
        {/* Updated Button Structure */}
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary add-employee-btn"
          disabled={loading}
        >
          <span className="btn-icon">+</span>
          Add Employee
        </button>
      </div>

      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}

      <div className="employee-grid">
        {employees.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">👥</div>
            <h3>No employees found</h3>
            <p>Add your first employee to get started</p>
            <button
              onClick={() => setShowModal(true)}
              className="btn-primary empty-btn"
            >
              Add First Employee
            </button>
          </div>
        ) : (
          employees.map((employee) => (
            <EmployeeCard
              key={employee._id}
              employee={employee}
              onUpdate={loadEmployees}
            />
          ))
        )}
      </div>

      {showModal && (
        <CreateEmployeeModal
          onClose={() => setShowModal(false)}
          onSuccess={handleEmployeeCreated}
        />
      )}
    </div>
  );
};

export default EmployeeList;