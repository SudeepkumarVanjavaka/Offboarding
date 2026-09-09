import React from "react";
import Status from "./status.jsx";

function WorkflowProgress({ clearances = [], employeeName = "", offboardingId = "" }) {
    if (!clearances || clearances.length === 0) {
        return (
            <div className="card workflow-card">
                <h2>Offboarding Approval Pipeline</h2>
                <p className="hint">No active clearance stages loaded for this view.</p>
            </div>
        );
    }

    const getStageIcon = (status) => {
        switch (status) {
            case "Approved": return "✅";
            case "Rejected": return "❌";
            case "In Progress": return "⏳";
            default: return "⚪";
        }
    };

    return (
        <div className="card workflow-card">
            <div className="workflow-card-header">
                <div>
                    <h2>Offboarding Approval Pipeline</h2>
                    {employeeName && (
                        <p className="subtitle">Case for: <strong>{employeeName}</strong></p>
                    )}
                </div>
            </div>

            <div className="workflow-timeline">
                {clearances.map((stage, index) => {
                    const icon = getStageIcon(stage.status);
                    return (
                        <div key={stage._id || index} className={`timeline-item timeline-${stage.status?.toLowerCase().replace(/\s+/g, "-")}`}>
                            <div className="timeline-badge">{icon}</div>
                            <div className="timeline-content">
                                <div className="timeline-title-row">
                                    <h4 className="stage-name">{stage.department || stage.name}</h4>
                                    <Status status={stage.status || "Pending"} />
                                </div>

                                {stage.approvedBy && (
                                    <div className="stage-meta">
                                        <span>Approver: <strong>{stage.approvedBy}</strong></span>
                                        {stage.approvedAt && (
                                            <span> • {new Date(stage.approvedAt).toLocaleString()}</span>
                                        )}
                                    </div>
                                )}

                                {stage.remarks && (
                                    <div className="stage-remarks">
                                        💬 <em>"{stage.remarks}"</em>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default WorkflowProgress;