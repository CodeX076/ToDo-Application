import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Navbar from "./Navbar";
import "./Dashboard.css";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  // Load tasks on page load
  useEffect(() => {
    fetchTasks();
  }, []);

  // Fetch tasks from backend
  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("https://todo-backend-735k.onrender.com/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data);
    } catch (err) {
      console.error("Error fetching tasks:", err.response?.data || err.message);
    }
  };

  // Add task
  const addTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "https://todo-backend-735k.onrender.com/tasks",
        { title: newTask },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Backend only sends { msg, id } → build full object manually
      setTasks((prev) => [
        { id: res.data.id, title: newTask, status: 0 },
        ...prev,
      ]);

      setNewTask(""); // Clear input field
    } catch (err) {
      console.error("Error adding task:", err.response?.data || err.message);
    }
  };

  // Toggle task complete/incomplete
  const toggleComplete = async (taskId, status) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `https://todo-backend-735k.onrender.com/tasks/${taskId}`,
        { completed: status === 0 }, // toggle between 0 and 1
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchTasks();
    } catch (err) {
      console.error("Error updating task:", err.response?.data || err.message);
    }
  };

  // Delete task
  const deleteTask = async (taskId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`https://todo-backend-735k.onrender.com/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTasks();
    } catch (err) {
      console.error("Error deleting task:", err.response?.data || err.message);
    }
  };

  return (
    <div className="dashboard-wrapper">
      <Navbar />
      <div className="dashboard-container">
        <motion.div
          className="dashboard-card"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: "spring" }}
        >
          <h2 className="dashboard-title">Your Tasks</h2>
          <form onSubmit={addTask} className="task-form">
            <input
              type="text"
              placeholder="Add a new task..."
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              className="task-input"
            />
            <button type="submit" className="add-btn">
              Add
            </button>
          </form>

          {/* Task List without Drag & Drop */}
          <div className="task-list">
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <motion.div
                  key={task.id}
                  className={`task-item ${task.status === 1 ? "completed" : ""}`}
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                >
                  <input
                    type="checkbox"
                    checked={task.status === 1}
                    onChange={() => toggleComplete(task.id, task.status)}
                    className="task-checkbox"
                  />
                  <span className={task.status === 1 ? "completed-task" : ""}>
                    {task.title}
                  </span>
                  <button
                    className="delete-btn"
                    onClick={() => deleteTask(task.id)}
                  >
                    ❌
                  </button>
                </motion.div>
              ))
            ) : (
              <p style={{ textAlign: "center", color: "gray" }}>No tasks yet</p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Dashboard;
