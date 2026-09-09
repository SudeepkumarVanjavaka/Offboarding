import mongoose from "mongoose";

const offboardingSchema = new mongoose.Schema({
    employeeId: String,
    resignationDate: Date,
    lastWorkingDay: Date,
    reason: String,
    status: {
        type: String,
        default: "In Progress"
    }
});

export default mongoose.model("Offboarding", offboardingSchema);