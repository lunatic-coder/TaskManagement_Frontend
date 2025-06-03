# 🎯 Task Management Frontend (Next.js 15 + TypeScript)

This is the **frontend** for the Task Management System built with **Next.js App Router**, **TypeScript**, **Tailwind CSS**, and **Fetch**. It connects to a Node.js + Express + MongoDB backend API.

---


## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev



## ⚙️ Tech Stack

- **Next.js 15+** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Fetch** for API communication
- **JWT Authentication**
- **React Hook Form** for form handling
- **Zod** (optional) for schema validation
- **Reusable Components** and API abstraction

---

## ✅ Features

### 🔐 Authentication
- Signup & Login with JWT token
- Auth token stored in local/session storage
- Authenticated route protection
-

### 📋 Task Management
- Fetch and display tasks for authenticated users
- Create, update, and delete tasks
- Admin can view all users’ tasks
- Conditional API calls based on user ID or role

### 👥 User Management (Admin)
- View list of users
- Fetch tasks for specific user
- Role-based UI rendering

### 🧠 Smart API Handling
- Fetch abstraction (`sendRequest`)
- Auto handles headers (e.g., Authorization)
- Graceful error handling and UI feedback

---



