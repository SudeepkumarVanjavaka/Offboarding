import React, { useState, useEffect } from "react";
import { getOffboardings, getOffboardingById, updateClearance } from "../src/api";
import Status from "../components/status.jsx";
import WorkflowProgress from "../components/workflowprogress.jsx";

function MyClearance({ id, navigate }) {
    const [cases, setCases] = useState([]);
    const [selectedCaseId, setSelectedCaseId] = useState(id || "");
    const [caseData, setCaseData] = useState(null);
    const [selectedStageId, setSelectedStageId] = useState("");
    const [approverName, setApproverName] = useState("Department Lead");
    const [remarks, setRemarks] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    // Load available offboarding cases
    useEffect(() => {
        getOffboardings()
            .then(data => {
                setCases(data);
                if (!selectedCaseId && data.length > 0) {
                    setSelectedCaseId(data[0]._id);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to load offboardings:", err);
                setError("Failed to load offboarding cases");
                setLoading(false);
            });
    }, []);

    // Load selected case data
    const refreshCase = (caseId) => {
        if (!caseId) return;
        getOffboardingById(caseId)
            .then(data => {
                setCaseData(data);
                // Pick the first pending stage if none selected
                const pending = (data.clearances || []).find(c => c.status === "Pending" || c.status === "In Progress");
                if (pending) {
                    setSelectedStageId(pending._id);
                } else if (data.clearances && data.clearances.length > 0) {
                    setSelectedStageId(data.clearances[0]._id);
                }
            })
            .catch(err => {
                console.error("Failed to load case details:", err);
                setError("Failed to load clearances for selected case");
            });
    };

    useEffect(() => {
        if (selectedCaseId) {
            refreshCase(selectedCaseId);
        }
    }, [selectedCaseId]);

    const handleCaseChange = (e) => {
        const newId = e.target.value;
        setSelectedCaseId(newId);
        setMessage(null);
        setError(null);
        if (navigate) {
            navigate(`/clearance?id=${newId}`);
        }
    };

    const handleClearanceAction = async (status) => {
        if (!selectedStageId) {
            setError("Please select a clearance stage to process.");
            return;
        }

        setError(null);
        setMessage(null);
        setSubmitting(true);

        try {
            const result = await updateClearance(selectedStageId, {
                status,
                remarks: remarks || `${status} by ${approverName}`,
                approvedBy: approverName || "Department Approver"
            });

            setMessage({
                type: status === "Approved" ? "success" : "warning",
                text: `Clearance successfully marked as ${status}!`
            });
            setRemarks("");
            setSubmitting(false);

            // Live refresh case data
            refreshCase(selectedCaseId);
        } catch (err) {
            setSubmitting(false);
            console.error("Failed to update clearance:", err);
            setError(err.message || "Failed to process clearance action.");
        }
    };

    if (loading) {
        return (
            <div className="container">
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Loading clearance records...</p>
                </div>
            </div>
        );
    }

    const currentStage = (caseData?.clearances || []).find(c => c._id === selectedStageId);

    return (
        <div className="container">
            <div className="page-header-row">
                <div>
                    <h1>Clearance & Approval Portal</h1>
                    <p className="subtitle">Review department clearance items, record audit remarks, and sign off.</p>
                </div>

                <div className="case-selector-group">
                    <label>Select Case:</label>
                    <select value={selectedCaseId} onChange={handleCaseChange}>
                        {cases.map(c => (
                            <option key={c._id} value={c._id}>
                                {c.employee?.name || c.employeeId} ({c.status})
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {message && (
                <div className={`alert alert-${message.type}`}>
                    <span>✅ {message.text}</span>
                </div>
            )}

            {error && (
                <div className="alert alert-error">
                    <span>⚠️ {error}</span>
                </div>
            )}

            {caseData && (
                <div className="dashboard-grid">
                    <div className="card">
                        <div className="card-header-flex">
                            <div>
                                <h2>{caseData.employee?.name || caseData.employeeId}</h2>
                                <p className="subtitle">
                                    {caseData.employee?.department} • {caseData.employee?.designation} • Last Day: {caseData.lastWorkingDay ? new Date(caseData.lastWorkingDay).toLocaleDateString() : "—"}
                                </p>
                            </div>
                            <Status status={caseData.status} />
                        </div>

                        <hr className="divider" />

                        <h3>Department Clearance Sign-off</h3>
                        <div className="form-group">
                            <label>Select Clearance Department Stage</label>
                            <select
                                value={selectedStageId}
                                onChange={e => setSelectedStageId(e.target.value)}
                            >
                                {(caseData.clearances || []).map(stage => (
                                    <option key={stage._id} value={stage._id}>
                                        {stage.department} — Status: {stage.status}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {currentStage && (
                            <div className="stage-current-banner">
                                <div>
                                    <strong>Active Stage:</strong> {currentStage.department}
                                    {currentStage.approvedBy && (
                                        <div className="hint">Previously updated by: {currentStage.approvedBy} ({currentStage.status})</div>
                                    )}
                                </div>
                                <Status status={currentStage.status} />
                            </div>
                        )}

                        <div className="form-group">
                            <label>Approver Name / Title</label>
                            <input
                                type="text"
                                value={approverName}
                                onChange={e => setApproverName(e.target.value)}
                                placeholder="e.g. Finance Officer, Systems Admin"
                            />
                        </div>

                        <div className="form-group">
                            <label>Clearance Remarks / Handover Checklist</label>
                            <textarea
                                value={remarks}
                                onChange={e => setRemarks(e.target.value)}
                                placeholder="e.g. Assets collected, email access disabled, pending dues settled..."
                                rows="3"
                            />
                        </div>

                        <div className="form-actions">
                            <button
                                className="btn btn-success"
                                disabled={submitting}
                                onClick={() => handleClearanceAction("Approved")}
                            >
                                {submitting ? "Processing..." : "✓ Approve Stage Clearance"}
                            </button>
                            <button
                                className="btn btn-danger"
                                disabled={submitting}
                                onClick={() => handleClearanceAction("Rejected")}
                            >
                                {submitting ? "Processing..." : "✗ Reject Stage Clearance"}
                            </button>
                        </div>
                    </div>

                    <div className="dashboard-sidebar">
                        <WorkflowProgress
                            clearances={caseData.clearances || []}
                            employeeName={caseData.employee?.name || caseData.employeeId}
                            offboardingId={caseData._id}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

export default MyClearance;