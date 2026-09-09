import React, { useEffect, useState } from "react";
import { getWorkflows } from "../src/api";

function WorkflowSettings({ navigate }) {
    const [workflows, setWorkflows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        getWorkflows()
            .then(data => {
                setWorkflows(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to load workflows:", err);
                setError("Failed to load workflow configuration from backend");
                setLoading(false);
            });
    }, []);

    const defaultStages = [
        { name: "Project / Reporting Manager", role: "Manager", order: 1, type: "Sequential" },
        { name: "Admin & Systems", role: "System Admin", order: 2, type: "Sequential" },
        { name: "Accounts", role: "Finance Officer", order: 3, type: "Sequential" },
        { name: "Personnel", role: "HR Personnel", order: 4, type: "Sequential" },
        { name: "HR", role: "HR Head", order: 5, type: "Sequential" }
    ];

    const currentWorkflow = workflows.length > 0 ? workflows[0] : { name: "Standard Offboarding Workflow", stages: defaultStages };

    return (
        <div className="container">
            <div className="page-header-row">
                <div>
                    <h1>Workflow Configuration</h1>
                    <p className="subtitle">Configure role-based clearance pipelines and approval ordering.</p>
                </div>
                <div>
                    <button className="btn btn-secondary" onClick={() => navigate && navigate("/start")}>
                        Test In New Offboarding →
                    </button>
                </div>
            </div>

            {error && (
                <div className="alert alert-error">
                    <span>⚠️ {error}</span>
                </div>
            )}

            <div className="card">
                <div className="card-header-flex">
                    <div>
                        <h2>{currentWorkflow.name}</h2>
                        <p className="subtitle">Active Approval Sequence for Standard Employee Exits</p>
                    </div>
                    <span className="badge-count">{(currentWorkflow.stages || []).length} Stages</span>
                </div>

                <div className="workflow-settings-list">
                    {(currentWorkflow.stages || []).map((stage, idx) => (
                        <div key={idx} className="workflow-setting-row">
                            <div className="stage-order-pill">Step {stage.order || idx + 1}</div>
                            <div className="stage-details-flex">
                                <strong>{stage.name}</strong>
                                <span className="stage-role-tag">Role: {stage.role || "Approver"}</span>
                            </div>
                            <span className="badge-type">{stage.type || "Sequential"}</span>
                        </div>
                    ))}
                </div>

                <div className="workflow-notice-box">
                    💡 <strong>Automatic Chain Inheritance:</strong> When HR initiates an offboarding case, the system automatically binds these 5 stages to the employee's clearance docket in MongoDB.
                </div>
            </div>
        </div>
    );
}

export default WorkflowSettings;