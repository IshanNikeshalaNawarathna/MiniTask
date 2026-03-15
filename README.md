# Mini Task Management System
 
A full-stack web application for managing tasks with role-based access control, built with **Next.js** (frontend) and **Spring Boot** (backend).
 
---
 
## Project Overview
 
The Mini Task Management System allows users to register, log in, and manage their tasks securely. It supports two roles:
 
- **ADMIN** – Can view and manage all tasks across the system.
- **USER** – Can only manage their own tasks.
 
### Key Features
 
- JWT-based authentication (register & login)
- Role-based access control (ADMIN / USER)
- Full task CRUD operations
- Task filtering by status and priority
- Mark tasks as completed
- Pagination and sorting (by due date or priority)
- Clean and responsive UI built with Next.js
 
---

## Tech Stack
 
| Layer     | Technology              |
|-----------|-------------------------|
| Frontend  | Next.js, Axios          |
| Backend   | Spring Boot (Java)      |
| Database  | MySQL       |
| Auth      | JWT (JSON Web Tokens)   |
 
---
 
## Database Schema
 
```sql
-- Users table
CREATE TABLE users (
    id          BIGINT PRIMARY KEY AUTO_INCREMENT,
    username    VARCHAR(50)  NOT NULL UNIQUE,
    email       VARCHAR(100) NOT NULL UNIQUE,
    password    VARCHAR(255) NOT NULL,
    role        ENUM('ADMIN', 'USER') NOT NULL DEFAULT 'USER',
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
 
-- Tasks table
CREATE TABLE tasks (
    id          BIGINT PRIMARY KEY AUTO_INCREMENT,
    title       VARCHAR(255) NOT NULL,
    description TEXT,
    status      ENUM('TODO', 'IN_PROGRESS', 'DONE') NOT NULL DEFAULT 'TODO',
    priority    ENUM('LOW', 'MEDIUM', 'HIGH') NOT NULL DEFAULT 'MEDIUM',
    due_date    DATE,
    user_id     BIGINT NOT NULL,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_tasks_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```
