import express from "express";
import {
    createSubTask,
    createSubTaskForAdmin,
    createTask,
    dashboardStatistics,
    deleteRestoreTask,
    deleteRestoreTaskForAdmin,
    duplicateTask,
    getAllTasksForAdmin,
    getTask,
    getTaskForAdmin,
    getTasks,
    postTaskActivity,
    postTaskActivityForAdmin,
    trashTask,
    trashTaskForAdmin,
    updateTask,
    updateTaskForAdmin,
} from "../controllers/taskController.js";
import { uploadTaskAsset, deleteTaskAsset, downloadTaskAsset } from "../controllers/assetController.js";
import { isAdminRoute, protectRoute } from "../middlewares/authMiddlewaves.js";
import upload from "../middlewares/upload.js";

const router = express.Router();

// Regular user routes (with access control)
router.post("/activity/:id", protectRoute, postTaskActivity);
router.get("/dashboard", protectRoute, dashboardStatistics);
router.get("/", protectRoute, getTasks);
router.get("/:id", protectRoute, getTask);
router.put("/create-subtask/:id", protectRoute, createSubTask);
router.post("/duplicate/:id", protectRoute, duplicateTask);

// Asset routes for regular users
router.post("/:id/upload", protectRoute, upload.array('files', 5), uploadTaskAsset);
router.delete("/:id/assets/:assetId", protectRoute, deleteTaskAsset);
router.get("/:id/assets/:assetId/download", protectRoute, downloadTaskAsset);

// Admin routes (full access to all tasks)
router.post("/create", protectRoute, isAdminRoute, createTask);
router.post("/duplicate/:id", protectRoute, isAdminRoute, duplicateTask);
router.post("/admin/activity/:id", protectRoute, isAdminRoute, postTaskActivityForAdmin);

router.get("/admin/all", protectRoute, isAdminRoute, getAllTasksForAdmin);
router.get("/admin/:id", protectRoute, isAdminRoute, getTaskForAdmin);

router.put("/admin/create-subtask/:id", protectRoute, isAdminRoute, createSubTaskForAdmin);
router.put("/admin/update/:id", protectRoute, isAdminRoute, updateTaskForAdmin);
router.put("/admin/:id", protectRoute, isAdminRoute, trashTaskForAdmin);

router.delete(
  "/admin/delete-restore/:id?",
  protectRoute,
  isAdminRoute,
  deleteRestoreTaskForAdmin
);

export default router;
