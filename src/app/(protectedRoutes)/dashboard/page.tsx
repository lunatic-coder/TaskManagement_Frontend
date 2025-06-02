"use client";

import { useState } from "react";

// Custom ID generator
let idCounter = 0;
const generateId = () => ++idCounter;

type Task = { id: number; text: string };

export default function TaskManagerPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [input, setInput] = useState("");
  const [editId, setEditId] = useState<number | null>(null);

  const handleAddTask = () => {
    if (!input.trim()) return;
    if (editId) {
      // Update existing task
      setTasks(prev =>
        prev.map(task =>
          task.id === editId ? { ...task, text: input } : task
        )
      );
      setEditId(null);
    } else {
      // Add new task with custom ID
      setTasks(prev => [...prev, { id: generateId(), text: input }]);
    }
    setInput("");
  };

interface HandleEdit {
    (id: number): void;
}

const handleEdit: HandleEdit = (id) => {
    const task = tasks.find((t) => t.id === id);
    if (task) {
        setInput(task.text);
        setEditId(id);
    }
};

interface HandleDelete {
    (id: number): void;
}

const handleDelete: HandleDelete = (id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-6">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">📝 Task Manager</h1>

        <div className="flex flex-col sm:flex-row gap-2 mb-6">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Enter a new task..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
          <button
            onClick={handleAddTask}
            className={`${
              editId ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"
            } text-white px-5 py-2 rounded-xl font-medium transition-colors`}
          >
            {editId ? "Update Task" : "Add Task"}
          </button>
        </div>

        {tasks.length === 0 ? (
          <p className="text-gray-500 text-center py-6 bg-gray-50 rounded-xl">
            No tasks yet. Add one above!
          </p>
        ) : (
          <ul className="space-y-3">
            {tasks.map(task => (
              <li
                key={task.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between bg-gray-50 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <span className="text-gray-800 font-medium">{task.text}</span>
                <div className="flex gap-3 mt-2 sm:mt-0">
                  <button
                    onClick={() => handleEdit(task.id)}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="text-sm text-red-600 hover:text-red-800 font-medium transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}