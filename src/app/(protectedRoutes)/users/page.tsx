"use client";

import { useState } from "react";

export default function UserListPage() {
  // Static user data
  const initialUsers = [
    { id: 1, name: "Alice Johnson" },
    { id: 2, name: "Bob Smith" },
    { id: 3, name: "Charlie Davis" },
  ];

  // Local state
  const [users, setUsers] = useState(initialUsers);

  // Delete handler
  const handleDelete = (id: number) => {
    setUsers((prev) => prev.filter((user) => user.id !== id));
  };

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-md p-6 max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4">👥 User List</h2>

        {users.length === 0 ? (
          <p className="text-gray-500 text-sm text-center">No users found.</p>
        ) : (
          <ul className="space-y-3">
            {users.map((user) => (
              <li
                key={user.id}
                className="flex justify-between items-center bg-gray-100 px-4 py-2 rounded-lg"
              >
                <span className="text-gray-800">{user.name}</span>
                <button
                  onClick={() => handleDelete(user.id)}
                  className="text-red-500 text-sm hover:text-red-700 transition-colors"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}