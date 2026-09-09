import React from "react";

function Navbar({ currentPath = "/", navigate }) {
    const handleNav = (e, path) => {
        if (navigate) {
            e.preventDefault();
            navigate(path);
        }
    };

    const links = [
        { path: "/", label: "Dashboard" },
        { path: "/start", label: "Start Offboarding" },
        { path: "/details", label: "Offboarding Details" },
        { path: "/clearance", label: "Clearance Approvals" },
        { path: "/workflow", label: "Workflow Settings" },
        { path: "/documents", label: "Documents" }
    ];

    return (
        <nav className="navbar">
            <div className="nav-brand" onClick={(e) => handleNav(e, "/")} style={{ cursor: "pointer" }}>
                <span className="brand-badge">BlazeUp HROS</span>
                <h2>Employee Offboarding</h2>
            </div>

            <div className="links">
                {links.map((link) => (
                    <a
                        key={link.path}
                        href={link.path}
                        className={currentPath === link.path ? "active" : ""}
                        onClick={(e) => handleNav(e, link.path)}
                    >
                        {link.label}
                    </a>
                ))}
            </div>
        </nav>
    );
}

export default Navbar;