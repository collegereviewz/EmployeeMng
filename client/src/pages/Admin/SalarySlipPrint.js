import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getEmployeeById, getPayrollStatus } from '../../services/adminService';
import logo from '../../logo.svg';
import './AdminEmployeeView.css'; // Reuse existing styles or specific ones

const SalarySlipPrint = () => {
    const { employeeId, month, year } = useParams();
    const [employee, setEmployee] = useState(null);
    const [payroll, setPayroll] = useState(null);
    const [loading, setLoading] = useState(true);

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    useEffect(() => {
        const loadData = async () => {
            try {
                const emp = await getEmployeeById(employeeId);
                const payrolls = await getPayrollStatus(month, year);
                const record = payrolls.find(p => p.employee === employeeId);

                setEmployee(emp);
                setPayroll(record);
            } catch (err) {
                console.error("Failed to load slip data", err);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [employeeId, month, year]);

    useEffect(() => {
        if (!loading && employee && payroll) {
            setTimeout(() => {
                window.print();
            }, 500);
        }
    }, [loading, employee, payroll]);

    if (loading) return <div>Loading slip...</div>;
    if (!employee || !payroll) return <div>Data not found</div>;

    const convertNumberToWords = (amount) => {
        return "Rupees " + amount.toLocaleString() + " Only";
    };

    return (
        <div style={{ padding: '40px', background: 'white', minHeight: '100vh', boxSizing: 'border-box' }}>
            {/* Slip Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <img src={logo} alt="CollegeReviewZ Logo" style={{ height: '60px', width: 'auto' }} />
                    <div>
                        <h1 style={{ margin: 0, color: '#3b82f6', fontSize: '1.8rem', lineHeight: 1.2 }}>CollegeReviewZ</h1>
                        <p style={{ margin: '0.25rem 0', color: '#64748b' }}>Employee Management System</p>
                    </div>
                </div>
                <div>
                    <h3 style={{ margin: 0, background: '#f1f5f9', padding: '0.5rem 1rem', borderRadius: '4px', border: '1px solid #e2e8f0', fontWeight: 600 }}>
                        Payslip for {monthNames[payroll.month - 1]} {payroll.year}
                    </h3>
                </div>
            </div>

            <hr style={{ border: 0, borderTop: '2px solid #e2e8f0', margin: '1.5rem 0' }} />

            {/* Employee Details */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem 3rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 600, color: '#64748b' }}>Employee Name:</span>
                    <span style={{ fontWeight: 500 }}>{employee.name}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 600, color: '#64748b' }}>Employee ID:</span>
                    <span style={{ fontWeight: 500 }}>{employee._id.substring(0, 8).toUpperCase()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 600, color: '#64748b' }}>Designation:</span>
                    <span style={{ fontWeight: 500 }}>{employee.designation || 'N/A'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 600, color: '#64748b' }}>Employee Type:</span>
                    <span style={{ fontWeight: 500 }}>{employee.employeeType || 'Full Time'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 600, color: '#64748b' }}>Payment Date:</span>
                    <span style={{ fontWeight: 500 }}>{new Date(payroll.paidAt).toLocaleDateString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 600, color: '#64748b' }}>Bank Account:</span>
                    <span style={{ fontWeight: 500 }}>XXXX-XXXX-XXXX</span>
                </div>
            </div>

            <hr style={{ border: 0, borderTop: '2px solid #e2e8f0', margin: '1.5rem 0' }} />

            {/* Salary Breakdown Table */}
            <div style={{ border: '1px solid #000', marginBottom: '2rem' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th style={{ padding: '0.75rem 1rem', border: '1px solid #000', textAlign: 'left', background: '#f8fafc', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.85rem' }}>Earnings</th>
                            <th style={{ padding: '0.75rem 1rem', border: '1px solid #000', textAlign: 'right', background: '#f8fafc', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.85rem', fontFamily: 'Consolas, monospace' }}>Amount</th>
                            <th style={{ padding: '0.75rem 1rem', border: '1px solid #000', textAlign: 'left', background: '#f8fafc', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.85rem' }}>Deductions</th>
                            <th style={{ padding: '0.75rem 1rem', border: '1px solid #000', textAlign: 'right', background: '#f8fafc', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.85rem', fontFamily: 'Consolas, monospace' }}>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={{ padding: '0.75rem 1rem', border: '1px solid #000' }}>Basic Salary</td>
                            <td style={{ padding: '0.75rem 1rem', border: '1px solid #000', textAlign: 'right', fontFamily: 'Consolas, monospace' }}>₹{payroll.basicSalary.toLocaleString()}</td>
                            <td style={{ padding: '0.75rem 1rem', border: '1px solid #000' }}>Tax / Provident Fund</td>
                            <td style={{ padding: '0.75rem 1rem', border: '1px solid #000', textAlign: 'right', fontFamily: 'Consolas, monospace' }}>₹{payroll.deductions.toLocaleString()}</td>
                        </tr>
                        <tr>
                            <td style={{ padding: '0.75rem 1rem', border: '1px solid #000' }}>Allowances (HRA, etc.)</td>
                            <td style={{ padding: '0.75rem 1rem', border: '1px solid #000', textAlign: 'right', fontFamily: 'Consolas, monospace' }}>₹{payroll.allowances.toLocaleString()}</td>
                            <td style={{ padding: '0.75rem 1rem', border: '1px solid #000' }}>Other Deductions</td>
                            <td style={{ padding: '0.75rem 1rem', border: '1px solid #000', textAlign: 'right', fontFamily: 'Consolas, monospace' }}>₹0</td>
                        </tr>
                        <tr>
                            <td style={{ padding: '0.75rem 1rem', border: '1px solid #000' }}>&nbsp;</td>
                            <td style={{ padding: '0.75rem 1rem', border: '1px solid #000' }}></td>
                            <td style={{ padding: '0.75rem 1rem', border: '1px solid #000' }}></td>
                            <td style={{ padding: '0.75rem 1rem', border: '1px solid #000' }}></td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr style={{ background: '#f1f5f9', fontWeight: 700 }}>
                            <td style={{ padding: '0.75rem 1rem', border: '1px solid #000' }}>Total Earnings</td>
                            <td style={{ padding: '0.75rem 1rem', border: '1px solid #000', textAlign: 'right', fontFamily: 'Consolas, monospace' }}>₹{(payroll.basicSalary + payroll.allowances).toLocaleString()}</td>
                            <td style={{ padding: '0.75rem 1rem', border: '1px solid #000' }}>Total Deductions</td>
                            <td style={{ padding: '0.75rem 1rem', border: '1px solid #000', textAlign: 'right', fontFamily: 'Consolas, monospace' }}>₹{payroll.deductions.toLocaleString()}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            {/* Net Pay */}
            <div style={{ textAlign: 'right', marginTop: '2rem', padding: '1.5rem', border: '2px solid #3b82f6', borderRadius: '8px', float: 'right', minWidth: '300px' }}>
                <div style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '0.5rem' }}>Net Salary Payable:</div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#3b82f6' }}>₹{payroll.netSalary.toLocaleString()}</div>
                <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.5rem', fontStyle: 'italic' }}>(In words: {convertNumberToWords(payroll.netSalary)})</div>
            </div>

            <div style={{ clear: 'both', marginTop: '4rem', paddingTop: '2rem', borderTop: '1px dashed #cbd5e1', textAlign: 'center' }}>
                <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: 0 }}>This is a computer-generated document and does not require a signature.</p>
            </div>
        </div>
    );
};

export default SalarySlipPrint;
