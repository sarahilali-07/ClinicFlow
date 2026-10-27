# ClinicFlow Backend API (PERN Stack)

Backend RESTful API for **ClinicFlow — Patient & Appointment Management System**, built with Node.js, Express.js, PostgreSQL, and ES Modules, strictly adhering to clean Layered 3-Tier Class-Based Architecture.

---

## 🛠️ Tech Stack & Architecture

* **Runtime:** Node.js (ES Modules, `"type": "module"`)
* **Framework:** Express.js 5
* **Database:** PostgreSQL (with connection pooling via `pg`)
* **Authentication:** JWT (JSON Web Tokens) & Password Hashing via `bcryptjs`
* **Validation:** Schema validation via `joi`
* **Architecture:** Class-based OOP with separation of concerns:
  `Routes -> Controllers -> Services -> Repositories/Models -> PostgreSQL`

---

## 🚀 Getting Started

### 1. Prerequisites
* Node.js (v18+)
* PostgreSQL (v14+) running on `localhost:5432`

### 2. Environment Variables Configuration
Copy `.env.example` to `.env` and adjust the variables if needed:
```bash
cp .env.example .env
```

Default variables:
```env
PORT=5000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/clinicflow
JWT_SECRET=c11n1cf10w_s3cur3_jwt_k3y_9876543210abcdef
JWT_EXPIRES_IN=1d
CLIENT_URL=http://localhost:5173
```

### 3. Database Initialization
Ensure PostgreSQL is active and create the database `clinicflow`:
```sql
CREATE DATABASE clinicflow;
```

Run the SQL schema definition:
```bash
psql -U postgres -d clinicflow -f src/config/schema.sql
```

### 4. Install Dependencies & Seed Data
```bash
npm install
npm run seed
```

This populates the exact dataset required by the test cahier des charges:
* **1 Admin:** `admin@clinicflow.com` (Password: `Admin123456!`)
* **2 Staff:** `staff1@clinicflow.com` & `staff2@clinicflow.com` (Password: `Staff123456!`)
* **5 Patients:** With unique CIN, phones, and addresses
* **10 Appointments:** Mix of `pending`, `confirmed`, and `cancelled`

### 5. Run the Automated Test Suite
```bash
npm test
```
Executes all 20 end-to-end integration tests verifying every endpoint, RBAC permission, and the 30-minute collision business rule.

### 6. Start the Development Server
```bash
npm run dev
```
The server will start on `http://localhost:5000`.

---

## 📡 API Endpoints

### 🔐 Authentication (`/api/auth`)
* `POST /api/auth/login` - Public: Login with email and password, returns JWT token and user profile.
* `GET /api/auth/me` - Protected: Returns currently authenticated user from JWT token.
* `POST /api/auth/register` - Protected / Admin: Register new staff/admin.

### 👤 Patient Management (`/api/patients`)
* `GET /api/patients?search=&page=&limit=` - Protected: Paginated patient list with search by `fullName` or `CIN`.
* `GET /api/patients/:id` - Protected: Get patient details including their appointment history.
* `POST /api/patients` - Protected: Register a new patient (unique CIN enforced).
* `PUT /api/patients/:id` - Protected: Update patient details.
* `DELETE /api/patients/:id` - **Admin Only**: Soft-delete a patient (`deleted_at`).

### 📅 Appointment Management (`/api/appointments`)
* `GET /api/appointments?date=&status=` - Protected: List appointments with date and status filters.
* `GET /api/appointments/:id` - Protected: Get appointment details.
* `POST /api/appointments` - Protected: Book an appointment. Enforces the **30-minute conflict rule**.
* `PATCH /api/appointments/:id/status` - Protected: Update appointment status (`pending`, `confirmed`, `cancelled`).

> **Critical Business Rule:** A patient cannot have 2 confirmed appointments within a 30-minute window of each other. Attempting this returns `409 Conflict`.

### 📊 Dashboard & KPI Statistics (`/api/dashboard`)
* `GET /api/dashboard/stats` - Protected:
  * Total active patients
  * Appointments scheduled for today
  * Count of pending appointments
  * Count of confirmed appointments
