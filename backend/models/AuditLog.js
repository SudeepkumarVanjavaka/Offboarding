import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema({
    offboardingId: String,
    userName: String,
    role: String,
    action: String,
    remarks: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model("AuditLog", auditLogSchema);