"use client";

import withProtectedRoute from "@/HOCs/withProtectedRoute";
import { useFetcher } from "@/Hooks/useFetcher";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation"; // For App Router

type Task = { _id: string; title: string }; // Updated `id` to `string` to match MongoDB _id format

function TaskManagerPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [input, setInput] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [userTasks, setUserTasks] = useState<{ [userId: string]: Task[] }>({});
  const { loading, error, sendRequest } = useFetcher();
  const searchParams = useSearchParams();

  const userId = searchParams.get("userId"); // Get userId from query params




  const router = useRouter(); // Using Next.js App Router

  const token = JSON.parse(localStorage.getItem("user") || "{}")?.token;
  const userType = JSON.parse(localStorage.getItem("user") || "{}")?.user?.role

  // GET tasks on page load
  useEffect(() => {
    const fetchTasks = async () => {
      const res = await sendRequest({
        url: "http://localhost:3003/api/tasks",
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res?.data) setTasks(res.data);
    };

    fetchTasks();
  }, []);


  useEffect(() => {
    // Fetch tasks for a specific user and for admin which will fetch all tasks related to specific user
  const fetchTasks = async () => {
    try {
      const res = await sendRequest({
        url: userId
          ? `http://localhost:3003/api/users/${userId}/tasks`
          : "http://localhost:3003/api/tasks",
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res?.data) {
        if (userId) {
          const tasks = (res.data as { tasks: Task[] }).tasks;
          setUserTasks((prev) => ({
            ...prev,
            [userId]: tasks,
          }));
        } else {
          setTasks(res.data);
        }
      }
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    }
  };

  fetchTasks();
}, [userId, token]); // token might change, so include it



// Function to handle adding or updating a task
  const handleAddOrUpdateTask = async () => {
    if (!input.trim()) return;

    if (editId) {
      // PUT update
      const updatedTask = await sendRequest({
        url: `http://localhost:3003/api/tasks/${editId}`,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: { title: input }
      });

      if (updatedTask?.data) {
        setTasks(prev =>
          prev.map(task =>
            task._id === editId ? { ...task, text: updatedTask.data.text } : task
          )
        );
        setEditId(null);
        setInput("");
      }
    } else {
      // POST new task
      const newTask = await sendRequest({
        url: "http://localhost:3003/api/tasks",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: { title: input }
      });

      if (newTask?.data) {
        setTasks(prev => [...prev, newTask.data]);
        setInput("");
      }
    }
  };

  // Function to handle editing a task
  const handleEdit = (id: string) => {
    const task = tasks.find(t => t._id === id);
    if (task) {
      setInput(task.title);
      setEditId(id);
    }
  };


  // Function to handle deleting a task
  const handleDelete = async (id: string) => {
    const deleted = await sendRequest({
      url: `http://localhost:3003/api/tasks/${id}`,
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (deleted?.status === 200) {
      setTasks(prev => prev.filter(t => t._id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-6">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">📝 Task Manager</h1>

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800"></h1>
          <button
            onClick={() => router.push("/users")}
            disabled={userType !== "admin"}
            className="text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-xl transition-colors"
          >
            All Users
          </button>
          {userType !== "admin" && (
            <span className="text-xs text-red-500">Only admins can access user list</span>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-2 mb-6">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Enter a new task..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
          <button
            onClick={handleAddOrUpdateTask}
            className={`${editId ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"
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
                key={task._id}
                className="flex flex-col sm:flex-row sm:items-center justify-between bg-gray-50 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <span className="text-gray-800 font-medium">{task.title}</span>
                <div className="flex gap-3 mt-2 sm:mt-0">
                  <button
                    onClick={() => handleEdit(task._id)}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(task._id)}
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

export default withProtectedRoute(TaskManagerPage);
