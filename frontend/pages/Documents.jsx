import React, { useState, useEffect } from "react";
import { getOffboardings, getOffboardingById } from "../src/api";
import Status from "../components/status.jsx";

function Documents({ id, navigate }) {
    const [cases, setCases] = useState([]);
    const [selectedCaseId, setSelectedCaseId] = useState(id || "");
    const [caseData, setCaseData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeDoc, setActiveDoc] = useState("acceptance");

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
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        if (selectedCaseId) {
            getOffboardingById(selectedCaseId)
                .then(data => setCaseData(data))
                .catch(err => console.error("Error loading case:", err));
        }
    }, [selectedCaseId]);

    const handleCaseChange = (e) => {
        const newId = e.target.value;
        setSelectedCaseId(newId);
        if (navigate) {
            navigate(`/documents?id=${newId}`);
        }
    };

    const empName = caseData?.employee?.name || caseData?.employeeId || "Employee";
    const empId = caseData?.employeeId || "—";
    const empDept = caseData?.employee?.department || "—";
    const empRole = caseData?.employee?.designation || "—";
    const resDate = caseData?.resignationDate ? new Date(caseData.resignationDate).toLocaleDateString() : "—";
    const lwd = caseData?.lastWorkingDay ? new Date(caseData.lastWorkingDay).toLocaleDateString() : "—";
    const joinDate = caseData?.employee?.joiningDate ? new Date(caseData.employee.joiningDate).toLocaleDateString() : "—";

    return (
        <div className="container">
            <div className="page-header-row">
                <div>
                    <h1>Exit Documentation & Letters</h1>
                    <p className="subtitle">Generate and preview formal exit documents and clearance certificates.</p>
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

            {loading ? (
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Loading records...</p>
                </div>
            ) : !caseData ? (
                <div className="card empty-state">
                    <p>No offboarding case available to generate documents.</p>
                </div>
            ) : (
                <div className="dashboard-grid">
                    <div className="card">
                        <h2>Available Documents</h2>
                        <p className="hint">Select a template to generate official copy:</p>

                        <div className="doc-button-group">
                            <button
                                className={`btn ${activeDoc === "acceptance" ? "btn-primary" : "btn-outline"}`}
                                onClick={() => setActiveDoc("acceptance")}
                            >
                                📄 Resignation Acceptance Letter
                            </button>
                            <button
                                className={`btn ${activeDoc === "noc" ? "btn-primary" : "btn-outline"}`}
                                onClick={() => setActiveDoc("noc")}
                            >
                                🛡️ NOC / Clearance Certificate
                            </button>
                            <button
                                className={`btn ${activeDoc === "relieving" ? "btn-primary" : "btn-outline"}`}
                                onClick={() => setActiveDoc("relieving")}
                            >
                                📜 Relieving Letter
                            </button>
                            <button
                                className={`btn ${activeDoc === "experience" ? "btn-primary" : "btn-outline"}`}
                                onClick={() => setActiveDoc("experience")}
                            >
                                🌟 Experience Letter
                            </button>
                        </div>

                        <hr className="divider" />

                        <div className="employee-preview-box">
                            <h4>Target Beneficiary</h4>
                            <p><strong>{empName}</strong> ({empId})</p>
                            <p>{empRole} • {empDept}</p>
                            <Status status={caseData.status} />
                        </div>

                        <div style={{ marginTop: "20px" }}>
                            <button className="btn btn-secondary" onClick={() => window.print()}>
                                🖨️ Print / Save as PDF
                            </button>
                        </div>
                    </div>

                    <div className="card doc-preview-card">
                        <div className="doc-letterhead">
                            <div className="doc-brand">BLAZEUP TECHNOLOGIES INC.</div>
                            <div className="doc-sub">Human Resources & Operations Services (HROS)</div>
                            <div className="doc-date">Date: {new Date().toLocaleDateString()}</div>
                        </div>

                        <hr className="divider" />

                        {activeDoc === "acceptance" && (
                            <div className="doc-body">
                                <h3>RESIGNATION ACCEPTANCE LETTER</h3>
                                <p><strong>To:</strong> {empName} (ID: {empId})<br />
                                <strong>Department:</strong> {empDept}<br />
                                <strong>Designation:</strong> {empRole}</p>

                                <p>Dear {empName},</p>
                                <p>This letter is to formally acknowledge and confirm acceptance of your resignation dated <strong>{resDate}</strong> from your role as {empRole} at BlazeUp Technologies.</p>
                                <p>Your last working day with the organization has been recorded as <strong>{lwd}</strong>.</p>
                                <p>We request that you complete all departmental clearances via the HROS portal before your last working day to ensure smooth processing of final settlements.</p>
                                <p>We wish you every success in your future professional endeavors.</p>
                                <div className="doc-signature">
                                    <p>Sincerely,</p>
                                    <p><strong>Human Resources Department</strong><br />BlazeUp Technologies Inc.</p>
                                </div>
                            </div>
                        )}

                        {activeDoc === "noc" && (
                            <div className="doc-body">
                                <h3>NO OBJECTION CERTIFICATE (NOC) & CLEARANCE</h3>
                                <p>This is to certify that <strong>{empName}</strong> (Employee ID: <strong>{empId}</strong>), who served as <strong>{empRole}</strong> in the <strong>{empDept}</strong> department, has initiated exit clearance.</p>
                                <p><strong>Overall Offboarding Status:</strong> {caseData.status}</p>
                                <h4>Department Status Summary:</h4>
                                <ul>
                                    {(caseData.clearances || []).map(c => (
                                        <li key={c._id}>
                                            <strong>{c.department}:</strong> {c.status} {c.approvedBy ? `(by ${c.approvedBy})` : ""}
                                        </li>
                                    ))}
                                </ul>
                                <p>This certificate is issued upon verification of institutional clearance records.</p>
                                <div className="doc-signature">
                                    <p>Authorized Signatory,</p>
                                    <p><strong>Clearance & Compliance Officer</strong><br />BlazeUp Technologies Inc.</p>
                                </div>
                            </div>
                        )}

                        {activeDoc === "relieving" && (
                            <div className="doc-body">
                                <h3>RELIEVING LETTER</h3>
                                <p><strong>Ref:</strong> BZ/HR/REL/{empId}</p>
                                <p>Dear <strong>{empName}</strong>,</p>
                                <p>Further to your resignation, we hereby confirm that you have been relieved from your duties and responsibilities as <strong>{empRole}</strong> at BlazeUp Technologies with effect from the close of business hours on <strong>{lwd}</strong>.</p>
                                <p>We thank you for your contributions during your tenure with us and wish you the best in all your future endeavors.</p>
                                <div className="doc-signature">
                                    <p>Sincerely,</p>
                                    <p><strong>Head of People & Culture</strong><br />BlazeUp Technologies Inc.</p>
                                </div>
                            </div>
                        )}

                        {activeDoc === "experience" && (
                            <div className="doc-body">
                                <h3>TO WHOMSOEVER IT MAY CONCERN</h3>
                                <p>This is to certify that <strong>{empName}</strong> was employed with BlazeUp Technologies Inc. from <strong>{joinDate}</strong> to <strong>{lwd}</strong>.</p>
                                <p>During their tenure, they worked as <strong>{empRole}</strong> in our <strong>{empDept}</strong> division. During this period, their conduct was found to be exemplary and professional.</p>
                                <p>We take this opportunity to thank them and wish them continued success in their future endeavors.</p>
                                <div className="doc-signature">
                                    <p>Authorized Signatory,</p>
                                    <p><strong>Human Resources Management</strong><br />BlazeUp Technologies Inc.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Documents;