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
    refresh,
    logout,
    forgotpassword,
} from "../controllers/controllers.js";

const router = Router();

router.post("/tasks",authMiddleware, createtask);
router.get("/tasks",authMiddleware, getAllTasks);
router.get("/tasks/:id",authMiddleware, getTask);
router.put("/tasks/:id",authMiddleware, updatetask);
router.delete("/tasks/:id",authMiddleware, deletetask);
router.post("/auth/register", registerusers);
router.post("/auth/login", loginuser);
router.post("/auth/refresh", refresh );
router.post("/auth/logout", logout);
router.post("/auth/forgotpassword", forgotpassword);

export default router;


