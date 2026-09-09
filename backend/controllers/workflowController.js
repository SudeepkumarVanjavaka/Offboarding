import Workflow from "../models/workflow.js";

export const createWorkflow = async (req, res) => {
    try {
        const workflow = await Workflow.create(req.body);
        res.status(201).json(workflow);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getWorkflows = async (req, res) => {
    try {
        const workflows = await Workflow.find();
        res.json(workflows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};