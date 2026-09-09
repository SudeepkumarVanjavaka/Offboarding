import React, { useEffect, useState } from "react";
import { getOffboardingById, getOffboardings, updateClearance } from "../src/api";
import Status from "../components/status.jsx";

function OffboardingDetails({ id, navigate }) {
    const [caseData, setCaseData] = useState(null);
    const [allCases, setAllCases] = useState([]);
    const [selectedId, setSelectedId] = useState(id || "");
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState(null);
    const [remarksInput, setRemarksInput] = useState({});

    // Fetch all cases so user can pick another case if desired
    useEffect(() => {
        getOffboardings()
            .then(cases => {
                setAllCases(cases);
                if (!selectedId && cases.length > 0) {
                    setSelectedId(cases[0]._id);
                }
            })
            .catch(err => console.error("Error loading case list:", err));
    }, []);

    // Fetch details whenever selectedId changes
    useEffect(() => {
        if (!selectedId) {
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);
        getOffboardingById(selectedId)
            .then(data => {
                setCaseData(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching offboarding details:", err);
                setError("Failed to load offboarding details for case " + selectedId);
                setLoading(false);
            });
    }, [selectedId]);

    const handleCaseSelect = (e) => {
        const newId = e.target.value;
        setSelectedId(newId);
        if (navigate) {
            navigate(`/details?id=${newId}`);
        }
    };

    const handleQuickAction = async (stageId, status) => {
        const remarks = remarksInput[stageId] || "";
        setActionLoading(true);
        try {
            await updateClearance(stageId, {
                status,
                remarks: remarks || `Quick clearance ${status.toLowerCase()}`,
                approvedBy: "HR / Approver"
            });
            // Refresh details
            const updated = await getOffboardingById(selectedId);
            setCaseData(updated);
            setRemarksInput(prev => ({ ...prev, [stageId]: "" }));
            setActionLoading(false);
        } catch (err) {
            console.error("Action error:", err);
            alert("Failed to update clearance: " + err.message);
            setActionLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="container">
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Loading offboarding details from backend...</p>
                </div>
            </div>
        );
    }

    if (!caseData && !loading) {
        return (
            <div className="container">
                <div className="card empty-state">
                    <h2>No Offboarding Case Selected</h2>
                    <p>Please select an existing offboarding case or create a new one.</p>
                    {allCases.length > 0 && (
                        <div style={{ marginTop: "15px" }}>
                            <label>Select an Existing Case: </label>
                            <select value={selectedId} onChange={handleCaseSelect}>
                                <option value="">-- Choose case --</option>
                                {allCases.map(c => (
                                    <option key={c._id} value={c._id}>
                                        {c.employee?.name || c.employeeId} - {c.status}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                    <button className="btn btn-primary" style={{ marginTop: "15px" }} onClick={() => navigate && navigate("/start")}>
                        Start New Offboarding
                    </button>
                </div>
            </div>
        );
    }

    const { employee, clearances = [], auditLogs = [] } = caseData;

    return (
        <div className="container">
            <div className="page-header-row">
                <div>
                    <div className="back-link" onClick={() => navigate && navigate("/")} style={{ cursor: "pointer" }}>
                        ← Back to Dashboard
                    </div>
                    <h1>Offboarding Case Details</h1>
                    <p className="subtitle">Case ID: <code>{caseData._id}</code></p>
                </div>

                <div className="case-selector-group">
                    <label>Switch Case:</label>
                    <select value={selectedId} onChange={handleCaseSelect}>
                        {allCases.map(c => (
                            <option key={c._id} value={c._id}>
                                {c.employee?.name || c.employeeId} ({c.status})
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {error && (
                <div className="alert alert-error">
                    <span>⚠️ {error}</span>
                </div>
            )}

            {/* Top Cards: Employee Info + Offboarding Info */}
            <div className="details-grid">
                <div className="card">
                    <div className="card-header-flex">
                        <h2>Employee Information</h2>
                        <span className="badge-id">{employee?.employeeId || caseData.employeeId}</span>
                    </div>

                    <div className="info-list">
                        <div className="info-item">
                            <span className="info-label">Full Name</span>
                            <span className="info-value">{employee?.name || "—"}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Department</span>
                            <span className="info-value">{employee?.department || "—"}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Designation</span>
                            <span className="info-value">{employee?.designation || "—"}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Official Email</span>
                            <span className="info-value">{employee?.email || "—"}</span>
                        </div>
                        {employee?.joiningDate && (
                            <div className="info-item">
                                <span className="info-label">Joining Date</span>
                                <span className="info-value">{new Date(employee.joiningDate).toLocaleDateString()}</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="card">
                    <div className="card-header-flex">
                        <h2>Offboarding Overview</h2>
                        <Status status={caseData.status} />
                    </div>

                    <div className="info-list">
                        <div className="info-item">
                            <span className="info-label">Resignation Date</span>
                            <span className="info-value">
                                {caseData.resignationDate ? new Date(caseData.resignationDate).toLocaleDateString() : "—"}
                            </span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Last Working Day</span>
                            <span className="info-value">
                                {caseData.lastWorkingDay ? new Date(caseData.lastWorkingDay).toLocaleDateString() : "—"}
                            </span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Exit Reason</span>
                            <span className="info-value">{caseData.reason || "Not specified"}</span>
                        </div>
                    </div>

                    <div className="card-actions-row">
                        <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => navigate && navigate(`/clearance?id=${caseData._id}`)}
                        >
                            Open in Clearance Portal →
                        </button>
                        <button
                            className="btn btn-outline btn-sm"
                            onClick={() => navigate && navigate(`/documents?id=${caseData._id}`)}
                        >
                            Generate Exit Letters
                        </button>
                    </div>
                </div>
            </div>

            {/* Clearance Stages Table */}
            <div className="card" style={{ marginTop: "25px" }}>
                <div className="card-header-flex">
                    <h2>Clearance & Approval Stages</h2>
                    <span className="badge-count">
                        {clearances.filter(c => c.status === "Approved").length} / {clearances.length} Completed
                    </span>
                </div>

                <div className="table-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th>Stage / Department</th>
                                <th>Status</th>
                                <th>Approved By</th>
                                <th>Timestamp</th>
                                <th>Remarks</th>
                                <th>Quick Clearance Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clearances.map(stage => {
                                const isPending = stage.status === "Pending" || stage.status === "In Progress";
                                return (
                                    <tr key={stage._id}>
                                        <td>
                                            <strong>{stage.department}</strong>
                                        </td>
                                        <td>
                                            <Status status={stage.status} />
                                        </td>
                                        <td>{stage.approvedBy || "—"}</td>
                                        <td>
                                            {stage.approvedAt ? new Date(stage.approvedAt).toLocaleString() : "—"}
                                        </td>
                                        <td>
                                            {stage.remarks ? (
                                                <span className="text-muted">"{stage.remarks}"</span>
                                            ) : isPending ? (
                                                <input
                                                    type="text"
                                                    placeholder="Enter clearance remarks"
                                                    className="input-sm"
                                                    value={remarksInput[stage._id] || ""}
                                                    onChange={e => setRemarksInput({ ...remarksInput, [stage._id]: e.target.value })}
                                                />
                                            ) : (
                                                "—"
                                            )}
                                        </td>
                                        <td>
                                            {isPending ? (
                                                <div className="table-actions">
                                                    <button
                                                        className="btn btn-sm btn-success"
                                                        disabled={actionLoading}
                                                        onClick={() => handleQuickAction(stage._id, "Approved")}
                                                    >
                                                        Approve
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-danger"
                                                        disabled={actionLoading}
                                                        onClick={() => handleQuickAction(stage._id, "Rejected")}
                                                    >
                                                        Reject
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className="text-success" style={{ fontWeight: 600 }}>Resolved</span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Audit History */}
            {auditLogs.length > 0 && (
                <div className="card" style={{ marginTop: "25px" }}>
                    <h2>Audit & Activity History</h2>
                    <div className="audit-timeline">
                        {auditLogs.map(log => (
                            <div key={log._id} className="audit-item">
                                <span className="audit-time">{new Date(log.createdAt).toLocaleString()}</span>
                                <span className="audit-user"><strong>{log.userName}</strong> ({log.role}):</span>
                                <span className="audit-action">{log.action}</span>
                                {log.remarks && <span className="audit-remarks">— "{log.remarks}"</span>}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default OffboardingDetails;