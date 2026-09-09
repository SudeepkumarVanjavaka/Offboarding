import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
    employeeId: String,
    name: String,
    email: String,
    department: String,
    designation: String,
    joiningDate: Date
});

export default mongoose.model("Employee", employeeSchema);