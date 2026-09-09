import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar.jsx";
import Dashboard from "../pages/dashboard.jsx";
import OffboardingDetails from "../pages/offboardingDetails.jsx";
import MyClearance from "../pages/myClearance.jsx";
import WorkflowSettings from "../pages/workflowsettings.jsx";
import Documents from "../pages/Documents.jsx";
import StartOffboarding from "../pages/startoffboarding.jsx";

function App() {
    const [currentPath, setCurrentPath] = useState(window.location.pathname);
    const [currentSearch, setCurrentSearch] = useState(window.location.search);

    useEffect(() => {
        const handlePopState = () => {
            setCurrentPath(window.location.pathname);
            setCurrentSearch(window.location.search);
        };
        window.addEventListener("popstate", handlePopState);
        return () => window.removeEventListener("popstate", handlePopState);
    }, []);

    const navigate = (to) => {
        window.history.pushState({}, "", to);
        const url = new URL(to, window.location.origin);
        setCurrentPath(url.pathname);
        setCurrentSearch(url.search);
        window.scrollTo(0, 0);
    };

    const id = new URLSearchParams(currentSearch).get("id");

    let page = <Dashboard navigate={navigate} />;

    if (currentPath === "/start") {
        page = <StartOffboarding navigate={navigate} />;
    } else if (currentPath === "/details") {
        page = <OffboardingDetails id={id} navigate={navigate} />;
    } else if (currentPath === "/clearance") {
        page = <MyClearance id={id} navigate={navigate} />;
    } else if (currentPath === "/workflow") {
        page = <WorkflowSettings navigate={navigate} />;
    } else if (currentPath === "/documents") {
        page = <Documents id={id} navigate={navigate} />;
    }

    return (
        <div className="app-shell">
            <Navbar currentPath={currentPath} navigate={navigate} />
            <main className="app-main">
                {page}
            </main>
        </div>
    );
}

export default App;