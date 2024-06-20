import express from "express";
import mongoose from "mongoose";
import taskRouter from "./routes/tasks";
const fs = require("fs");
import path from "path";

const logFile = path.resolve(__dirname, "./taskLogs.json");
console.log(logFile);

const cors = require("cors");

const app = express();

app.use(cors());

app.use(express.json());

app.get("/logs", (req, res) => {
  fs.readFile(
    logFile,
    "utf8",
    (err: NodeJS.ErrnoException | null, data: string) => {
      if (err) {
        console.error("Error reading log file:", err);
        return res.status(500).send("Internal Server Error");
      }

      try {
        const logs = JSON.parse(data);
        res.json(logs);
      } catch (parseErr) {
        console.error("Error parsing log file:", parseErr);
        res.status(500).send("Internal Server Error");
      }
    }
  );
});

mongoose
  .connect("mongodb://mongo:27017/taskScheduler")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
  });

// Use task routes
app.use("/api", taskRouter);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
