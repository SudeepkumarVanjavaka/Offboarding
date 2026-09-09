import express from "express";
import cors from "cors";

import {
    createEmployee,
    getEmployees
} from "./controllers/employeeController.js";

import {
    createOffboarding,
    getOffboardings,
    getOffboardingById
} from "./controllers/offboardingController.js";

import {
    createWorkflow,
    getWorkflows
} from "./controllers/workflowController.js";

import {
    createClearance,
    getClearances,
    updateClearance
} from "./controllers/clearanceController.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "Employee Offboarding API Running"
    });
});

app.post("/employees", createEmployee);
app.get("/employees", getEmployees);

app.post("/offboarding", createOffboarding);
app.get("/offboarding", getOffboardings);
app.get("/offboarding/:id", getOffboardingById);

app.post("/workflow", createWorkflow);
app.get("/workflow", getWorkflows);

app.post("/clearance", createClearance);
app.get("/clearance", getClearances);
app.patch("/clearance/:id", updateClearance);

export default app;