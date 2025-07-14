// backend/controllers/taskController.js
import Task from "../models/Task.js";

export const createTask = async (req, res) => {
  const { title } = req.body;
  try {
    const task = await Task.create({ title, user: req.userId });
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ msg: "Error creating task" });
  }
};

export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.userId });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching tasks" });
  }
};

export const updateTask = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const task = await Task.findOneAndUpdate(
      { _id: id, user: req.userId },
      { status },
      { new: true }
    );
    res.json(task);
  } catch (err) {
    res.status(500).json({ msg: "Error updating task" });
  }
};

export const deleteTask = async (req, res) => {
  const { id } = req.params;
  try {
    await Task.findOneAndDelete({ _id: id, user: req.userId });
    res.json({ msg: "Task deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Error deleting task" });
  }
};
