import React, { useState, useEffect } from "react";
import axios from "axios";

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  // Fetch tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get("http://localhost:3001/tasks");
      setTasks(res.data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  const addTask = async () => {
    if (!newTask.trim()) return;
    try {
      const res = await axios.post("http://localhost:3001/tasks", {
        text: newTask,
      });
      setTasks([...tasks, res.data]);
      setNewTask("");
    } catch (err) {
      console.error("Error adding task:", err);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/tasks/${id}`);
      setTasks(tasks.filter((task) => task._id !== id));
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  return (
    <div style={styles.container}>
      <h2>📋 Task Manager</h2>

      {/* Add Task */}
      <div style={styles.addSection}>
        <input
          type="text"
          placeholder="Enter new task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          style={styles.input}
        />
        <button onClick={addTask} style={styles.button}>
          Add Task
        </button>
      </div>

      {/* Task List */}
      <ul style={styles.list}>
        {tasks.map((task) => (
          <li key={task.id} style={styles.listItem}>
            <span>{task.text}</span>
            <button
              onClick={() => deleteTask(task._id)}
              style={styles.deleteButton}
            >
              ❌ Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

// Inline styles for simplicity
const styles = {
  container: { maxWidth: "500px", margin: "auto", padding: "20px" },
  addSection: { display: "flex", gap: "10px", marginBottom: "20px" },
  input: { flex: 1, padding: "8px" },
  button: { padding: "8px 12px", background: "green", color: "white" },
  list: { listStyle: "none", padding: 0 },
  listItem: {
    display: "flex",
    justifyContent: "space-between",
    padding: "8px",
    borderBottom: "1px solid #ccc",
  },
  deleteButton: { background: "red", color: "white", border: "none" },
};

export default TaskManager;
