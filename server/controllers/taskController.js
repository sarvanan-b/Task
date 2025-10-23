import Notice from "../models/notification.js";
import Task from "../models/task.js";
import User from "../models/user.js";

export const createTask = async (req, res) => {
  try {
    const { userId } = req.user;
    const { title, description, team, stage, date, priority } = req.body;

    let text = "New task has been assigned to you";
    if (team?.length > 1) {
      text += ` and ${team.length - 1} others.`;
    }

    text += ` The task priority is set at ${priority} priority, so check and act accordingly. The task date is ${new Date(
      date
    ).toDateString()}. Thank you!`;

    const activity = {
      type: "assigned",
      activity: text,
      by: userId,
    };

    const task = await Task.create({
      title,
      team,
      stage: stage.toLowerCase(),
      date,
      priority: priority.toLowerCase(),
      description,
      activities: activity,
    });

    await Notice.create({
      team,
      text,
      task: task._id,
    });

    res.status(200).json({ status: true, task, message: "Task created successfully." });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};


export const duplicateTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id);

    const newTask = await Task.create({
      ...task,
      title: task.title + " - Duplicate",
    });

    newTask.team = task.team;
    newTask.subTasks = task.subTasks;
    newTask.description = task.description;
    newTask.priority = task.priority;
    newTask.stage = task.stage;

    await newTask.save();

    //alert users of the task
    let text = "New task has been assigned to you";
    if (task.team.length > 1) {
      text = text + ` and ${task.team.length - 1} others.`;
    }

    text =
      text +
      ` The task priority is set a ${
        task.priority
      } priority, so check and act accordingly. The task date is ${task.date.toDateString()}. Thank you!!!`;

    await Notice.create({
      team: task.team,
      text,
      task: newTask._id,
    });

    res
      .status(200)
      .json({ status: true, message: "Task duplicated successfully." });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const postTaskActivity = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;
    const { type, activity } = req.body;

    const task = await Task.findOne({ 
      _id: id, 
      team: userId  // Only allow if user is assigned to this task
    });

    if (!task) {
      return res.status(404).json({ 
        status: false, 
        message: "Task not found or you don't have access to this task" 
      });
    }

    const data = {
      type,
      activity,
      by: userId,
    };

    task.activities.push(data);

    await task.save();

    res
      .status(200)
      .json({ status: true, message: "Activity posted successfully." });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const dashboardStatistics = async (req, res) => {
  try {
    const { userId, isAdmin } = req.user;

    const allTasks = isAdmin
      ? await Task.find({
          isTrashed: false,
        })
          .populate({
            path: "team",
            select: "name role title email",
          })
          .sort({ _id: -1 })
      : await Task.find({
          isTrashed: false,
          team: { $all: [userId] },
        })
          .populate({
            path: "team",
            select: "name role title email",
          })
          .sort({ _id: -1 });

    const users = await User.find({ isActive: true })
      .select("name title role isAdmin createdAt")
      .limit(10)
      .sort({ _id: -1 });

    //   group task by stage and calculate counts
    const groupTasks = allTasks.reduce((result, task) => {
      const stage = task.stage;

      if (!result[stage]) {
        result[stage] = 1;
      } else {
        result[stage] += 1;
      }

      return result;
    }, {});

    // Group tasks by priority
    const groupData = Object.entries(
      allTasks.reduce((result, task) => {
        const { priority } = task;

        result[priority] = (result[priority] || 0) + 1;
        return result;
      }, {})
    ).map(([name, total]) => ({ name, total }));

    // calculate total tasks
    const totalTasks = allTasks?.length;
    const last10Task = allTasks?.slice(0, 10);

    const summary = {
      totalTasks,
      last10Task,
      users: isAdmin ? users : [],
      tasks: groupTasks,
      graphData: groupData,
    };

    res.status(200).json({
      status: true,
      message: "Successfully",
      ...summary,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const getTasks = async (req, res) => {
  try {
    const { userId } = req.user;
    const { stage, isTrashed } = req.query;

    let query = { 
      isTrashed: isTrashed ? true : false,
      team: userId  // Only show tasks assigned to the current user
    };

    if (stage) {
      query.stage = stage;
    }

    let queryResult = Task.find(query)
      .populate({
        path: "team",
        select: "name title email",
      })
      .sort({ _id: -1 });

    const tasks = await queryResult;

    res.status(200).json({
      status: true,
      tasks,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const getAllTasksForAdmin = async (req, res) => {
  try {
    const { stage, isTrashed } = req.query;

    let query = { isTrashed: isTrashed ? true : false };

    if (stage) {
      query.stage = stage;
    }

    let queryResult = Task.find(query)
      .populate({
        path: "team",
        select: "name title email",
      })
      .sort({ _id: -1 });

    const tasks = await queryResult;

    res.status(200).json({
      status: true,
      tasks,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const getTaskForAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id)
      .populate({
        path: "team",
        select: "name title role email",
      })
      .populate({
        path: "activities.by",
        select: "name",
      });

    if (!task) {
      return res.status(404).json({ 
        status: false, 
        message: "Task not found" 
      });
    }

    res.status(200).json({
      status: true,
      task,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const updateTaskForAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, date, team, stage, priority, assets } = req.body;

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ 
        status: false, 
        message: "Task not found" 
      });
    }

    task.title = title;
    task.description = description;
    task.date = date;
    task.priority = priority.toLowerCase();
    task.stage = stage.toLowerCase();
    task.team = team;

    await task.save();

    res
      .status(200)
      .json({ status: true, message: "Task updated successfully." });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const trashTaskForAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ 
        status: false, 
        message: "Task not found" 
      });
    }

    task.isTrashed = true;

    await task.save();

    res.status(200).json({
      status: true,
      message: `Task trashed successfully.`,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const createSubTaskForAdmin = async (req, res) => {
  try {
    const { title, tag, date } = req.body;
    const { id } = req.params;

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ 
        status: false, 
        message: "Task not found" 
      });
    }

    const newSubTask = {
      title,
      date,
      tag,
    };

    task.subTasks.push(newSubTask);

    await task.save();

    res.status(200).json({ status: true, message: "SubTask added successfully." });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const postTaskActivityForAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;
    const { type, activity } = req.body;

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ 
        status: false, 
        message: "Task not found" 
      });
    }

    const data = {
      type,
      activity,
      by: userId,
    };

    task.activities.push(data);

    await task.save();

    res
      .status(200)
      .json({ status: true, message: "Activity posted successfully." });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const deleteRestoreTaskForAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { actionType } = req.query;

    if (actionType === "delete") {
      const task = await Task.findById(id);
      if (!task) {
        return res.status(404).json({ 
          status: false, 
          message: "Task not found" 
        });
      }
      await Task.findByIdAndDelete(id);
    } else if (actionType === "deleteAll") {
      await Task.deleteMany({ isTrashed: true });
    } else if (actionType === "restore") {
      const task = await Task.findById(id);
      if (!task) {
        return res.status(404).json({ 
          status: false, 
          message: "Task not found" 
        });
      }
      task.isTrashed = false;
      await task.save();
    } else if (actionType === "restoreAll") {
      await Task.updateMany(
        { isTrashed: true },
        { $set: { isTrashed: false } }
      );
    }

    res.status(200).json({
      status: true,
      message: `Operation performed successfully.`,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const getTask = async (req, res) => {
  try {
    const { userId } = req.user;
    const { id } = req.params;

    const task = await Task.findOne({ 
      _id: id, 
      team: userId  // Only allow access if user is assigned to this task
    })
      .populate({
        path: "team",
        select: "name title role email",
      })
      .populate({
        path: "activities.by",
        select: "name",
      });

    if (!task) {
      return res.status(404).json({ 
        status: false, 
        message: "Task not found or you don't have access to this task" 
      });
    }

    res.status(200).json({
      status: true,
      task,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const createSubTask = async (req, res) => {
  try {
    const { userId } = req.user;
    const { title, tag, date } = req.body;
    const { id } = req.params;

    const task = await Task.findOne({ 
      _id: id, 
      team: userId  // Only allow if user is assigned to this task
    });

    if (!task) {
      return res.status(404).json({ 
        status: false, 
        message: "Task not found or you don't have access to this task" 
      });
    }

    const newSubTask = {
      title,
      date,
      tag,
    };

    task.subTasks.push(newSubTask);

    await task.save();

    res.status(200).json({ status: true, message: "SubTask added successfully." });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { userId } = req.user;
    const { id } = req.params;
    const { title, description, date, team, stage, priority, assets } = req.body;

    const task = await Task.findOne({ 
      _id: id, 
      team: userId  // Only allow update if user is assigned to this task
    });

    if (!task) {
      return res.status(404).json({ 
        status: false, 
        message: "Task not found or you don't have access to this task" 
      });
    }

    task.title = title;
    task.description = description; // Include description here
    task.date = date;
    task.priority = priority.toLowerCase();
    task.stage = stage.toLowerCase();
    task.team = team;

    await task.save();

    res
      .status(200)
      .json({ status: true, message: "Task updated successfully." });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};


export const trashTask = async (req, res) => {
  try {
    const { userId } = req.user;
    const { id } = req.params;

    const task = await Task.findOne({ 
      _id: id, 
      team: userId  // Only allow trash if user is assigned to this task
    });

    if (!task) {
      return res.status(404).json({ 
        status: false, 
        message: "Task not found or you don't have access to this task" 
      });
    }

    task.isTrashed = true;

    await task.save();

    res.status(200).json({
      status: true,
      message: `Task trashed successfully.`,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const deleteRestoreTask = async (req, res) => {
  try {
    const { userId } = req.user;
    const { id } = req.params;
    const { actionType } = req.query;

    if (actionType === "delete") {
      const task = await Task.findOne({ _id: id, team: userId });
      if (!task) {
        return res.status(404).json({ 
          status: false, 
          message: "Task not found or you don't have access to this task" 
        });
      }
      await Task.findByIdAndDelete(id);
    } else if (actionType === "deleteAll") {
      // Only delete tasks assigned to the current user
      await Task.deleteMany({ isTrashed: true, team: userId });
    } else if (actionType === "restore") {
      const task = await Task.findOne({ _id: id, team: userId });
      if (!task) {
        return res.status(404).json({ 
          status: false, 
          message: "Task not found or you don't have access to this task" 
        });
      }
      task.isTrashed = false;
      await task.save();
    } else if (actionType === "restoreAll") {
      // Only restore tasks assigned to the current user
      await Task.updateMany(
        { isTrashed: true, team: userId },
        { $set: { isTrashed: false } }
      );
    }

    res.status(200).json({
      status: true,
      message: `Operation performed successfully.`,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};
