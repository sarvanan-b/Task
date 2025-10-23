# Task Manager API Documentation

## Overview
This is a comprehensive REST API for a task management system built with Node.js, Express.js, and MongoDB. The API provides endpoints for user authentication, task management, team collaboration, and notifications.

## Base URL
```
http://localhost:8800/api
```

## Authentication
The API uses JWT (JSON Web Tokens) for authentication. Tokens are stored in HTTP-only cookies.

### Authentication Headers
All protected routes require a valid JWT token in cookies.

## API Endpoints

---

## 🔐 Authentication Endpoints

### Register User
**POST** `/user/register`

Creates a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "isAdmin": false,
  "role": "Developer",
  "title": "Software Engineer"
}
```

**Response:**
```json
{
  "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
  "name": "John Doe",
  "email": "john@example.com",
  "isAdmin": false,
  "role": "Developer",
  "title": "Software Engineer",
  "isActive": true,
  "createdAt": "2023-09-05T10:30:00.000Z",
  "updatedAt": "2023-09-05T10:30:00.000Z"
}
```

**Status Codes:**
- `201` - User created successfully
- `400` - User already exists or invalid data
- `400` - Invalid user data

---

### Login User
**POST** `/user/login`

Authenticates a user and returns user information.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
  "name": "John Doe",
  "email": "john@example.com",
  "isAdmin": false,
  "role": "Developer",
  "title": "Software Engineer",
  "isActive": true
}
```

**Status Codes:**
- `200` - Login successful
- `401` - Invalid credentials
- `401` - Account deactivated
- `400` - Invalid request data

---

### Logout User
**POST** `/user/logout`

Logs out the current user by clearing the JWT token.

**Response:**
```json
{
  "message": "Logout successful"
}
```

**Status Codes:**
- `200` - Logout successful
- `400` - Logout failed

---

## 👥 User Management Endpoints

### Get Team List
**GET** `/user/get-team`

**Authentication:** Required (Admin only)

Retrieves a list of all team members.

**Response:**
```json
[
  {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "name": "John Doe",
    "title": "Software Engineer",
    "role": "Developer",
    "email": "john@example.com",
    "isActive": true
  },
  {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
    "name": "Jane Smith",
    "title": "Project Manager",
    "role": "Manager",
    "email": "jane@example.com",
    "isActive": true
  }
]
```

**Status Codes:**
- `200` - Team list retrieved successfully
- `401` - Unauthorized (Admin access required)
- `400` - Error retrieving team list

---

### Update User Profile
**PUT** `/user/profile`

**Authentication:** Required

Updates the current user's profile information.

**Request Body:**
```json
{
  "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
  "name": "John Updated",
  "title": "Senior Software Engineer",
  "role": "Senior Developer"
}
```

**Response:**
```json
{
  "status": true,
  "message": "Profile Updated Successfully.",
  "user": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "name": "John Updated",
    "title": "Senior Software Engineer",
    "role": "Senior Developer",
    "email": "john@example.com",
    "isActive": true
  }
}
```

**Status Codes:**
- `201` - Profile updated successfully
- `404` - User not found
- `400` - Update failed

---

### Change Password
**PUT** `/user/change-password`

**Authentication:** Required

Changes the current user's password.

**Request Body:**
```json
{
  "password": "newpassword123"
}
```

**Response:**
```json
{
  "status": true,
  "message": "Password changed successfully."
}
```

**Status Codes:**
- `201` - Password changed successfully
- `404` - User not found
- `400` - Password change failed

---

### Activate/Deactivate User
**PUT** `/user/:id`

**Authentication:** Required (Admin only)

Activates or deactivates a user account.

**Request Body:**
```json
{
  "isActive": false
}
```

**Response:**
```json
{
  "status": true,
  "message": "User account has been disabled"
}
```

**Status Codes:**
- `201` - User status updated successfully
- `404` - User not found
- `401` - Unauthorized (Admin access required)

---

### Delete User
**DELETE** `/user/:id`

**Authentication:** Required (Admin only)

Permanently deletes a user account.

**Response:**
```json
{
  "status": true,
  "message": "User deleted successfully"
}
```

**Status Codes:**
- `200` - User deleted successfully
- `401` - Unauthorized (Admin access required)
- `400` - Delete failed

---

## 📋 Task Management Endpoints

### Create Task
**POST** `/task/create`

**Authentication:** Required (Admin only)

Creates a new task and assigns it to team members.

**Request Body:**
```json
{
  "title": "Implement user authentication",
  "description": "Create login and registration functionality with JWT tokens",
  "team": ["64f8a1b2c3d4e5f6a7b8c9d0", "64f8a1b2c3d4e5f6a7b8c9d1"],
  "stage": "todo",
  "date": "2023-09-15T00:00:00.000Z",
  "priority": "high"
}
```

**Response:**
```json
{
  "status": true,
  "task": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d2",
    "title": "Implement user authentication",
    "description": "Create login and registration functionality with JWT tokens",
    "stage": "todo",
    "priority": "high",
    "date": "2023-09-15T00:00:00.000Z",
    "team": ["64f8a1b2c3d4e5f6a7b8c9d0", "64f8a1b2c3d4e5f6a7b8c9d1"],
    "activities": [
      {
        "type": "assigned",
        "activity": "New task has been assigned to you and 1 others. The task priority is set at high priority, so check and act accordingly. The task date is Mon Sep 15 2023. Thank you!",
        "date": "2023-09-05T10:30:00.000Z",
        "by": "64f8a1b2c3d4e5f6a7b8c9d0"
      }
    ],
    "subTasks": [],
    "isTrashed": false,
    "createdAt": "2023-09-05T10:30:00.000Z",
    "updatedAt": "2023-09-05T10:30:00.000Z"
  },
  "message": "Task created successfully."
}
```

**Status Codes:**
- `200` - Task created successfully
- `401` - Unauthorized (Admin access required)
- `400` - Task creation failed

---

### Get All Tasks
**GET** `/task`

**Authentication:** Required

Retrieves all tasks with optional filtering.

**Query Parameters:**
- `stage` (optional): Filter by task stage (todo, in progress, completed)
- `isTrashed` (optional): Filter by trash status (true/false)

**Example Request:**
```
GET /task?stage=todo&isTrashed=false
```

**Response:**
```json
{
  "status": true,
  "tasks": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d2",
      "title": "Implement user authentication",
      "description": "Create login and registration functionality with JWT tokens",
      "stage": "todo",
      "priority": "high",
      "date": "2023-09-15T00:00:00.000Z",
      "team": [
        {
          "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
          "name": "John Doe",
          "title": "Software Engineer",
          "email": "john@example.com"
        }
      ],
      "activities": [...],
      "subTasks": [],
      "isTrashed": false,
      "createdAt": "2023-09-05T10:30:00.000Z",
      "updatedAt": "2023-09-05T10:30:00.000Z"
    }
  ]
}
```

**Status Codes:**
- `200` - Tasks retrieved successfully
- `401` - Unauthorized
- `400` - Error retrieving tasks

---

### Get Single Task
**GET** `/task/:id`

**Authentication:** Required

Retrieves detailed information about a specific task.

**Response:**
```json
{
  "status": true,
  "task": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d2",
    "title": "Implement user authentication",
    "description": "Create login and registration functionality with JWT tokens",
    "stage": "todo",
    "priority": "high",
    "date": "2023-09-15T00:00:00.000Z",
    "team": [
      {
        "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
        "name": "John Doe",
        "title": "Software Engineer",
        "role": "Developer",
        "email": "john@example.com"
      }
    ],
    "activities": [
      {
        "type": "assigned",
        "activity": "New task has been assigned to you...",
        "date": "2023-09-05T10:30:00.000Z",
        "by": {
          "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
          "name": "Admin User"
        }
      }
    ],
    "subTasks": [],
    "isTrashed": false,
    "createdAt": "2023-09-05T10:30:00.000Z",
    "updatedAt": "2023-09-05T10:30:00.000Z"
  }
}
```

**Status Codes:**
- `200` - Task retrieved successfully
- `401` - Unauthorized
- `400` - Error retrieving task

---

### Update Task
**PUT** `/task/update/:id`

**Authentication:** Required (Admin only)

Updates an existing task.

**Request Body:**
```json
{
  "title": "Updated task title",
  "description": "Updated task description",
  "date": "2023-09-20T00:00:00.000Z",
  "team": ["64f8a1b2c3d4e5f6a7b8c9d0"],
  "stage": "in progress",
  "priority": "medium"
}
```

**Response:**
```json
{
  "status": true,
  "message": "Task updated successfully."
}
```

**Status Codes:**
- `200` - Task updated successfully
- `401` - Unauthorized (Admin access required)
- `400` - Update failed

---

### Duplicate Task
**POST** `/task/duplicate/:id`

**Authentication:** Required (Admin only)

Creates a duplicate of an existing task.

**Response:**
```json
{
  "status": true,
  "message": "Task duplicated successfully."
}
```

**Status Codes:**
- `200` - Task duplicated successfully
- `401` - Unauthorized (Admin access required)
- `400` - Duplication failed

---

### Trash Task
**PUT** `/task/:id`

**Authentication:** Required (Admin only)

Moves a task to trash (soft delete).

**Response:**
```json
{
  "status": true,
  "message": "Task trashed successfully."
}
```

**Status Codes:**
- `200` - Task trashed successfully
- `401` - Unauthorized (Admin access required)
- `400` - Trash operation failed

---

### Delete/Restore Task
**DELETE** `/task/delete-restore/:id`

**Authentication:** Required (Admin only)

Permanently deletes or restores a task.

**Query Parameters:**
- `actionType`: Type of action (delete, deleteAll, restore, restoreAll)

**Example Requests:**
```
DELETE /task/delete-restore/64f8a1b2c3d4e5f6a7b8c9d2?actionType=delete
DELETE /task/delete-restore?actionType=deleteAll
DELETE /task/delete-restore/64f8a1b2c3d4e5f6a7b8c9d2?actionType=restore
DELETE /task/delete-restore?actionType=restoreAll
```

**Response:**
```json
{
  "status": true,
  "message": "Operation performed successfully."
}
```

**Status Codes:**
- `200` - Operation completed successfully
- `401` - Unauthorized (Admin access required)
- `400` - Operation failed

---

### Create Sub-task
**PUT** `/task/create-subtask/:id`

**Authentication:** Required (Admin only)

Adds a sub-task to an existing task.

**Request Body:**
```json
{
  "title": "Set up database schema",
  "tag": "backend",
  "date": "2023-09-10T00:00:00.000Z"
}
```

**Response:**
```json
{
  "status": true,
  "message": "SubTask added successfully."
}
```

**Status Codes:**
- `200` - Sub-task created successfully
- `401` - Unauthorized (Admin access required)
- `400` - Sub-task creation failed

---

### Post Task Activity
**POST** `/task/activity/:id`

**Authentication:** Required

Adds an activity/comment to a task.

**Request Body:**
```json
{
  "type": "commented",
  "activity": "Started working on the authentication module"
}
```

**Response:**
```json
{
  "status": true,
  "message": "Activity posted successfully."
}
```

**Status Codes:**
- `200` - Activity posted successfully
- `401` - Unauthorized
- `400` - Activity posting failed

---

## 📊 Dashboard Endpoints

### Get Dashboard Statistics
**GET** `/task/dashboard`

**Authentication:** Required

Retrieves dashboard statistics and analytics.

**Response:**
```json
{
  "status": true,
  "message": "Successfully",
  "totalTasks": 25,
  "last10Task": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d2",
      "title": "Implement user authentication",
      "stage": "todo",
      "priority": "high",
      "date": "2023-09-15T00:00:00.000Z",
      "team": [
        {
          "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
          "name": "John Doe",
          "title": "Software Engineer",
          "email": "john@example.com"
        }
      ]
    }
  ],
  "users": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "name": "John Doe",
      "title": "Software Engineer",
      "role": "Developer",
      "isAdmin": false,
      "createdAt": "2023-09-05T10:30:00.000Z"
    }
  ],
  "tasks": {
    "todo": 10,
    "in progress": 8,
    "completed": 7
  },
  "graphData": [
    {
      "name": "high",
      "total": 5
    },
    {
      "name": "medium",
      "total": 12
    },
    {
      "name": "normal",
      "total": 6
    },
    {
      "name": "low",
      "total": 2
    }
  ]
}
```

**Status Codes:**
- `200` - Statistics retrieved successfully
- `401` - Unauthorized
- `400` - Error retrieving statistics

---

## 🔔 Notification Endpoints

### Get Notifications
**GET** `/user/notifications`

**Authentication:** Required

Retrieves unread notifications for the current user.

**Response:**
```json
[
  {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d3",
    "team": ["64f8a1b2c3d4e5f6a7b8c9d0"],
    "text": "New task has been assigned to you",
    "task": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d2",
      "title": "Implement user authentication"
    },
    "isRead": [],
    "createdAt": "2023-09-05T10:30:00.000Z"
  }
]
```

**Status Codes:**
- `201` - Notifications retrieved successfully
- `401` - Unauthorized
- `400` - Error retrieving notifications

---

### Mark Notification as Read
**PUT** `/user/read-noti`

**Authentication:** Required

Marks notifications as read.

**Query Parameters:**
- `isReadType`: Type of read operation (all for all notifications, or specific)
- `id` (optional): Specific notification ID

**Example Requests:**
```
PUT /user/read-noti?isReadType=all
PUT /user/read-noti?isReadType=single&id=64f8a1b2c3d4e5f6a7b8c9d3
```

**Response:**
```json
{
  "status": true,
  "message": "Done"
}
```

**Status Codes:**
- `201` - Notification marked as read
- `401` - Unauthorized
- `400` - Error marking notification

---

## 📝 Data Models

### User Model
```javascript
{
  _id: ObjectId,
  name: String (required),
  title: String (required),
  role: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  isAdmin: Boolean (default: false),
  isActive: Boolean (default: true),
  tasks: [ObjectId], // References to Task documents
  createdAt: Date,
  updatedAt: Date
}
```

### Task Model
```javascript
{
  _id: ObjectId,
  title: String (required),
  description: String,
  date: Date (default: new Date()),
  priority: String (enum: ["high", "medium", "normal", "none"]),
  stage: String (enum: ["todo", "in progress", "completed"], default: "todo"),
  team: [ObjectId], // References to User documents
  activities: [{
    type: String (enum: ["assigned", "started", "in progress", "bug", "completed", "commented"]),
    activity: String,
    date: Date,
    by: ObjectId // Reference to User
  }],
  subTasks: [{
    title: String,
    date: Date,
    tag: String
  }],
  isTrashed: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```

### Notification Model
```javascript
{
  _id: ObjectId,
  team: [ObjectId], // References to User documents
  text: String,
  task: ObjectId, // Reference to Task document
  isRead: [ObjectId], // Array of User IDs who have read the notification
  createdAt: Date
}
```

---

## 🔒 Authentication & Authorization

### JWT Token Structure
```javascript
{
  userId: "64f8a1b2c3d4e5f6a7b8c9d0",
  iat: 1693905000,
  exp: 1693991400
}
```

### Role-Based Access Control
- **Admin Routes**: Require `isAdmin: true` in user document
- **Protected Routes**: Require valid JWT token
- **Public Routes**: No authentication required

### Error Responses
All error responses follow this format:
```json
{
  "status": false,
  "message": "Error description"
}
```

### Common HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation
1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables in `.env`
4. Start the server: `npm start`

### Environment Variables
```env
MONGODB_URI=mongodb://localhost:27017/taskmanager
JWT_SECRET=your-secret-key
PORT=8800
NODE_ENV=development
```

---

## 📚 Additional Notes

- All timestamps are in UTC
- Passwords are automatically hashed using bcrypt
- JWT tokens are stored in HTTP-only cookies for security
- CORS is configured for cross-origin requests
- All routes are prefixed with `/api`
- The API supports both JSON request/response formats

---

## 🔧 Development

### Running the Server
```bash
# Development mode
npm start

# Production mode
NODE_ENV=production npm start
```

### Testing Endpoints
You can test the API using tools like:
- Postman
- Insomnia
- curl
- Thunder Client (VS Code extension)

### Example curl Commands
```bash
# Register a new user
curl -X POST http://localhost:8800/api/user/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123","isAdmin":false,"role":"Developer","title":"Software Engineer"}'

# Login
curl -X POST http://localhost:8800/api/user/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}' \
  -c cookies.txt

# Get tasks (using saved cookies)
curl -X GET http://localhost:8800/api/task \
  -b cookies.txt
```

---

*This documentation covers all available endpoints in the Task Manager API. For additional support or questions, please refer to the source code or contact the development team.*
