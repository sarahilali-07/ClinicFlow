# 🏥 ClinicFlow

<p align="center">
  <strong>A Smart Clinic Management System</strong>
  <br />
  Simplifying patient records and appointment management.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js" />
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
</p>

---

## ✨ About the Project

**ClinicFlow** is a full-stack web application designed to simplify daily clinic operations. It provides an organized way to manage patient information, schedule medical appointments, and monitor clinic activity through a centralized dashboard.

Built with the **PERN stack** (PostgreSQL, Express.js, React.js, and Node.js), the application focuses on usability, secure access, and efficient data management.

## 🚀 Key Features

- 🔐 **Authentication & Authorization** — JWT-based authentication with role-based access for administrators and staff.
- 🧑‍⚕️ **Patient Management** — Create, view, update, search, and manage patient records.
- 📅 **Appointment Management** — Schedule appointments, filter records, and update appointment statuses.
- 🛡️ **Conflict Prevention** — Validate appointment scheduling to prevent conflicting confirmed appointments.
- 📊 **Dashboard** — View key statistics about patients and appointments.
- ⚙️ **REST API** — Structured backend endpoints with validation and error handling.

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React.js, Redux Toolkit |
| Backend | Node.js, Express.js |
| Database | PostgreSQL |
| Authentication | JWT |
| API | REST API |

## 📁 Project Structure

```text
ClinicFlow/
├── backend/     # Express API and database logic
├── frontend/    # React application
├── .gitignore
└── README.md
```

## 💻 Getting Started

### Prerequisites

- Node.js and npm
- PostgreSQL

### Installation

From the project root, install each application's dependencies in its own folder:

```powershell
Set-Location .\backend
npm install
```

```powershell
Set-Location .\frontend
npm install
```

Configure `backend/.env` from `backend/.env.example` and `frontend/.env` from
`frontend/.env.example`. The backend variables are `PORT`, `DATABASE_URL`,
`JWT_SECRET`, `JWT_EXPIRES_IN`, and `CLIENT_URL`. The frontend variable is
`VITE_BACKEND_URL`. Set `DATABASE_URL` to the PostgreSQL instance you intend to
use, and use a strong private value for `JWT_SECRET`; do not commit either
`.env` file.

Create the database if it does not already exist, then apply the schema from the
project root:

```powershell
psql -U postgres -c "CREATE DATABASE clinicflow;"
psql -U postgres -d clinicflow -f backend/src/config/schema.sql
```

If `clinicflow` already exists, skip the `CREATE DATABASE` command. The schema
uses `CREATE TABLE IF NOT EXISTS`, so applying it does not clear existing
records.

To populate the sample users, patients, and appointments, run this from the
`backend` folder:

```powershell
npm run seed
```

**Warning:** the seed script deletes all rows from `appointments`, `patients`,
and `users` before inserting its sample data. Do not run it against a database
whose existing data must be preserved.

Start the applications in separate terminals:

```powershell
Set-Location C:\Users\user\Desktop\project\clinic-management\backend
npm run dev
```

```powershell
Set-Location C:\Users\user\Desktop\project\clinic-management\frontend
npm run dev
```

The backend defaults to `http://localhost:5000`; Vite prints the frontend URL
when it starts. For the database entities and relationship rules, see
[Database design](./DATABASE.md).

## 🔒 Security

- Environment variables and credentials should never be committed.
- Authentication and role-based permissions protect restricted operations.
- Production deployments should use secure database credentials and a strong JWT secret.

---

<p align="center">
  Built with 💙 using the PERN Stack
</p>
