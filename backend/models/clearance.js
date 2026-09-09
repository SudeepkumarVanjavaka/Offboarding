import mongoose from "mongoose";

const clearanceSchema = new mongoose.Schema({
    offboardingId: String,
    department: String,
    remarks: String,

    status: {
        type: String,
        default: "Pending"
    },

    approvedBy: String,
    approvedAt: Date
});

export default mongoose.model("Clearance", clearanceSchema);