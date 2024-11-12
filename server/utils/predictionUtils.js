import { spawn } from 'child_process';
import path from 'path';

export const getReminderPrediction = async (description, priority, deadline) => {
    try {
        // Path to your Python script
        
        const scriptPath = path.join(__dirname, '..', 'models', 'ml', 'predict_reminder.py');

        
        // Spawn the Python process with the required arguments
        const pythonProcess = spawn('python', [scriptPath, description, priority, deadline]);

        let result = '';

        // Capture the output from the Python script
        pythonProcess.stdout.on('data', (data) => {
            result += data.toString();  // Accumulate the result
        });

        // Handle any errors from the Python script
        pythonProcess.stderr.on('data', (data) => {
            console.error(`Error: ${data}`);
        });

        // When the Python process closes, resolve the promise with the result
        return new Promise((resolve, reject) => {
            pythonProcess.on('close', (code) => {
                if (code === 0) {
                    resolve(result.trim());  // Send back the result (daily, weekly, or monthly)
                } else {
                    reject('Prediction failed');
                }
            });
        });
    } catch (error) {
        console.error('Error in getReminderPrediction:', error);
        throw error;  // Propagate the error
    }
};
