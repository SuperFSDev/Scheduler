import { Schema, model, Document } from "mongoose";

interface ITask extends Document {
  _id: string;
  type: string;
  title: string;
  content: string;
  time?: Date;
  cron?: string;
  executedAt?: Date;
}

const taskSchema = new Schema<ITask>({
  type: { type: String, required: true },
  title: { type: String },
  content: { type: String },
  time: { type: Date },
  cron: { type: String },
  executedAt: { type: Date },
});

const Task = model<ITask>("Task", taskSchema);
export default Task;
