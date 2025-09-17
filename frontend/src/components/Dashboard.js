import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Navbar from "./Navbar";
import "./Dashboard.css";
export const BASE_URL = "https://todo-backend-735k.onrender.com";


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
      const res = await axios.get(`${BASE_URL}/tasks`, {
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
        `${BASE_URL}/tasks`,
        { title: newTask },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Backend only sends { msg, id } → build full object manually
      setTasks((prev) => [res.data, ...prev]);  

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
        `${BASE_URL}/tasks/${taskId}`,
        { status: !status }, 
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
      await axios.delete(`${BASE_URL}/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTasks();
    } catch (err) {
      console.error("Error deleting task:", err.response?.data || err.message);
    }
  };

  return (
          <div
        className="dashboard-wrapper"
        style={{
          backgroundImage: 'url("https://source.unsplash.com/1600x900/?office,workspace,productivity")',
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >

      <Navbar />
      <div className="dashboard-container">
        <motion.div
          className="dashboard-card"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: "spring" }}
        >
          <h2 className="dashboard-title">📋 Your Tasks</h2>
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
                  key={task._id}
                  className={`task-item ${task.status ? "completed" : ""}`}
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                >
                  <input
                    type="checkbox"
                    checked={task.status}
                    onChange={() => toggleComplete(task._id, task.status)}
                    className="task-checkbox"
                  />
                  <span className={task.status ? "completed-task" : ""}>
                    {task.title}
                  </span>
                  <button
                    className="delete-btn"
                    onClick={() => deleteTask(task._id)}
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
