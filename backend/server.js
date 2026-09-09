import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "./app.js";
import { seedInitialData } from "./seed.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log("MongoDB Connected");

        await seedInitialData();

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.log("MongoDB Error:", error.message);
    });