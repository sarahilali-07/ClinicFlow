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

Clone the repository:

```bash
git clone https://github.com/sarahilali-07/ClinicFlow.git
cd ClinicFlow
```

Install backend dependencies:

```bash
cd backend
npm install
```

Configure your backend environment variables using `backend/.env.example`.

Install frontend dependencies in a separate terminal:

```bash
cd frontend
npm install
```

Configure the frontend environment using `frontend/.env.example`, then start the backend and frontend using their available npm scripts.

## 🔒 Security

- Environment variables and credentials should never be committed.
- Authentication and role-based permissions protect restricted operations.
- Production deployments should use secure database credentials and a strong JWT secret.

---

<p align="center">
  Built with 💙 using the PERN Stack
</p>
