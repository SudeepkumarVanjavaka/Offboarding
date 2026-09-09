import Offboarding from "../models/offboarding.js";
import Employee from "../models/employee.js";
import Clearance from "../models/clearance.js";
import Workflow from "../models/workflow.js";
import AuditLog from "../models/AuditLog.js";

export const createOffboarding = async (req, res) => {
    try {
        const offboarding = await Offboarding.create(req.body);

        // Fetch workflow stages or use standard stages
        const defaultWorkflow = await Workflow.findOne({ name: "Standard Offboarding Workflow" });
        const stages = (defaultWorkflow && defaultWorkflow.stages && defaultWorkflow.stages.length > 0)
            ? defaultWorkflow.stages
            : [
                { name: "Project / Reporting Manager", role: "Manager", order: 1 },
                { name: "Admin & Systems", role: "System Admin", order: 2 },
                { name: "Accounts", role: "Finance Officer", order: 3 },
                { name: "Personnel", role: "HR Personnel", order: 4 },
                { name: "HR", role: "HR Head", order: 5 }
            ];

        // Create clearance stages for this offboarding case
        const clearanceDocs = stages.map(stage => ({
            offboardingId: String(offboarding._id),
            department: stage.name,
            remarks: "",
            status: "Pending",
            approvedBy: "",
            approvedAt: null
        }));

        const clearances = await Clearance.insertMany(clearanceDocs);

        // Create initial audit log
        await AuditLog.create({
            offboardingId: String(offboarding._id),
            userName: "HR Admin",
            role: "HR",
            action: "Offboarding Initiated",
            remarks: req.body.reason || `Initiated for employee ${req.body.employeeId}`
        });

        res.status(201).json({
            ...offboarding.toObject(),
            clearances
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getOffboardings = async (req, res) => {
    try {
        const offboardings = await Offboarding.find().sort({ _id: -1 });

        const enriched = await Promise.all(
            offboardings.map(async (item) => {
                const employee = await Employee.findOne({ employeeId: item.employeeId });
                const clearances = await Clearance.find({ offboardingId: String(item._id) });
                return {
                    ...item.toObject(),
                    employee: employee || null,
                    clearances: clearances || []
                };
            })
        );

        res.json(enriched);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getOffboardingById = async (req, res) => {
    try {
        const { id } = req.params;

        let offboarding = null;
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            offboarding = await Offboarding.findById(id);
        }
        if (!offboarding) {
            offboarding = await Offboarding.findOne({ employeeId: id });
        }

        if (!offboarding) {
            return res.status(404).json({ message: "Offboarding case not found" });
        }

        const employee = await Employee.findOne({ employeeId: offboarding.employeeId });
        const clearances = await Clearance.find({ offboardingId: String(offboarding._id) });
        const auditLogs = await AuditLog.find({ offboardingId: String(offboarding._id) }).sort({ createdAt: -1 });

        res.json({
            ...offboarding.toObject(),
            employee: employee || null,
            clearances: clearances || [],
            auditLogs: auditLogs || []
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};