import Clearance from "../models/clearance.js";
import Offboarding from "../models/offboarding.js";
import AuditLog from "../models/AuditLog.js";

export const createClearance = async (req, res) => {
    try {
        const clearance = await Clearance.create(req.body);
        res.status(201).json(clearance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getClearances = async (req, res) => {
    try {
        const { offboardingId } = req.query;
        const filter = offboardingId ? { offboardingId } : {};
        const clearances = await Clearance.find(filter);
        res.json(clearances);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateClearance = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, remarks, approvedBy } = req.body;

        const clearance = await Clearance.findById(id);
        if (!clearance) {
            return res.status(404).json({ message: "Clearance stage not found" });
        }

        clearance.status = status || clearance.status;
        clearance.remarks = remarks !== undefined ? remarks : clearance.remarks;
        clearance.approvedBy = approvedBy || clearance.approvedBy || "Department Lead";
        clearance.approvedAt = new Date();
        await clearance.save();

        // Log audit record
        await AuditLog.create({
            offboardingId: clearance.offboardingId,
            userName: clearance.approvedBy,
            role: clearance.department,
            action: `Stage ${clearance.status}`,
            remarks: clearance.remarks || `Clearance marked as ${clearance.status}`
        });

        // Evaluate overall workflow progress for this offboarding case
        const allStages = await Clearance.find({ offboardingId: clearance.offboardingId });
        const anyRejected = allStages.some(s => s.status === "Rejected");
        const allApproved = allStages.length > 0 && allStages.every(s => s.status === "Approved");

        let newOffboardingStatus = "In Progress";
        if (anyRejected) {
            newOffboardingStatus = "Rejected";
        } else if (allApproved) {
            newOffboardingStatus = "Completed";
        }

        let updatedOffboarding = null;
        if (clearance.offboardingId.match(/^[0-9a-fA-F]{24}$/)) {
            updatedOffboarding = await Offboarding.findByIdAndUpdate(
                clearance.offboardingId,
                { status: newOffboardingStatus },
                { returnDocument: 'after' }
            );
        }

        res.json({
            clearance,
            offboardingStatus: newOffboardingStatus,
            offboarding: updatedOffboarding
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};