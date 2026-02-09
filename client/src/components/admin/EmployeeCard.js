import React, { useState, useEffect } from 'react';
import { updateEmployeeSalary, updateEmployeeWorkHours, terminateEmployee } from '../../services/adminService';
import { formatCurrency } from '../../utils/format';
import './EmployeeCard.css';

const EmployeeCard = ({ employee, onUpdate }) => {
  const [salary, setSalary] = useState(employee.salary);
  const [workHours, setWorkHours] = useState(employee.workHours);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');

  // Termination state
  const [showTerminate, setShowTerminate] = useState(false);
  const [terminationReason, setTerminationReason] = useState('');

  // Attendance Graph Modal state
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);

  const handleUpdateSalary = async () => {
    try {
      setUpdating(true);
      setError('');
      await updateEmployeeSalary(employee._id, parseFloat(salary));
      onUpdate();
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdateWorkHours = async () => {
    try {
      setUpdating(true);
      setError('');
      await updateEmployeeWorkHours(employee._id, parseFloat(workHours));
      onUpdate();
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleTerminate = async () => {
    if (!terminationReason.trim()) {
      setError('Termination reason is required');
      return;
    }

    if (!window.confirm(`Are you sure you want to terminate ${employee.name}?`)) {
      return;
    }

    try {
      setUpdating(true);
      setError('');
      await terminateEmployee(employee._id, terminationReason);
      setShowTerminate(false);
      onUpdate();
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdating(false);
    }
  };

  const isTerminated = employee.status === 'terminated';

  return (
    <div className={`employee-card ${isTerminated ? 'terminated' : ''}`}>
      <div className="employee-header">
        <div>
          <h3>{employee.name}</h3>
          <span className="employee-email">{employee.email}</span>
        </div>
        {isTerminated && <span className="badge-terminated">Terminated</span>}
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="employee-details">
        <div className="detail-group">
          <label>Salary</label>
          <div className="input-group">
            <input
              type="number"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              disabled={updating || isTerminated}
            />
            <button
              onClick={handleUpdateSalary}
              disabled={updating || salary === employee.salary || isTerminated}
              className="btn-update"
            >
              Update
            </button>
          </div>
          <span className="current-value">
            Current: {formatCurrency(employee.salary)}
          </span>
        </div>

        <div className="detail-group">
          <label>Work Hours (per day)</label>
          <div className="input-group">
            <input
              type="number"
              value={workHours}
              onChange={(e) => setWorkHours(e.target.value)}
              disabled={updating || isTerminated}
              step="0.5"
            />
            <button
              onClick={handleUpdateWorkHours}
              disabled={updating || workHours === employee.workHours || isTerminated}
              className="btn-update"
            >
              Update
            </button>
          </div>
          <span className="current-value">
            Current: {employee.workHours} hrs/day
          </span>
        </div>

        {/* Termination Section */}
        {!isTerminated && (
          <div className="termination-section border-t pt-4 mt-4">
            {!showTerminate ? (
              <button
                className="btn-danger w-full"
                onClick={() => setShowTerminate(true)}
              >
                Terminate Employee
              </button>
            ) : (
              <div className="terminate-form">
                <label className="block text-sm font-medium text-red-600 mb-1">Reason for Termination</label>
                <input
                  type="text"
                  className="w-full p-2 border border-red-300 rounded mb-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Enter reason..."
                  value={terminationReason}
                  onChange={(e) => setTerminationReason(e.target.value)}
                />
                <div className="flex gap-2">
                  <button
                    className="btn-danger flex-1"
                    onClick={handleTerminate}
                    disabled={updating}
                  >
                    Confirm Terminate
                  </button>
                  <button
                    className="btn-secondary flex-1"
                    onClick={() => {
                      setShowTerminate(false);
                      setTerminationReason('');
                      setError('');
                    }}
                    disabled={updating}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {isTerminated && (
          <div className="termination-info mt-4 p-2 bg-red-50 rounded text-sm text-red-800">
            <strong>Termination Reason:</strong> {employee.terminationReason}
          </div>
        )}

        {/* Attendance Graph Modal Trigger */}
        <div className="mt-4 pt-4 border-t">
          <button
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition flex items-center justify-center gap-2"
            onClick={() => setShowAttendanceModal(true)}
          >
            <span>📊</span> View Attendance Graph
          </button>
        </div>
      </div>

      {showAttendanceModal && (
        <AttendanceModal
          employee={employee}
          onClose={() => setShowAttendanceModal(false)}
        />
      )}
    </div>
  );
};

// Internal Modal Component for Attendance
const AttendanceModal = ({ employee, onClose }) => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState({ start: new Date(), end: new Date() });

  useEffect(() => {
    loadData();
  }, []);

  const calculateDateRange = () => {
    const now = new Date();
    let startMonth = now.getMonth();
    let startYear = now.getFullYear();

    if (now.getDate() < 15) {
      startMonth -= 1;
      if (startMonth < 0) {
        startMonth = 11;
        startYear -= 1;
      }
    }

    const start = new Date(startYear, startMonth, 15);
    let endMonth = startMonth + 1;
    let endYear = startYear;
    if (endMonth > 11) {
      endMonth = 0;
      endYear += 1;
    }
    const end = new Date(endYear, endMonth, 14, 23, 59, 59);
    return { start, end };
  };

  const loadData = async () => {
    try {
      const { start, end } = calculateDateRange();
      setRange({ start, end });

      // Dynamic import to avoid circular dependencies if any, or just standard import
      const { getEmployeeTimeEntries } = await import('../../services/adminService');
      const data = await getEmployeeTimeEntries(employee._id, null, null, start.toISOString(), end.toISOString());
      setEntries(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Create a deferred component load for TimeGraph to avoid import issues in the same file if needed
  // But here we can just import it at top or use React.lazy if it was separate

  return (
    <div className="attendance-modal-overlay">
      <div className="attendance-modal-content">
        <div className="attendance-modal-header">
          <h2 className="modal-title">Attendance: {employee.name}</h2>
          <button onClick={onClose} className="modal-close">&times;</button>
        </div>
        <div className="attendance-modal-body">
          {loading ? (
            <div className="modal-loading">
              <div className="spinner"></div>
              <p>Loading attendance data...</p>
            </div>
          ) : (
            <div className="graph-container">
              <TimeGraphWrapper entries={entries} startDate={range.start} endDate={range.end} />
            </div>
          )}
        </div>
        <div className="attendance-modal-footer">
          <button onClick={onClose} className="btn-secondary">Close</button>
        </div>
      </div>
    </div>
  );
};

// Wrapper to handle import
const TimeGraphWrapper = (props) => {
  const [Component, setComponent] = useState(null);

  useEffect(() => {
    import('../common/TimeGraph').then(module => {
      setComponent(() => module.default);
    });
  }, []);

  if (!Component) return <div>Loading Chart...</div>;
  return <Component {...props} />;
};

export default EmployeeCard;
