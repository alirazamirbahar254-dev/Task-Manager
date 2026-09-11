import { Router } from "express";
import {
    createtask,
    getAllTasks,
    getTask,
    updatetask,
    deletetask
} from "../controllers/controllers.js";

const router = Router();

router.post("/tasks", createtask);
router.get("/tasks", getAllTasks);
router.get("/tasks/:id", getTask);
router.put("/tasks/:id", updatetask);
router.delete("/tasks/:id", deletetask);

export default router;


