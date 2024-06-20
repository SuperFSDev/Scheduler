import Bull from "bull";
import Task from "../models/Task";
import fs from "fs";
import path from "path";

const taskQueue = new Bull("taskQueue", "redis://redis:6379");
const logFile = path.resolve(__dirname, "../taskLogs.json");

interface JobData {
  taskId: string;
}

taskQueue.process(async (job: Bull.Job<JobData>) => {
  const task = await Task.findById(job.data.taskId);
  if (task) {
    task.executedAt = new Date();
    await task.save();
    console.log(`Executed task ${task.title} at ${task.executedAt}`);

    const logEntry = {
      taskName: task.title,
      taskType: task.type,
      executedAt: task.executedAt.toISOString(),
    };

    fs.readFile(logFile, "utf8", (readErr, data) => {
      if (readErr && readErr.code !== "ENOENT") {
        console.error("Error reading log file:", readErr);
        return;
      }

      let logs = [];
      if (data) {
        try {
          logs = JSON.parse(data);
        } catch (parseErr) {
          console.error("Error parsing log file:", parseErr);
        }
      }

      logs.push(logEntry);

      fs.writeFile(logFile, JSON.stringify(logs, null, 2), (writeErr) => {
        if (writeErr) {
          console.error("Error writing log entry:", writeErr);
        }
      });
    });
  }
});

export default taskQueue;
