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
router.get("/tasks",authMiddleware, getAllTasks);
router.get("/tasks/:id",authMiddleware, getTask);
router.put("/tasks/:id",authMiddleware, updatetask);
router.delete("/tasks/:id",authMiddleware, deletetask);
router.post("/auth/register", registerusers);
router.post("/auth/login", loginuser)
router.get("/test-auth", authMiddleware, (req, res) => {
    res.json({ message: "Middleware passed" });
});

export default router;


