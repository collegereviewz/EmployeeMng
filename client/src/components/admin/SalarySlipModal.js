import React from 'react';
import { X, Printer } from 'lucide-react';
// import { useReactToPrint } from 'react-to-print';
import logo from '../../logo.svg';
import './SalarySlipModal.css';

const SalarySlipModal = ({ employee, payroll, onClose }) => {
    const handlePrint = () => {
        // Open the dedicated print route in a new window/tab
        const url = `/admin/print-slip/${employee._id}/${payroll.month}/${payroll.year}`;
        window.open(url, '_blank');
    };

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    return (
        <div className="salary-modal-overlay">
            <div className="salary-modal-content">
                <div className="salary-modal-header">
                    <h2>Salary Slip</h2>
                    <div className="header-actions">
                        <button onClick={handlePrint} className="print-btn" title="Print / Save as PDF">
                            <Printer size={20} /> Print
                        </button>
                        <button onClick={onClose} className="close-btn">
                            <X size={24} />
                        </button>
                    </div>
                </div>

                <div className="salary-slip-preview">
                    {/* Slip Header */}
                    <div className="slip-header">
                        <div className="company-info flex items-center gap-4">
                            <img src={logo} alt="CollegeReviewZ Logo" className="h-16 w-auto" />
                            <div>
                                <h1>CollegeReviewZ</h1>
                                <p>Employee Management System</p>
                            </div>
                        </div>
                        <div className="slip-title">
                            <h3>Payslip for {monthNames[payroll.month - 1]} {payroll.year}</h3>
                        </div>
                    </div>

                    <hr className="divider" />

                    {/* Employee Details */}
                    <div className="employee-details-grid">
                        <div className="detail-item">
                            <span className="label">Employee Name:</span>
                            <span className="value">{employee.name}</span>
                        </div>
                        <div className="detail-item">
                            <span className="label">Employee ID:</span>
                            <span className="value">{employee._id.substring(0, 8).toUpperCase()}</span>
                        </div>
                        <div className="detail-item">
                            <span className="label">Designation:</span>
                            <span className="value">{employee.designation || 'N/A'}</span>
                        </div>
                        <div className="detail-item">
                            <span className="label">Employee Type:</span>
                            <span className="value">{employee.employeeType || 'Full Time'}</span>
                        </div>
                        <div className="detail-item">
                            <span className="label">Payment Date:</span>
                            <span className="value">{new Date(payroll.paidAt).toLocaleDateString()}</span>
                        </div>
                        <div className="detail-item">
                            <span className="label">Bank Account:</span>
                            <span className="value">XXXX-XXXX-XXXX</span>
                        </div>
                    </div>

                    <hr className="divider" />

                    {/* Salary Breakdown Table */}
                    <div className="salary-table-container">
                        <table className="salary-table">
                            <thead>
                                <tr>
                                    <th>Earnings</th>
                                    <th className="amount-col">Amount</th>
                                    <th>Deductions</th>
                                    <th className="amount-col">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Basic Salary</td>
                                    <td className="amount-col">₹{payroll.basicSalary.toLocaleString()}</td>
                                    <td>Tax / Provident Fund</td>
                                    <td className="amount-col">₹{payroll.deductions.toLocaleString()}</td>
                                </tr>
                                <tr>
                                    <td>Allowances (HRA, etc.)</td>
                                    <td className="amount-col">₹{payroll.allowances.toLocaleString()}</td>
                                    <td>Other Deductions</td>
                                    <td className="amount-col">₹0</td>
                                </tr>
                                {/* Filler rows for height */}
                                <tr>
                                    <td>&nbsp;</td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                            </tbody>
                            <tfoot>
                                <tr className="total-row">
                                    <td>Total Earnings</td>
                                    <td className="amount-col">₹{(payroll.basicSalary + payroll.allowances).toLocaleString()}</td>
                                    <td>Total Deductions</td>
                                    <td className="amount-col">₹{payroll.deductions.toLocaleString()}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>

                    {/* Net Pay */}
                    <div className="net-pay-section">
                        <div className="net-pay-label">Net Salary Payable:</div>
                        <div className="net-pay-amount">₹{payroll.netSalary.toLocaleString()}</div>
                        <div className="net-pay-words">(In words: {convertNumberToWords(payroll.netSalary)})</div>
                    </div>

                    <div className="slip-footer">
                        <p className="computer-generated">This is a computer-generated document and does not require a signature.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Helper for number to words (Simplified)
function convertNumberToWords(amount) {
    return "Rupees " + amount.toLocaleString() + " Only"; // Placeholder for true library
}

export default SalarySlipModal;
