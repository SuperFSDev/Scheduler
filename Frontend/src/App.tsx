import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import "./App.css";
import { time } from "console";

interface Task {
  _id: string;
  type: string;
  title: string;
  content: string;
  time?: string;
  cron?: string;
}

interface Log {
  taskName: string;
  taskType: string;
  executedAt: string;
}

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [logs, setLogs] = useState<Log[]>([]);
  const [newTask, setNewTask] = useState<{
    type: string;
    title: string;
    content: string;
    time: string;
    cron: string;
  }>({ type: "one-time", title: "", content: "", time: "", cron: "" });
  const [showLogs, setShowLogs] = useState<boolean>(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    fetchTasks();
    fetchLogs();
  }, []);

  const fetchTasks = async () => {
    const response = await axios.get<Task[]>("http://localhost:3000/api/tasks");
    setTasks(response.data);
  };

  const fetchLogs = async () => {
    const response = await axios.get<Log[]>("http://localhost:3000/logs");
    setLogs(response.data);
  };

  const handleChange = (
    e: ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    console.log(e.target.value);
    setNewTask({ ...newTask, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (editingTask) {
      await axios.put(
        `http://localhost:3000/api/tasks/${editingTask._id}`,
        newTask
      );
      setEditingTask(null);
    } else {
      await axios.post("http://localhost:3000/api/tasks", newTask);
    }
    setNewTask({
      type: "one-time",
      title: "",
      content: "",
      time: "",
      cron: "",
    });
    fetchTasks();
  };

  const handleDelete = async (id: string) => {
    await axios.delete(`http://localhost:3000/api/tasks/${id}`);
    fetchTasks();
  };

  const handleEdit = (task: Task) => {
    const formattedTime = task.time
      ? convertToISOFormat(new Date(task.time).toLocaleString().slice(0, 16))
      : "";
    console.log(task.time);
    console.log(formattedTime);
    setEditingTask(task);
    setNewTask({
      type: task.type,
      title: task.title,
      content: task.content,
      time: formattedTime,
      cron: task.cron || "",
    });
  };

  const convertToUserTimezone = (isoDateStr: string): string => {
    const date = new Date(isoDateStr);
    return date.toLocaleString();
  };

  const convertToISOFormat = (dateStr: string) => {
    const date = new Date(dateStr);

    // Get year, month, and day
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const day = String(date.getDate()).padStart(2, "0");

    // Get hours and minutes
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    // Format the string as required
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const toggleLogs = () => {
    setShowLogs(!showLogs);
  };

  const refreshLogs = () => {
    fetchLogs();
  };

  return (
    <div>
      <h1>Task Scheduler</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Type:
          <select name="type" onChange={handleChange} value={newTask.type}>
            <option value="one-time">One-Time</option>
            <option value="recurring">Recurring</option>
          </select>
        </label>
        <label>
          Title:
          <input
            type="text"
            name="title"
            onChange={handleChange}
            value={newTask.title}
          />
        </label>
        <label>
          Content:
          <input
            type="text"
            name="content"
            onChange={handleChange}
            value={newTask.content}
          />
        </label>
        <label>
          Time:
          <input
            type="datetime-local"
            name="time"
            onChange={handleChange}
            value={newTask.time}
          />
        </label>
        <label>
          Cron:
          <input
            type="text"
            name="cron"
            onChange={handleChange}
            value={newTask.cron}
          />
        </label>
        <button type="submit">
          {editingTask ? "Update Task" : "Create Task"}
        </button>
      </form>

      <h2>Tasks</h2>
      <table className="task-table">
        <thead>
          <tr>
            <th>Type</th>
            <th>Title</th>
            <th>Content</th>
            <th>Execution Time or Cron</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task._id}>
              <td>{task.type}</td>
              <td>{task.title}</td>
              <td>{task.content}</td>
              <td>
                {task.time ? convertToUserTimezone(task.time) : task.cron}
              </td>
              <td>
                <button onClick={() => handleEdit(task)}>Edit</button>
                <button onClick={() => handleDelete(task._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="button-container">
        <button className="toggle-button" onClick={toggleLogs}>
          {showLogs ? "Hide" : "Show"} Execution Logs
        </button>
        <button className="refresh-button" onClick={refreshLogs}>
          Refresh Logs
        </button>
      </div>

      {showLogs && (
        <>
          <h2>Execution Logs</h2>
          <table>
            <thead>
              <tr>
                <th>Task Name</th>
                <th>Task Type</th>
                <th>Executed At</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, index) => (
                <tr key={index}>
                  <td>{log.taskName}</td>
                  <td>{log.taskType}</td>
                  <td>{new Date(log.executedAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default App;
