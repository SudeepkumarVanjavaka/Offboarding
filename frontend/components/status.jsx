import React from "react";

function Status({ status }) {
    const norm = (status || "").toLowerCase().replace(/\s+/g, "-");
    return (
        <span className={`status-badge status-${norm}`}>
            <span className="status-dot"></span>
            {status || "Unknown"}
        </span>
    );
}

export default Status;