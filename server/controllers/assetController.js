import Task from "../models/task.js";
import fs from "fs";

// Asset Management Functions
export const uploadTaskAsset = async (req, res) => {
  try {
    const { userId } = req.user;
    const { id } = req.params;
    const files = req.files;

    console.log("Upload request - userId:", userId, "taskId:", id);

    if (!files || files.length === 0) {
      return res.status(400).json({
        status: false,
        message: "No files uploaded"
      });
    }

    // First, let's check if the task exists at all
    const taskExists = await Task.findById(id);
    console.log("Task exists:", !!taskExists);
    if (taskExists) {
      console.log("Task team members:", taskExists.team);
      console.log("User ID type:", typeof userId);
      console.log("Team member types:", taskExists.team.map(t => typeof t));
    }

    // Check if user has access to this task
    let task;
    if (req.user.isAdmin) {
      // Admin can upload to any task
      task = await Task.findById(id);
    } else {
      // Regular user can only upload to assigned tasks
      task = await Task.findOne({ 
        _id: id, 
        team: userId 
      });
    }

    console.log("Found task with user access:", !!task);

    if (!task) {
      // Clean up uploaded files if user doesn't have access
      files.forEach(file => {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
      
      return res.status(404).json({
        status: false,
        message: "Task not found or you don't have access to this task"
      });
    }

    // Process uploaded files
    const assets = files.map(file => ({
      filename: file.filename,
      originalName: file.originalname,
      path: file.path,
      size: file.size,
      mimetype: file.mimetype,
      uploadedBy: userId,
      uploadedAt: new Date()
    }));

    // Add assets to task
    task.assets.push(...assets);
    await task.save();

    res.status(200).json({
      status: true,
      message: `${files.length} file(s) uploaded successfully`,
      assets: task.assets
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const deleteTaskAsset = async (req, res) => {
  try {
    const { userId } = req.user;
    const { id, assetId } = req.params;

    // Check if user has access to this task
    let task;
    if (req.user.isAdmin) {
      // Admin can access any task
      task = await Task.findById(id);
    } else {
      // Regular user can only access assigned tasks
      task = await Task.findOne({ 
        _id: id, 
        team: userId 
      });
    }

    if (!task) {
      return res.status(404).json({
        status: false,
        message: "Task not found or you don't have access to this task"
      });
    }

    // Find the asset
    const asset = task.assets.id(assetId);
    if (!asset) {
      return res.status(404).json({
        status: false,
        message: "Asset not found"
      });
    }

    // Delete file from filesystem
    if (fs.existsSync(asset.path)) {
      fs.unlinkSync(asset.path);
    }

    // Remove asset from task
    task.assets.pull(assetId);
    await task.save();

    res.status(200).json({
      status: true,
      message: "Asset deleted successfully"
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const downloadTaskAsset = async (req, res) => {
  try {
    const { userId } = req.user;
    const { id, assetId } = req.params;

    // Check if user has access to this task
    let task;
    if (req.user.isAdmin) {
      // Admin can access any task
      task = await Task.findById(id);
    } else {
      // Regular user can only access assigned tasks
      task = await Task.findOne({ 
        _id: id, 
        team: userId 
      });
    }

    if (!task) {
      return res.status(404).json({
        status: false,
        message: "Task not found or you don't have access to this task"
      });
    }

    // Find the asset
    const asset = task.assets.id(assetId);
    if (!asset) {
      return res.status(404).json({
        status: false,
        message: "Asset not found"
      });
    }

    // Check if file exists
    if (!fs.existsSync(asset.path)) {
      return res.status(404).json({
        status: false,
        message: "File not found on server"
      });
    }

    // Set headers for download
    res.setHeader('Content-Disposition', `attachment; filename="${asset.originalName}"`);
    res.setHeader('Content-Type', asset.mimetype);
    res.setHeader('Content-Length', asset.size);

    // Stream the file
    const fileStream = fs.createReadStream(asset.path);
    fileStream.pipe(res);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};
