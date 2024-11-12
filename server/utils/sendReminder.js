import Notice from "../models/notification.js";  // Import the Notice model

const sendReminder = async (userId, description ) => {
    try {
        // Create a new notification document for the reminder
        const notification = new Notice({
            team: [userId],  // Assuming each reminder targets one user
            text: `Reminder: ${description}`,
            notiType: "alert",  // Setting notification type as "alert" for reminders
            isRead: [],  // Initially, no users have read the notification
        });

        await notification.save();
        console.log(`Reminder sent to user ${userId} for task: ${description}`);
    } catch (error) {
        console.error("Error sending reminder:", error);
    }
};

export default sendReminder;
