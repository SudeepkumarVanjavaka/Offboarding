# BlazeUp HROS - Employee Offboarding

BlazeUp HROS is a full-stack employee offboarding application. It helps HR teams initiate an employee exit, track department clearances, review workflow progress, inspect the audit history, and access exit-document templates from one interface.

## Features

- HR dashboard with active offboarding cases and current status
- Employee selection with employee information preview
- Offboarding initiation with resignation date, last working day, and exit notes
- Automatic creation of clearance stages for each new offboarding case
- Department clearance approvals with remarks and approver information
- Automatic workflow status updates:
  - `In Progress` while stages are pending
  - `Rejected` when any stage is rejected
  - `Completed` when every stage is approved
- Audit and activity history for case and clearance actions
- Configurable workflow display
- Exit-document templates, including:
  - Resignation Acceptance Letter
  - No Objection Certificate (NOC) and Clearance
  - Relieving Letter
  - To Whomsoever It May Concern
- Seed data for initial employees and the standard offboarding workflow

## Tech Stack

### Frontend

- React 19
- Vite
- JavaScript and JSX
- Browser History API for lightweight client-side navigation

### Backend

- Node.js
- Express 5
- MongoDB with Mongoose
- CORS
- dotenv

## Project Structure

```text
offboarding/
├── backend/
│   ├── controllers/       # Employee, offboarding, clearance, and workflow handlers
│   ├── models/            # Mongoose schemas
│   ├── services/          # Workflow-related services
│   ├── app.js             # Express app and API routes
│   ├── server.js          # MongoDB connection and server startup
│   ├── seed.js            # Initial employee and workflow data
│   └── package.json
├── frontend/
│   ├── components/        # Shared UI components
│   ├── pages/             # Dashboard and feature pages
│   ├── src/
│   │   ├── api.js         # Frontend API client
│   │   ├── app.jsx        # Client-side route selection
│   │   └── app.css        # Application styles
│   └── package.json
└── README.md
```

## Prerequisites

- Node.js 18 or later
- npm
- A running MongoDB instance or MongoDB Atlas database

## Configuration

Create `backend/.env`:

```env
MONGO_URI=mongodb://127.0.0.1:27017/offboarding
PORT=5000
```

The frontend defaults to `http://localhost:5000`. To use a different backend URL, create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000
```

Do not commit `.env` files or database credentials.

## Installation

Install dependencies in both applications:

```bash
cd backend
npm install

cd ../frontend
npm install
```

## Running Locally

Start the backend first:

```bash
cd backend
npm start
```

The API will be available at [http://localhost:5000](http://localhost:5000). On startup, the backend connects to MongoDB and seeds the initial employees and standard workflow when those collections are empty.

In a second terminal, start the frontend:

```bash
cd frontend
npm run dev
```

Open the Vite URL shown in the terminal, normally [http://localhost:5173](http://localhost:5173).

## Production Build

Build the frontend:

```bash
cd frontend
npm run build
```

Preview the built frontend locally:

```bash
npm run preview
```

Validate the backend JavaScript:

```bash
cd backend
npm run build
```

The current backend does not serve the frontend build, so deploy the frontend and backend as separate services or configure a reverse proxy for them.

## Application Routes

| Route | Purpose |
| --- | --- |
| `/` | HR dashboard |
| `/start` | Initiate an offboarding case |
| `/details?id=<case-id>` | View case details, clearances, and audit history |
| `/clearance?id=<case-id>` | Review and update clearance approvals |
| `/workflow` | View the configured workflow |
| `/documents?id=<case-id>` | View exit-document templates |

## API Reference

All API endpoints are served by the backend base URL, normally `http://localhost:5000`.

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/` | API health response |
| `GET` | `/employees` | List employees |
| `POST` | `/employees` | Create an employee |
| `GET` | `/offboarding` | List offboarding cases with employee and clearance data |
| `POST` | `/offboarding` | Create an offboarding case and its clearance stages |
| `GET` | `/offboarding/:id` | Get a case by MongoDB ID or employee ID |
| `GET` | `/workflow` | List workflows |
| `POST` | `/workflow` | Create a workflow |
| `GET` | `/clearance` | List clearances; optionally filter with `?offboardingId=<id>` |
| `POST` | `/clearance` | Create a clearance record |
| `PATCH` | `/clearance/:id` | Update clearance status, remarks, and approver |

### Start an Offboarding Case

Example request:

```json
{
  "employeeId": "EMP001",
  "resignationDate": "2026-09-01",
  "lastWorkingDay": "2026-09-30",
  "reason": "Career progression"
}
```

Creating a case also creates one clearance record for every configured workflow stage and records an initial audit entry.

### Update a Clearance

Example request:

```json
{
  "status": "Approved",
  "remarks": "Assets returned and access reviewed",
  "approvedBy": "Department Lead"
}
```

Supported statuses used by the application are `Pending`, `Approved`, and `Rejected`.

## Default Workflow

When the database is empty, the application creates the following sequential workflow:

1. Project / Reporting Manager
2. Admin & Systems
3. Accounts
4. Personnel
5. HR

## Development Notes

- The frontend uses the Browser History API rather than a router package.
- The frontend API base URL is controlled by `VITE_API_URL`.
- CORS is enabled by the backend for local frontend development.
- The backend currently exposes no authentication or authorization layer. Add authentication and role-based authorization before using the application with production employee data.
- There are currently no automated tests configured in `backend/package.json`.

## License

This project currently uses the ISC license declaration in the backend package manifest.
