import React, { useEffect, useState } from "react";
import { getOffboardings } from "../src/api";
import Status from "../components/status.jsx";
import WorkflowProgress from "../components/workflowprogress.jsx";

function Dashboard({ navigate }) {
    const [offboardings, setOffboardings] = useState([]);
    const [selectedCase, setSelectedCase] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadData = () => {
        setLoading(true);
        getOffboardings()
            .then(data => {
                setOffboardings(data);
                if (data.length > 0) {
                    setSelectedCase(data[0]);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error("Dashboard data load error:", err);
                setError("Failed to load offboarding records from server.");
                setLoading(false);
            });
    };

    useEffect(() => {
        loadData();
    }, []);

    const totalCases = offboardings.length;
    const inProgressCases = offboardings.filter(o => o.status === "In Progress").length;
    const completedCases = offboardings.filter(o => o.status === "Completed").length;
    const rejectedCases = offboardings.filter(o => o.status === "Rejected").length;

    return (
        <div className="container">
            <div className="page-header-row">
                <div>
                    <h1>HR Offboarding Dashboard</h1>
                    <p className="subtitle">Overview of employee exits, clearances, and approval chains.</p>
                </div>
                <div>
                    <button className="btn btn-primary" onClick={() => navigate && navigate("/start")}>
                        + Start Offboarding
                    </button>
                </div>
            </div>

            {error && (
                <div className="alert alert-error">
                    <span>⚠️ {error}</span>
                    <button className="btn btn-sm" onClick={loadData}>Retry</button>
                </div>
            )}

            {/* Metrics Cards */}
            <div className="stats-grid">
                <div className="stat-card">
                    <span className="stat-label">Total Offboardings</span>
                    <span className="stat-value">{totalCases}</span>
                </div>
                <div className="stat-card stat-card-active">
                    <span className="stat-label">In Progress</span>
                    <span className="stat-value text-warning">{inProgressCases}</span>
                </div>
                <div className="stat-card stat-card-success">
                    <span className="stat-label">Completed</span>
                    <span className="stat-value text-success">{completedCases}</span>
                </div>
                <div className="stat-card stat-card-danger">
                    <span className="stat-label">Rejected / On Hold</span>
                    <span className="stat-value text-danger">{rejectedCases}</span>
                </div>
            </div>

            <div className="dashboard-grid">
                <div className="card dashboard-main-card">
                    <div className="card-header-flex">
                        <h2>Active Offboarding Records</h2>
                        <span className="badge-count">{offboardings.length} cases</span>
                    </div>

                    {loading ? (
                        <div className="loading-state">
                            <div className="spinner"></div>
                            <p>Loading offboarding records...</p>
                        </div>
                    ) : offboardings.length === 0 ? (
                        <div className="empty-state">
                            <p>No offboarding records found in the system.</p>
                            <button className="btn btn-primary" onClick={() => navigate && navigate("/start")}>
                                Initiate First Offboarding Case
                            </button>
                        </div>
                    ) : (
                        <div className="table-wrapper">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Employee</th>
                                        <th>Department</th>
                                        <th>Resignation Date</th>
                                        <th>Last Working Day</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {offboardings.map(item => {
                                        const isSelected = selectedCase && selectedCase._id === item._id;
                                        return (
                                            <tr
                                                key={item._id}
                                                className={isSelected ? "row-selected" : ""}
                                                onClick={() => setSelectedCase(item)}
                                                style={{ cursor: "pointer" }}
                                            >
                                                <td>
                                                    <div className="emp-cell">
                                                        <strong>{item.employee?.name || item.employeeId}</strong>
                                                        <span className="emp-sub">{item.employeeId}</span>
                                                    </div>
                                                </td>
                                                <td>{item.employee?.department || "—"}</td>
                                                <td>
                                                    {item.resignationDate
                                                        ? new Date(item.resignationDate).toLocaleDateString()
                                                        : "—"}
                                                </td>
                                                <td>
                                                    {item.lastWorkingDay
                                                        ? new Date(item.lastWorkingDay).toLocaleDateString()
                                                        : "—"}
                                                </td>
                                                <td>
                                                    <Status status={item.status} />
                                                </td>
                                                <td>
                                                    <div className="table-actions" onClick={e => e.stopPropagation()}>
                                                        <button
                                                            className="btn btn-sm btn-outline"
                                                            title="View Full Case Details"
                                                            onClick={() => navigate && navigate(`/details?id=${item._id}`)}
                                                        >
                                                            Details
                                                        </button>
                                                        <button
                                                            className="btn btn-sm btn-secondary"
                                                            title="Review Clearances"
                                                            onClick={() => navigate && navigate(`/clearance?id=${item._id}`)}
                                                        >
                                                            Clearance
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                <div className="dashboard-sidebar">
                    <WorkflowProgress
                        clearances={selectedCase?.clearances || []}
                        employeeName={selectedCase?.employee?.name || selectedCase?.employeeId}
                        offboardingId={selectedCase?._id}
                    />
                </div>
            </div>
        </div>
    );
}

export default Dashboard;