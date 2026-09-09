import React, { useState, useEffect } from "react";
import { getEmployees, startOffboarding } from "../src/api";

function StartOffboarding({ navigate }) {
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [loadingEmployees, setLoadingEmployees] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const [form, setForm] = useState({
        employeeId: "",
        resignationDate: "",
        lastWorkingDay: "",
        reason: ""
    });

    useEffect(() => {
        getEmployees()
            .then(data => {
                setEmployees(data);
                setLoadingEmployees(false);
            })
            .catch(err => {
                console.error("Failed to load employees:", err);
                setError("Failed to load employee list from backend");
                setLoadingEmployees(false);
            });
    }, []);

    function handleEmployeeSelect(e) {
        const empId = e.target.value;
        const emp = employees.find(item => item.employeeId === empId) || null;
        setSelectedEmployee(emp);
        setForm(prev => ({
            ...prev,
            employeeId: empId
        }));
    }

    function handleChange(e) {
        setForm(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (!form.employeeId) {
            setError("Please select an employee.");
            return;
        }

        setError(null);
        setSubmitting(true);

        try {
            const result = await startOffboarding(form);
            setSubmitting(false);

            if (result && result._id) {
                if (navigate) {
                    navigate(`/details?id=${result._id}`);
                } else {
                    window.location.href = `/details?id=${result._id}`;
                }
            } else {
                alert("Offboarding initiated successfully!");
                if (navigate) navigate("/");
            }
        } catch (err) {
            setSubmitting(false);
            console.error("Failed to start offboarding:", err);
            setError(err.message || "Failed to initiate offboarding. Please try again.");
        }
    }

    return (
        <div className="container">
            <div className="page-header">
                <h1>Initiate Employee Offboarding</h1>
                <p className="subtitle">Select an employee and record their exit details to launch the approval workflow.</p>
            </div>

            {error && (
                <div className="alert alert-error">
                    <span>⚠️ {error}</span>
                </div>
            )}

            <div className="form-layout">
                <form onSubmit={handleSubmit} className="card form-card">
                    <div className="form-group">
                        <label htmlFor="employeeId">Select Employee</label>
                        {loadingEmployees ? (
                            <p className="hint">Loading employees from server...</p>
                        ) : (
                            <select
                                id="employeeId"
                                name="employeeId"
                                value={form.employeeId}
                                onChange={handleEmployeeSelect}
                                required
                            >
                                <option value="">-- Choose an employee --</option>
                                {employees.map(emp => (
                                    <option key={emp._id || emp.employeeId} value={emp.employeeId}>
                                        {emp.employeeId} - {emp.name} ({emp.department})
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>

                    {selectedEmployee && (
                        <div className="employee-preview-box">
                            <h3>Employee Summary</h3>
                            <div className="preview-grid">
                                <div><strong>Name:</strong> {selectedEmployee.name}</div>
                                <div><strong>Department:</strong> {selectedEmployee.department}</div>
                                <div><strong>Designation:</strong> {selectedEmployee.designation}</div>
                                <div><strong>Email:</strong> {selectedEmployee.email}</div>
                                {selectedEmployee.joiningDate && (
                                    <div><strong>Joined:</strong> {new Date(selectedEmployee.joiningDate).toLocaleDateString()}</div>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="resignationDate">Resignation Date</label>
                            <input
                                id="resignationDate"
                                type="date"
                                name="resignationDate"
                                value={form.resignationDate}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="lastWorkingDay">Last Working Day</label>
                            <input
                                id="lastWorkingDay"
                                type="date"
                                name="lastWorkingDay"
                                value={form.lastWorkingDay}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="reason">Exit Reason / Handover Notes</label>
                        <textarea
                            id="reason"
                            name="reason"
                            value={form.reason}
                            onChange={handleChange}
                            placeholder="e.g. Higher education, career progression, relocation..."
                            rows="4"
                        />
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="btn btn-primary" disabled={submitting}>
                            {submitting ? "Initiating Offboarding..." : "Initiate Offboarding Case"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default StartOffboarding;