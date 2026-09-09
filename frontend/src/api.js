const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

async function handleResponse(response) {
    if (!response.ok) {
        let errMessage = `HTTP error ${response.status}`;
        try {
            const errData = await response.json();
            if (errData && errData.message) {
                errMessage = errData.message;
            }
        } catch (_) {}
        throw new Error(errMessage);
    }
    return response.json();
}

export async function getEmployees() {
    const response = await fetch(`${API}/employees`);
    return handleResponse(response);
}

export async function getOffboardings() {
    const response = await fetch(`${API}/offboarding`);
    return handleResponse(response);
}

export async function getOffboardingById(id) {
    const response = await fetch(`${API}/offboarding/${id}`);
    return handleResponse(response);
}

export async function startOffboarding(data) {
    const response = await fetch(`${API}/offboarding`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
    return handleResponse(response);
}

export async function getClearances(offboardingId) {
    const url = offboardingId ? `${API}/clearance?offboardingId=${encodeURIComponent(offboardingId)}` : `${API}/clearance`;
    const response = await fetch(url);
    return handleResponse(response);
}

export async function createClearance(data) {
    const response = await fetch(`${API}/clearance`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
    return handleResponse(response);
}

export async function updateClearance(id, data) {
    const response = await fetch(`${API}/clearance/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
    return handleResponse(response);
}

export async function getWorkflows() {
    const response = await fetch(`${API}/workflow`);
    return handleResponse(response);
}