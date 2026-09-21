import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
    createtask,
    getAllTasks,
    getTask,
    updatetask,
    deletetask,
    registerusers,
    loginuser,

} from "../controllers/controllers.js";

const router = Router();

router.post("/tasks",authMiddleware, createtask);
router.get("/tasks", getAllTasks);
router.get("/tasks/:id", getTask);
router.put("/tasks/:id", updatetask);
router.delete("/tasks/:id", deletetask);
router.post("/auth/register", registerusers);
router.post("/auth/login", loginuser)

router.get("/test-auth", authMiddleware, (req, res) => {
    res.json({ message: "Middleware passed" });
});

export default router;


