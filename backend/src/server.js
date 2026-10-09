import express from "express";
import dotenv from "dotenv";
dotenv.config();
import { emailoptions } from "../services/emailservices.js";
import cors from "cors";
import taskRoutes from "./routes/routes.js";
import cookieParser from "cookie-parser";

const app = express();
app.use(cookieParser());
app.use(cors({origin:`http://127.0.0.1:5500`, credentials: true}));
app.use(express.json());
app.use(taskRoutes);

app.listen(3000, () => {
    console.log("Server running on port 3000");
});










