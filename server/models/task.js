import mongoose, { Schema } from "mongoose";

const taskSchema = new Schema(
  {
    title: { type: String, required: true },
    date: { type: Date, default: new Date() },
    priority: {
      type: String,
      default: "",
      enum: ["high", "medium", "normal", "none"],
    },
    stage: {
      type: String,
      default: "todo",
      enum: ["todo", "in progress", "completed"],
    },
    activities: [
      {
        type: {
          type: String,
          default: "assigned",
          enum: [
            "assigned",
            "started",
            "in progress",
            "bug",
            "completed",
            "commented",
          ],
        },
        activity: String,
        date: { type: Date, default: new Date() },
        by: { type: Schema.Types.ObjectId, ref: "User" },
      },
    ],
    subTasks: [
      {
        title: String,
        date: Date,
        tag: String,
      },
    ],
    assets: [
      {
        filename: { type: String, required: true }, // Server filename
        originalName: { type: String, required: true }, // Original filename
        path: { type: String, required: true }, // File path on server
        size: { type: Number, required: true }, // File size in bytes
        mimetype: { type: String, required: true }, // MIME type
        uploadedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
    description: { type: String, default: "" }, // Added description field
    team: [{ type: Schema.Types.ObjectId, ref: "User" }],
    isTrashed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);

export default Task;
