import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

export default function Dashboard({ username = "User", onSignOut }) {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [optionsTaskId, setOptionsTaskId] = useState(null);
  const dropdownRef = useRef(null);
  const [isModalOpen, setModalOpen] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "normal",
  });

  const token = localStorage.getItem("token");

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      const res = await axios.get(
        "https://taskmanager-backend-2-fmff.onrender.com/api/tasks",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTasks(res.data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOptionsTaskId(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Add Task
  const handleAdd = async () => {
    const { title, description, dueDate, priority } = form;
    if (!title.trim() || !dueDate) return;

    try {
      const res = await axios.post(
        "https://taskmanager-backend-2-fmff.onrender.com/api/tasks",
        { title, description, dueDate, priority },
        {
          headers: { Authorization: `Bearer ${token} `},
        }
      );
      setTasks([res.data, ...tasks]);
      setForm({ title: "", description: "", dueDate: "", priority: "normal" });
      setModalOpen(false);
    } catch (err) {
      console.error("Error adding task:", err);
    }
  };

  // Toggle complete
  const toggleComplete = async (id, currentStatus) => {
    try {
      const res = await axios.put(
        `https://taskmanager-backend-2-fmff.onrender.com/api/tasks/${id}`,
        { completed: !currentStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTasks(tasks.map((t) => (t._id === id ? res.data : t)));
      setOptionsTaskId(null);
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  // Delete Task
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await axios.delete(
        `https://taskmanager-backend-2-fmff.onrender.com/api/tasks/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTasks(tasks.filter((t) => t._id !== id));
      setOptionsTaskId(null);
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  const filtered = tasks.filter((t) => {
    if (filter === "completed" && !t.completed) return false;
    if (filter === "pending" && t.completed) return false;
    return t.title.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const total = tasks.length;
  const completedCount = tasks.filter((t) => t.completed).length;
  const pendingCount = total - completedCount;
  const completionRate = total ? Math.round((completedCount / total) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-100 p-6 space-y-6">
      {/* Header */}
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Task Manager</h1>
          <p className="text-gray-600 text-lg">
            Welcome, <span className="font-semibold text-purple-700">{username}</span>!
          </p>
        </div>
        <button onClick={onSignOut} className="text-purple-600 hover:underline">
          Sign Out
        </button>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          ["Total", total],
          ["Completed", completedCount],
          ["Pending", pendingCount],
          ["Done %", `${completionRate}%`],
        ].map(([label, value]) => (
          <div key={label} className="bg-white p-4 rounded-lg shadow text-center">
            <div className="text-gray-500">{label}</div>
            <div className="text-xl font-bold">{value}</div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          className="flex-1 border rounded px-3 py-2"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="border rounded px-3 py-2"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
        </select>
        <button
          onClick={() => setModalOpen(true)}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          Create Task
        </button>
      </div>

      {/* Task Table */}
      <div className="bg-white rounded-lg shadow">
        <table className="w-full">
          <thead className="bg-purple-600 text-white">
            <tr>
              <th className="px-4 py-2 text-left">#</th>
              <th className="px-4 py-2 text-left">Title</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-4 text-center text-gray-500">
                  No tasks found.
                </td>
              </tr>
            ) : (
              filtered.map((task, index) => (
                <tr key={task._id} className="hover:bg-gray-50">
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">{task.title}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        task.completed
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {task.completed ? "Completed" : "Pending"}
                    </span>
                  </td>
                  <td ref={dropdownRef} className="px-4 py-2 relative">
                    <button
                      onClick={() =>
                        setOptionsTaskId(optionsTaskId === task._id ? null : task._id)
                      }
                      className="px-2 hover:bg-gray-200 rounded"
                    >
                      ⋮
                    </button>
                    {optionsTaskId === task._id && (
                      <div className="absolute right-0 mt-1 bg-white border rounded shadow z-10">
                        <button
                          onClick={() => toggleComplete(task._id, task.completed)}
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                        >
                          {task.completed ? "Undo" : "Mark Completed"}
                        </button>
                        <button
                          onClick={() => handleDelete(task._id)}
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Create Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md space-y-4">
            <h2 className="text-xl font-semibold">Create Task</h2>
            <input
              type="text"
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full border rounded px-3 py-2"
            />
            <textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full border rounded px-3 py-2"
            />
            <div className="flex gap-4">
              <input
                type="date"
                value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                className="flex-1 border rounded px-3 py-2"
              />
              <select
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
                className="border rounded px-3 py-2"
              >
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}