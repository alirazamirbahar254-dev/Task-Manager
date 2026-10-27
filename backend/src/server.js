import express from "express";
import dotenv from "dotenv";
dotenv.config();
import { emailoptions } from "../services/emailservices.js";
import cors from "cors";
import taskRoutes from "./routes/routes.js";
import cookieParser from "cookie-parser";

const app = express();
app.use(cookieParser());

app.use(cors({
    origin: [
        "http://127.0.0.1:5500",
        "http://localhost:5500",
        "https://task-manager-frontend-gmu4m4nma-aliraza-s-project.vercel.app",
        "https://task-manager-frontend-plum-alpha.vercel.app",
    ],
    credentials: true
}));

app.use(express.json());
app.use(taskRoutes);

app.listen(3000, () => {
    console.log("Server running on port 3000");
});









