import cron from 'node-cron';
import Task from "../models/task.js";  // Import the Task model
import { getReminderPrediction } from "../utils/predictionUtils.js";  // Import the prediction utility
import sendReminder from '../utils/sendReminder.js';  // Import the reminder sender utility

const scheduleReminders = () => {
  // Schedule the task to run every day at midnight
  cron.schedule('0 0 * * *', async () => {
      try {
          // Fetch tasks that have description, priority, and a deadline
          const tasks = await Task.find({
              description: { $exists: true, $ne: "" },
              priority: { $exists: true },
              date: { $exists: true, $ne: null } // Adjust if using deadline instead of date
          });

          // Iterate over each task
          for (let task of tasks) {
              const { description, priority, date, team } = task;

              // Predict the reminder timing based on task details
              const reminderTiming = await getReminderPrediction(task._id);

              // Calculate days remaining until the task's deadline
              const daysUntilDeadline = Math.floor((new Date(date) - new Date()) / (1000 * 60 * 60 * 24));

              // Ensure team is not empty, and pick the first user (or adapt logic to match your model)
              const userId = team[0];  // Modify as needed based on team structure

              // Send reminders if the timing and deadline conditions match
              if (
                  (reminderTiming === 'immediate' && daysUntilDeadline <= 1) ||
                  (reminderTiming === 'daily' && daysUntilDeadline <= 7) ||
                  (reminderTiming === 'weekly' && daysUntilDeadline <= 30)
              ) {
                  // Send reminder to the user
                  await sendReminder(userId, description);
              }
          }
      } catch (error) {
          console.error("Error in reminder scheduler:", error);
      }
  });
};

export default scheduleReminders;
