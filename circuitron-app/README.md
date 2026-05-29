# Circuitron Bootcamp Platform

Welcome to the **Circuitron Bootcamp Platform**! This application was built to provide a structured, gamified learning experience for students while offering a robust Content Management System (CMS) for administrators.

The project is built using modern web technologies:
- **Next.js 14 (App Router)** for the frontend framework.
- **Convex** for the real-time database and backend logic.
- **@convex-dev/auth** for secure, role-based authentication.
- **TailwindCSS & Framer Motion** for beautiful, animated UI/UX.

---

## 👥 User Roles & Capabilities

The platform operates on a strict Role-Based Access Control (RBAC) system.

### 1. Student (`student`)
The default role assigned upon signup.
- **Dashboard (`/dashboard`)**: A gamified command center tracking Streaks, Tasks Completed, and Watch Time. Features a real-time Leaderboard.
- **Roadmap (`/dashboard/days`)**: The central curriculum tree showing unlocked Weeks and Days.
- **Learning Interface (`/dashboard/days/[dayId]`)**: The module where students watch embedded YouTube videos, read Markdown task requirements, and submit their work.
- **Quiz Engine (`/dashboard/days/[dayId]/quiz`)**: An interactive Multiple Choice Quiz that must be passed to proceed.

### 2. Volunteer / Mentor (`volunteer`)
A helper role designed to assist admins in grading.
- **Permissions**: They have the same backend permissions as Admins to grade student submissions (`Approve` or `Needs Revision`).
- *(Note: To grade submissions, volunteers currently utilize backend API routes or custom UI components, as the main Admin Portal is strictly locked to Admins to prevent curriculum tampering).*

### 3. Administrator (`admin`)
The platform owners who manage curriculum and users.
- **Admin Portal (`/admin`)**: The central hub for platform management.
- **Curriculum Manager (`/admin/content`)**: 
  - Create and manage Bootcamp "Weeks".
  - Create "Days" (learning modules).
  - Use the **DayEditor** to dynamically attach YouTube URLs, write Markdown tasks, and build custom quizzes.
- **User Manager (`/admin/users`)**: 
  - View all registered users.
  - Instantly promote a Student to a Volunteer or Admin with live visual feedback.
- **Review Center (`/admin/submissions`)**: 
  - View all student task submissions.
  - Grade submissions by marking them as **Approved** or **Needs Revision**.

---

## 🏗️ System Architecture

The project strictly separates the Backend (`convex/`) from the Frontend (`src/`).

### Backend (`convex/`)
Handles all database operations securely on the server.
- `schema.ts`: Defines the strict relational schema for Users, Weeks, Days, Progress, and Submissions.
- `auth.ts`: Configures the authentication providers (Email/Password).
- `content.ts`: Mutations for creating and editing the curriculum (Requires Admin).
- `submissions.ts`: Mutations for grading students (Requires Admin or Volunteer).

### Frontend (`src/`)
Handles UI rendering and state.
- `app/admin/`: Protected routes for the Admin CMS.
- `app/dashboard/`: Protected routes for the Student LMS.
- `components/`: Reusable UI components (like the `DayEditor` or `AdminPortalLink`).

---

## 🚀 Getting Started

### 1. Running the Application
To run the platform locally, you need two terminals:

**Terminal 1 (Backend - Convex):**
```bash
npx convex dev
```

**Terminal 2 (Frontend - Next.js):**
```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

### 2. Creating an Admin Account
Because of intense password hashing, you cannot manually inject passwords into the database. To set up your first Admin:
1. Open `http://localhost:3000` and Sign Up with your email (e.g., `admin@circuitevent`).
2. Open your terminal and run the reset helper script to elevate the first created user:
```bash
npx convex run reset:makeAdmin
```
3. Refresh the page! You will now see the **Admin Portal** button in your sidebar.
