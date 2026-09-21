import express from "express";
import cors from "cors";
import taskRoutes from "./routes/routes.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(taskRoutes);

app.listen(3000, () => {
    console.log("Server running on port 3000");
});