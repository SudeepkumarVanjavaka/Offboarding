import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    userName: String,
    message: String,
    status: {
        type: String,
        default: "Unread"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model("Notification", notificationSchema);