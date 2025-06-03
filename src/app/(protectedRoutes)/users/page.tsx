"use client";

import withProtectedRoute from "@/HOCs/withProtectedRoute";
import { useFetcher } from "@/Hooks/useFetcher";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


interface User {
  _id: string;
  name: string;
  email: string;
}

interface Task {
  _id: string;
  title: string;
  completed: boolean;
}

function UserListPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [userTasks, setUserTasks] = useState<Record<string, Task[]>>({});
  const { sendRequest, loading, error } = useFetcher();
  const router = useRouter(); // Using Next.js App Router

  const token = JSON.parse(localStorage.getItem("user") || "{}")?.token;

  // Fetch all users on mount
  useEffect(() => {
    if (!token) return;

    const fetchUsers = async () => {
      const result = await sendRequest({
        url: "http://localhost:3003/api/users",
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (result?.data) {
        setUsers(result.data as User[]);
      }
    };

    fetchUsers();
  }, [token]);

  const handleViewTasks = async (userId: string) => {
       router.push("dashboard?userId=" + userId);

        // if (!token) return;




  };

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-md p-6 max-w-xl w-full">
        <h2 className="text-xl font-semibold mb-4">👥 User List</h2>

        {loading && <p className="text-blue-500 text-sm text-center">Loading...</p>}
        {error && <p className="text-red-500 text-sm text-center">{error.message}</p>}

        {users.length === 0 && !loading ? (
          <p className="text-gray-500 text-sm text-center">No users found.</p>
        ) : (
          <ul className="space-y-4">
            {users.map((user) => (
              <li
                key={user._id}
                className="bg-gray-50 px-4 py-3 rounded-lg shadow-sm"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-800 font-semibold">{user.name}</p>
                    <p className="text-gray-500 text-sm">{user.email}</p>
                  </div>
                  <button
                    onClick={() => handleViewTasks(user._id)}
                    className="text-blue-600 text-sm hover:underline"
                  >
                    {userTasks[user._id] ? "Hide Tasks" : "View Tasks"}
                  </button>
                </div>

                {userTasks[user._id] && (
                  <ul className="mt-3 space-y-2">
                    {userTasks[user._id].map((task) => (
                      <li
                        key={task._id}
                        className="text-sm px-3 py-2 bg-white border rounded-lg"
                      >
                        ✅ {task.title}{" "}
                        {task.completed ? (
                          <span className="text-green-600 font-medium">(Done)</span>
                        ) : (
                          <span className="text-yellow-600 font-medium">(Pending)</span>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}

export default withProtectedRoute(UserListPage);
