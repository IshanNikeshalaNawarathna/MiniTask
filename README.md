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
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50)
);

-- Tasks table
CREATE TABLE tasks (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50),
    priority VARCHAR(50),
    due_date DATE,
    created_at DATETIME,
    updated_at DATETIME,
    user_id BIGINT,
    
    CONSTRAINT fk_task_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
);
```

## Project Structure
```

mini-task-management/
├── mini-task/                             # Next.js application
│   ├── components/                       # Reusable UI components
│   ├── pages/                            # Next.js pages (login, register, tasks)
│   ├── services/                         # Axios API service calls
│   ├── context/                          # Auth state management
│   ├── .env.local.example                # Frontend environment variable template
│   └── package.json
│
├── task_backend/                              # Spring Boot application
│   └── src/main/java/lk/mini/task_backend/
│       │
│       ├── data/                         # Data layer
│       │   ├── adapter/                  # Repository implementations
│       │   │   ├── AuthRepositoryImpl
│       │   │   ├── DataInitializer
│       │   │   ├── TaskRepositoryImpl
│       │   │   └── UserRepositoryImpl
│       │   ├── config/
│       │   │   └── SecurityConfig
│       │   ├── entity/                   # JPA entities
│       │   │   ├── Task
│       │   │   └── User
│       │   ├── mapper/                   # Entity ↔ Model mappers
│       │   │   ├── TaskJpaMapper
│       │   │   └── UserJpaMapper
│       │   ├── repository/               # Spring Data JPA interfaces
│       │   │   ├── TaskJpa
│       │   │   └── UserJpa
│       │   └── security/                 # JWT & Spring Security
│       │       ├── CustomUserDetailsService
│       │       ├── JwtFilter
│       │       └── JwtService
│       │
│       ├── domain/                       # Domain / Business layer
│       │   ├── enums/
│       │   │   ├── Priority
│       │   │   ├── Role
│       │   │   └── Status
│       │   ├── model/                    # Domain models
│       │   │   ├── TaskModel
│       │   │   └── UserModel
│       │   ├── repository/               # Repository interfaces (ports)
│       │   │   ├── AuthRepository
│       │   │   ├── TaskRepository
│       │   │   └── UserRepository
│       │   └── usecase/                  # Use case interfaces
│       │       ├── task/
│       │       │   ├── FindAllUsersUseCase
│       │       │   ├── TaskDeleteUseCase
│       │       │   ├── TaskSaveUseCase
│       │       │   ├── TaskUpdateStatusUseCase
│       │       │   └── TaskUpdateUseCase
│       │       └── user/
│       │           ├── AuthenticateUseCase
│       │           └── RegisterUseCase
│       │
│       ├── presentation/                 # Presentation layer
│       │   ├── controller/
│       │   │   ├── TaskController
│       │   │   └── UserController
│       │   ├── dto/
│       │   │   ├── error/
│       │   │   │   └── ErrorResponse
│       │   │   ├── task/
│       │   │   │   ├── PageResponse
│       │   │   │   ├── TaskRequest
│       │   │   │   └── TaskResponse
│       │   │   └── user/
│       │   │       ├── AuthRequest
│       │   │       ├── AuthResponse
│       │   │       └── UserRequest
│       │   ├── error/
│       │   │   └── ErrorHandle               # Global exception handler
│       │   └── mapper/                       # DTO ↔ Model mappers
│       │       ├── TaskDtoMapper
│       │       └── UserDtoMapper
│       │
│       ├── TaskBackendApplication            # Spring Boot entry point
│       └── resources/
│           └── application.yaml
│
│
└── README.md
```

## Setup Instructions
 
### Prerequisites
 
- **Java** 21+
- **Node.js** 18+ and npm
- **MySQL** installed and running
- **Maven** 3.8+
 
---
 
### 1. Database Configuration
 
1. Create a new database:
   ```sql
   CREATE DATABASE taskdb;
   ```
---
 
### 2. Backend Setup
 
1. Navigate to the backend directory:
   ```bash
   cd task_backend
   ```
 
2. Fill in the required values in `application.yaml`:
   ```yaml
   server:
     port: 8080
   spring:
     application:
       name: task_backend
     datasource:
       url: jdbc:mysql://localhost:3306/taskdb?createDatabaseIfNotExist=true
       username: ${MYSQL_USER}
       password: ${MYSQL_PASSWORD}
       driver-class-name: com.mysql.cj.jdbc.Driver
     jpa:
       hibernate:
         ddl-auto: update
       show-sql: true
       database-platform: org.hibernate.dialect.MySQLDialect

   ```
 
3. Build and run the backend:
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```
 
   The backend will start on **http://localhost:8080**
 
---

 
### 3. Frontend Setup
 
1. Navigate to the frontend directory:
   ```bash
   cd mini-tasks
   ```
 
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
 
   The frontend will start on **http://localhost:3000**
 
---

## API Documentation
 
> **Base URL:** `http://localhost:8080/api/v1`
 
All protected endpoints require a JWT token in the request header:
```
Authorization: Bearer <your_token>
```
 
---
 
### Authentication — `/api/v1/user`
 
---
 
#### POST `/api/v1/user` — Register a new user
 
**Access:** Public  
**Request Body:**
```json
{
  "username": "john_doe",
  "password": "secret123"
}
```
 
**Response:** `201 Created` — No body returned.
 
**Error Responses:**
 
| Status | Reason                        |
|--------|-------------------------------|
| `400`  | Missing or invalid fields     |
| `409`  | Username already exists       |
 
---
 
#### POST `/api/v1/user/auth` — Login and receive JWT token
 
**Access:** Public  
**Request Body:**
```json
{
  "username": "john_doe",
  "password": "secret123"
}
```
 
**Response:** `200 OK`
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "type": "Bearer",
  "username": "john_doe",
  "role": "USER"
}
```
 
**Error Responses:**
 
| Status | Reason                        |
|--------|-------------------------------|
| `401`  | Invalid username or password  |
 
---
 
### Tasks — `/api/v1/task`
 
---
 
#### POST `/api/v1/task` — Create a new task
 
**Access:** `ADMIN` only  
**Headers:** `Authorization: Bearer <token>`  
**Request Body:**
```json
{
  "title": "Fix login bug",
  "description": "The login page throws a 500 error on wrong password",
  "status": "TODO",
  "priority": "HIGH",
  "dueDate": "2025-08-01"
}
```
 
**Allowed values:**
- `status`: `TODO` | `IN_PROGRESS` | `DONE`
- `priority`: `LOW` | `MEDIUM` | `HIGH`
 
**Response:** `201 Created`
```json
{
  "id": 1,
  "title": "Fix login bug",
  "description": "The login page throws a 500 error on wrong password",
  "status": "TODO",
  "priority": "HIGH",
  "dueDate": "2025-08-01",
  "createdAt": "2025-07-20T10:00:00",
  "updatedAt": "2025-07-20T10:00:00"
}
```
 
**Error Responses:**
 
| Status | Reason                        |
|--------|-------------------------------|
| `400`  | Validation failed             |
| `401`  | Unauthorized                  |
| `403`  | Forbidden (not ADMIN)         |
 
---
 
#### POST `/api/v1/task/{userid}` — Update a task
 
**Access:** `ADMIN` only  
**Headers:** `Authorization: Bearer <token>`  
**Path Variable:** `userid` — ID of the task to update  
**Request Body:**
```json
{
  "title": "Fix login bug (updated)",
  "description": "Updated description",
  "status": "IN_PROGRESS",
  "priority": "MEDIUM",
  "dueDate": "2025-08-10"
}
```
 
**Response:** `200 OK` — Returns the updated task object (same shape as Create response).
 
**Error Responses:**
 
| Status | Reason                        |
|--------|-------------------------------|
| `400`  | Validation failed             |
| `401`  | Unauthorized                  |
| `403`  | Forbidden (not ADMIN)         |
| `404`  | Task not found                |
 
---
 
#### DELETE `/api/v1/task/{taskid}` — Delete a task
 
**Access:** `ADMIN` only  
**Headers:** `Authorization: Bearer <token>`  
**Path Variable:** `taskid` — ID of the task to delete
 
**Response:** `204 No Content`
 
**Error Responses:**
 
| Status | Reason                        |
|--------|-------------------------------|
| `401`  | Unauthorized                  |
| `403`  | Forbidden (not ADMIN)         |
| `404`  | Task not found                |
 
---
 
#### GET `/api/v1/task/{taskid}/{status}` — Update task status
 
**Access:** `USER` only  
**Headers:** `Authorization: Bearer <token>`  
**Path Variables:**
- `taskid` — ID of the task
- `status` — New status value: `TODO` | `IN_PROGRESS` | `DONE`
 
**Example:** `GET /api/v1/task/3/DONE`
 
**Response:** `204 No Content`
 
**Error Responses:**
 
| Status | Reason                        |
|--------|-------------------------------|
| `400`  | Invalid status value          |
| `401`  | Unauthorized                  |
| `403`  | Forbidden (not USER)          |
| `404`  | Task not found                |
 
---
 
#### GET `/api/v1/task` — Get paginated task list
 
**Access:** `ADMIN` or `USER`  
**Headers:** `Authorization: Bearer <token>`
 
**Query Parameters:**
 
| Parameter  | Type    | Default    | Description                              | Example             |
|------------|---------|------------|------------------------------------------|---------------------|
| `page`     | int     | `0`        | Page number (0-indexed)                  | `?page=1`           |
| `size`     | int     | `5`        | Number of tasks per page                 | `?size=10`          |
| `status`   | string  | *(none)*   | Filter by status: `TODO` `IN_PROGRESS` `DONE` | `?status=TODO` |
| `priority` | string  | *(none)*   | Filter by priority: `LOW` `MEDIUM` `HIGH`| `?priority=HIGH`    |
| `sortBy`   | string  | `dueDate`  | Sort field: `dueDate` or `priority`      | `?sortBy=priority`  |
| `sortDir`  | string  | `asc`      | Sort direction: `asc` or `desc`          | `?sortDir=desc`     |
 
**Example Request:**
```
GET /api/v1/task?page=0&size=5&status=TODO&priority=HIGH&sortBy=dueDate&sortDir=asc
```
 
**Response:** `200 OK`
```json
{
  "page": 0,
  "size": 5,
  "totalElements": 12,
  "totalPages": 3,
  "data": [
    {
      "id": 1,
      "title": "Fix login bug",
      "description": "The login page throws a 500 error on wrong password",
      "status": "TODO",
      "priority": "HIGH",
      "dueDate": "2025-08-01",
      "createdAt": "2025-07-20T10:00:00",
      "updatedAt": "2025-07-20T10:00:00"
    }
  ]
}
```
 
**Error Responses:**
 
| Status | Reason                        |
|--------|-------------------------------|
| `401`  | Unauthorized                  |
| `403`  | Forbidden                     |
 
---
 
### 📌 Endpoint Summary
 
| Method   | Endpoint                        | Description                         | Access        |
|----------|---------------------------------|-------------------------------------|---------------|
| `POST`   | `/api/v1/user`                  | Register a new user                 | Public        |
| `POST`   | `/api/v1/user/auth`             | Login and get JWT token             | Public        |
| `POST`   | `/api/v1/task`                  | Create a new task                   | ADMIN         |
| `POST`   | `/api/v1/task/{userid}`         | Update an existing task             | ADMIN         |
| `DELETE` | `/api/v1/task/{taskid}`         | Delete a task                       | ADMIN         |
| `GET`    | `/api/v1/task/{taskid}/{status}`| Update task status                  | USER          |
| `GET`    | `/api/v1/task`                  | Get tasks (paginated + filterable)  | ADMIN / USER  |
 
---
 
