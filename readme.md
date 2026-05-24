# DevPulse API

A role-based Issue Tracking REST API built with Node.js, TypeScript, Express, and PostgreSQL.

DevPulse allows contributors to report bugs or feature requests while maintainers can manage and moderate all issues through secure JWT-based authentication and authorization.

---

# Live URL

Production API:

https://devpulse-gilt.vercel.app/

---

# Features

- User registration and login
- JWT authentication and authorization
- Role-based access control
- Contributor and Maintainer roles
- Create bug reports and feature requests
- Update and delete issues with permission control
- Filter and sort issues
- PostgreSQL integration using native `pg`
- Raw SQL queries only (No ORM / No Query Builder)
- Request validation using Zod
- Secure password hashing using bcrypt
- Modular Express architecture
- Centralized error handling

---

# Tech Stack

| Technology | Purpose |
|---|---|
| Node.js | Runtime environment |
| TypeScript | Type safety |
| Express.js | REST API framework |
| PostgreSQL | Relational database |
| pg | Native PostgreSQL driver |
| JWT | Authentication |
| bcrypt | Password hashing |
| Zod | Request validation |
| tsup | TypeScript build tool |
| tsx | Development runtime |

---

# Project Structure

```bash
src/
│
├── app.ts
├── server.ts
│
├── config/
│   ├── db.ts
│   └── env.ts
│
├── modules/
│   ├── auth/
│   └── issues/
│
├── middleware/
│
├── utils/
│
└── database/
    └── schema.sql




Installation & Setup
1. Clone Repository
```git clone https://github.com/your-username/devpulse.git
cd devpulse```

2. Install Dependencies
```npm install

3. Configure Environment Variables

Create a .env file in the project root:

PORT=5000

DATABASE_URL=your_neon_postgresql_connection_string

JWT_SECRET=your_secret_key

SALT_ROUNDS=10

4. Create Database Tables

Run the following SQL inside Neon SQL Editor or PostgreSQL:

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'contributor',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE issues (
    id SERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    type VARCHAR(30) NOT NULL,
    status VARCHAR(30) DEFAULT 'open',
    reporter_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

5. Run Development Server
```npm run dev```

6. Build Project
```npm run build```

7. Start Production Server
```npm start```



User Roles
Role	Permissions
contributor	Create and view issues
maintainer	Full issue management access
API Endpoints
Authentication Routes
Register User
POST /api/auth/signup
Login User
POST /api/auth/login
Issue Routes
Create Issue
POST /api/issues

Access: Authenticated Users

Get All Issues
GET /api/issues

Query Parameters:

Param	Values
sort	newest, oldest
type	bug, feature_request
status	open, in_progress, resolved

Example:

GET /api/issues?sort=newest&type=bug
Get Single Issue
GET /api/issues/:id

Example:

GET /api/issues/1
Update Issue
PATCH /api/issues/:id

Access Rules:

Maintainer can update any issue
Contributor can update own issue only when status is open
Delete Issue
DELETE /api/issues/:id

Access: Maintainer Only

- Database Schema Summary
users Table
Field	Type
id	SERIAL PRIMARY KEY
name	VARCHAR(100)
email	VARCHAR(255) UNIQUE
password	TEXT
role	VARCHAR(20)
created_at	TIMESTAMP
updated_at	TIMESTAMP
issues Table
Field	Type
id	SERIAL PRIMARY KEY
title	VARCHAR(150)
description	TEXT
type	VARCHAR(30)
status	VARCHAR(30)
reporter_id	INT
created_at	TIMESTAMP
updated_at	TIMESTAMP
Security Features
Passwords hashed with bcrypt
JWT token verification
Role-based route protection
Request validation with Zod
Protected endpoints for authenticated users only
Important Constraints
No ORM used
No query builder used
No SQL JOIN used
Raw pool.query() only
Native PostgreSQL driver (pg) only
Example API Response
Success Response
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
Error Response
{
  "success": false,
  "message": "Error message",
  "errors": {}
}