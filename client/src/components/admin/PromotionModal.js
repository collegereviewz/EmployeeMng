import React, { useState } from 'react';
import './PromotionModal.css';

const PromotionModal = ({ employee, onClose, onPromote }) => {
    const [designation, setDesignation] = useState(employee.designation || '');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!designation.trim()) {
            setError('Designation is required');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await onPromote(employee._id, designation);
            onClose();
        } catch (err) {
            setError(err.message || 'Failed to promote employee');
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>Promote Employee</h2>
                <p className="mb-4">Promoting: <strong>{employee.name}</strong></p>

                <form onSubmit={handleSubmit}>
                    {error && <div className="error-message">{error}</div>}

                    <div className="form-group">
                        <label>Current Designation</label>
                        <input
                            type="text"
                            value={employee.designation || 'N/A'}
                            disabled
                            className="bg-gray-100"
                        />
                    </div>

                    <div className="form-group">
                        <label>New Designation *</label>
                        <input
                            type="text"
                            value={designation}
                            onChange={(e) => setDesignation(e.target.value)}
                            placeholder="e.g. Senior Software Developer"
                            required
                            autoFocus
                        />
                    </div>

                    <div className="modal-actions">
                        <button type="button" onClick={onClose} className="btn-secondary">
                            Cancel
                        </button>
                        <button type="submit" disabled={loading} className="btn-primary">
                            {loading ? 'Promoting...' : 'Promote'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PromotionModal;
