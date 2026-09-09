import mongoose from "mongoose";

const workflowSchema = new mongoose.Schema({
    name: String,

    stages: [
        {
            name: String,
            role: String,
            order: Number,
            type: {
                type: String,
                default: "Sequential"
            }
        }
    ]
});

export default mongoose.model("Workflow", workflowSchema);