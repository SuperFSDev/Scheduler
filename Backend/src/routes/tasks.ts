import { Router } from "express";
import Task from "../models/Task";
import taskQueue from "../queue/taskQueue";

const router = Router();

router.post("/tasks", async (req, res) => {
  const { type, title, content, time, cron } = req.body;
  const task = new Task({ type, title, content, time, cron });
  await task.save();

  if (type === "one-time") {
    taskQueue.add(
      { taskId: task._id },
      { delay: new Date(time).getTime() - Date.now() }
    );
  } else {
    console.log(task._id, cron);
    taskQueue.add({ taskId: task._id }, { repeat: { cron } });
  }

  res.status(201).send(task);
});

router.get("/tasks", async (req, res) => {
  const tasks = await Task.find();
  res.send(tasks);
});

router.put("/tasks/:id", async (req, res) => {
  const { id } = req.params;
  const { type, title, content, time, cron } = req.body;
  const task = await Task.findByIdAndUpdate(
    id,
    { type, title, content, time, cron },
    { new: true }
  );

  if (task) {
    await taskQueue.removeJobs(task._id.toString());
    if (type === "one-time") {
      taskQueue.add(
        { taskId: task._id },
        { delay: new Date(time).getTime() - Date.now() }
      );
    } else {
      taskQueue.add({ taskId: task._id }, { repeat: { cron } });
    }
    res.send(task);
  } else {
    res.status(404).send({ error: "Task not found" });
  }
});

router.delete("/tasks/:id", async (req, res) => {
  const { id } = req.params;
  const task = await Task.findByIdAndDelete(id);
  if (task) {
    await taskQueue.removeJobs(task._id.toString());
    res.send({ message: "Task deleted" });
  } else {
    res.status(404).send({ error: "Task not found" });
  }
});

export default router;
