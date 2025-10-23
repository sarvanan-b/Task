# Task Manager Project Structure & Functionality

## 📁 **Project Overview**
A full-stack MERN (MongoDB, Express.js, React, Node.js) task management application with real-time collaboration features, user authentication, and comprehensive task management capabilities.

---

## 🏗️ **Root Directory Structure**

```
Taskmanager/
├── 📄 README.md                           # Project documentation and setup instructions
├── 📄 API_DOCUMENTATION.md                 # Comprehensive API documentation
├── 📄 PROJECT_STRUCTURE.md                # This file - project structure documentation
├── 📁 client/                             # React frontend application
└── 📁 server/                             # Node.js backend API
```

---

## 🖥️ **Backend Structure (Server)**

### **📁 server/**
```
server/
├── 📄 index.js                            # Main server entry point
├── 📄 package.json                        # Backend dependencies and scripts
├── 📄 package-lock.json                   # Dependency lock file
├── 📁 controllers/                        # Business logic controllers
│   ├── 📄 taskController.js              # Task management logic
│   └── 📄 userController.js              # User authentication & management
├── 📁 middlewares/                        # Custom middleware functions
│   ├── 📄 authMiddlewaves.js             # Authentication middleware
│   └── 📄 errorMiddlewaves.js            # Error handling middleware
├── 📁 models/                             # Database schemas (Mongoose)
│   ├── 📄 task.js                        # Task data model
│   ├── 📄 user.js                        # User data model
│   └── 📄 notification.js                 # Notification data model
├── 📁 routes/                             # API route definitions
│   ├── 📄 index.js                       # Main router configuration
│   ├── 📄 taskRoutes.js                  # Task-related API endpoints
│   └── 📄 userRoutes.js                  # User-related API endpoints
└── 📁 utils/                              # Utility functions
    └── 📄 index.js                       # Database connection & JWT utilities
```

### **🔧 Backend File Functionality**

#### **📄 server/index.js**
- **Purpose**: Main server entry point and configuration
- **Functionality**:
  - Express server setup and configuration
  - CORS configuration for cross-origin requests
  - Middleware setup (JSON parsing, cookie parser, morgan logging)
  - Database connection initialization
  - Route mounting (`/api` prefix)
  - Error handling middleware
  - Server startup on configured port

#### **📄 server/controllers/taskController.js**
- **Purpose**: Task management business logic
- **Key Functions**:
  - `createTask()` - Create new tasks with team assignment
  - `getTasks()` - Retrieve tasks with filtering options
  - `getTask()` - Get single task details
  - `updateTask()` - Update task information
  - `duplicateTask()` - Clone existing tasks
  - `trashTask()` - Soft delete tasks
  - `deleteRestoreTask()` - Permanent delete/restore operations
  - `createSubTask()` - Add sub-tasks to existing tasks
  - `postTaskActivity()` - Add comments/activities to tasks
  - `dashboardStatistics()` - Generate dashboard analytics

#### **📄 server/controllers/userController.js**
- **Purpose**: User authentication and management
- **Key Functions**:
  - `registerUser()` - User registration with validation
  - `loginUser()` - User authentication with JWT
  - `logoutUser()` - Clear authentication tokens
  - `getTeamList()` - Retrieve team members (Admin only)
  - `updateUserProfile()` - Update user information
  - `changeUserPassword()` - Password change functionality
  - `activateUserProfile()` - Enable/disable user accounts (Admin)
  - `deleteUserProfile()` - Delete user accounts (Admin)
  - `getNotificationsList()` - Get user notifications
  - `markNotificationRead()` - Mark notifications as read

#### **📄 server/models/task.js**
- **Purpose**: Task data schema definition
- **Schema Fields**:
  - `title` - Task title (required)
  - `description` - Task description
  - `date` - Task deadline
  - `priority` - Priority level (high, medium, normal, none)
  - `stage` - Task status (todo, in progress, completed)
  - `team` - Array of assigned user IDs
  - `activities` - Array of task activities/comments
  - `subTasks` - Array of sub-tasks
  - `isTrashed` - Soft delete flag
  - Timestamps (createdAt, updatedAt)

#### **📄 server/models/user.js**
- **Purpose**: User data schema definition
- **Schema Fields**:
  - `name` - User's full name (required)
  - `title` - Job title (required)
  - `role` - User role (required)
  - `email` - Email address (required, unique)
  - `password` - Hashed password (required)
  - `isAdmin` - Admin privilege flag
  - `isActive` - Account status flag
  - `tasks` - Array of assigned task IDs
  - Timestamps (createdAt, updatedAt)
- **Methods**:
  - `matchPassword()` - Password verification
  - Pre-save hook for password hashing

#### **📄 server/models/notification.js**
- **Purpose**: Notification data schema
- **Schema Fields**:
  - `team` - Array of target user IDs
  - `text` - Notification message
  - `task` - Related task ID
  - `notiType` - Notification type (alert, message)
  - `isRead` - Array of user IDs who read the notification
  - Timestamps (createdAt, updatedAt)

#### **📄 server/middlewares/authMiddlewaves.js**
- **Purpose**: Authentication and authorization middleware
- **Functions**:
  - `protectRoute()` - JWT token verification
  - `isAdminRoute()` - Admin privilege verification
- **Features**:
  - JWT token extraction from cookies
  - User authentication validation
  - Role-based access control

#### **📄 server/middlewares/errorMiddlewaves.js**
- **Purpose**: Centralized error handling
- **Functions**:
  - `routeNotFound()` - Handle 404 errors
  - `errorHandler()` - Global error processing
- **Features**:
  - Consistent error response format
  - Development vs production error details

#### **📄 server/routes/taskRoutes.js**
- **Purpose**: Task-related API endpoints
- **Routes**:
  - `POST /create` - Create task (Admin only)
  - `POST /duplicate/:id` - Duplicate task (Admin only)
  - `POST /activity/:id` - Add task activity
  - `GET /dashboard` - Dashboard statistics
  - `GET /` - Get all tasks
  - `GET /:id` - Get single task
  - `PUT /create-subtask/:id` - Add sub-task (Admin only)
  - `PUT /update/:id` - Update task (Admin only)
  - `PUT /:id` - Trash task (Admin only)
  - `DELETE /delete-restore/:id` - Delete/restore (Admin only)

#### **📄 server/routes/userRoutes.js**
- **Purpose**: User-related API endpoints
- **Routes**:
  - `POST /register` - User registration
  - `POST /login` - User login
  - `POST /logout` - User logout
  - `GET /get-team` - Get team list (Admin only)
  - `GET /notifications` - Get user notifications
  - `PUT /profile` - Update user profile
  - `PUT /read-noti` - Mark notification as read
  - `PUT /change-password` - Change password
  - `PUT /:id` - Activate/deactivate user (Admin only)
  - `DELETE /:id` - Delete user (Admin only)

#### **📄 server/utils/index.js**
- **Purpose**: Utility functions
- **Functions**:
  - `dbConnection()` - MongoDB connection setup
  - `createJWT()` - JWT token generation and cookie setting
- **Features**:
  - Environment-based cookie configuration
  - Secure token generation
  - Database connection error handling

---

## 🌐 **Frontend Structure (Client)**

### **📁 client/**
```
client/
├── 📄 package.json                        # Frontend dependencies and scripts
├── 📄 package-lock.json                   # Dependency lock file
├── 📄 vite.config.js                      # Vite build configuration
├── 📄 tailwind.config.js                  # Tailwind CSS configuration
├── 📄 postcss.config.js                   # PostCSS configuration
├── 📄 eslint.config.js                    # ESLint configuration
├── 📄 index.html                          # Main HTML template
├── 📁 public/                             # Static assets
│   └── 📄 vite.svg                        # Vite logo
├── 📁 dist/                               # Built application (production)
│   ├── 📄 index.html                      # Built HTML
│   ├── 📄 vite.svg                        # Static assets
│   └── 📁 assets/                         # Bundled CSS/JS
│       ├── 📄 index-CCa8Ofbs.js           # Bundled JavaScript
│       └── 📄 index-D1w2T5o3.css          # Bundled CSS
└── 📁 src/                                # Source code
    ├── 📄 main.jsx                        # Application entry point
    ├── 📄 App.jsx                          # Main application component
    ├── 📄 index.css                       # Global styles
    ├── 📁 assets/                         # Static assets
    │   ├── 📄 data.js                     # Mock data for development
    │   └── 📄 react.svg                   # React logo
    ├── 📁 components/                     # Reusable UI components
    │   ├── 📄 AddUser.jsx                 # User addition component
    │   ├── 📄 BoardView.jsx               # Kanban board view
    │   ├── 📄 Button.jsx                  # Reusable button component
    │   ├── 📄 ChangePassword.jsx          # Password change form
    │   ├── 📄 Chart.jsx                   # Data visualization charts
    │   ├── 📄 Dialogs.jsx                 # Dialog components
    │   ├── 📄 Loader.jsx                  # Loading spinner
    │   ├── 📄 ModalWrapper.jsx            # Modal container
    │   ├── 📄 Navbar.jsx                  # Navigation bar
    │   ├── 📄 NotificationPanel.jsx       # Notification display
    │   ├── 📄 SelectList.jsx              # Dropdown selection
    │   ├── 📄 Sidebar.jsx                 # Application sidebar
    │   ├── 📄 Tabs.jsx                    # Tab navigation
    │   ├── 📄 TaskCard.jsx                # Individual task card
    │   ├── 📄 TaskTitle.jsx               # Task title component
    │   ├── 📄 Textbox.jsx                 # Input field component
    │   ├── 📄 Title.jsx                   # Page title component
    │   ├── 📄 UserInfo.jsx                # User information display
    │   ├── 📄 ViewNotification.jsx        # Notification viewer
    │   ├── 📄 useAvatao.jsx               # Avatar generation hook
    │   └── 📁 task/                       # Task-specific components
    │       ├── 📄 AddSubTask.jsx          # Sub-task creation
    │       ├── 📄 AddTask.jsx             # Task creation form
    │       ├── 📄 Table.jsx               # Task table view
    │       ├── 📄 TaskDialog.jsx          # Task detail dialog
    │       └── 📄 UserList.jsx             # User selection list
    ├── 📁 pages/                          # Page components
    │   ├── 📄 Dashboard.jsx               # Main dashboard
    │   ├── 📄 login.jsx                   # Login page
    │   ├── 📄 register.jsx                # Registration page
    │   ├── 📄 TaskDetails.jsx             # Task detail page
    │   ├── 📄 Tasks.jsx                   # Task management page
    │   ├── 📄 Trash.jsx                   # Trash/archived tasks
    │   └── 📄 Users.jsx                   # User management page
    ├── 📁 redux/                          # State management
    │   ├── 📄 store.js                    # Redux store configuration
    │   └── 📁 slices/                     # Redux slices
    │       ├── 📄 apiSlice.js             # Base API slice
    │       ├── 📄 authSlice.js            # Authentication state
    │       └── 📁 api/                    # API-specific slices
    │           ├── 📄 authApiSlice.js     # Authentication API
    │           ├── 📄 taskApiSlice.js     # Task management API
    │           └── 📄 userApiSlice.js    # User management API
    └── 📁 utils/                          # Utility functions
        ├── 📄 firebase.js                 # Firebase configuration
        └── 📄 index.js                    # General utilities
```

### **🔧 Frontend File Functionality**

#### **📄 client/src/App.jsx**
- **Purpose**: Main application component and routing
- **Functionality**:
  - React Router setup for navigation
  - Authentication-based route protection
  - Layout component with sidebar and navbar
  - Mobile-responsive sidebar implementation
  - Route definitions for all pages
  - Toast notification setup

#### **📄 client/src/main.jsx**
- **Purpose**: Application entry point
- **Functionality**:
  - React DOM rendering
  - Redux store provider setup
  - Global CSS imports

#### **📄 client/src/pages/Dashboard.jsx**
- **Purpose**: Main dashboard with analytics
- **Features**:
  - Task statistics cards (total, completed, in progress, todos)
  - Priority-based charts using Recharts
  - Recent tasks table
  - Team members overview
  - Real-time data from API

#### **📄 client/src/pages/Tasks.jsx**
- **Purpose**: Task management interface
- **Features**:
  - Board view (Kanban style) and List view
  - Task filtering by status
  - Task creation modal
  - Task status management
  - Team assignment display

#### **📄 client/src/pages/TaskDetails.jsx**
- **Purpose**: Individual task detail view
- **Features**:
  - Complete task information display
  - Activity timeline
  - Sub-task management
  - Team member details
  - Task status updates

#### **📄 client/src/pages/Users.jsx**
- **Purpose**: User management interface (Admin only)
- **Features**:
  - Team member list
  - User status management
  - User profile updates
  - Account activation/deactivation

#### **📄 client/src/pages/login.jsx**
- **Purpose**: User authentication
- **Features**:
  - Login form with validation
  - Error handling
  - Redirect after successful login
  - Form state management

#### **📄 client/src/pages/register.jsx**
- **Purpose**: User registration
- **Features**:
  - Registration form
  - Input validation
  - Role selection
  - Success/error feedback

#### **📄 client/src/pages/Trash.jsx**
- **Purpose**: Trash/archived tasks management
- **Features**:
  - Soft-deleted tasks display
  - Restore functionality
  - Permanent deletion
  - Bulk operations

#### **📄 client/src/components/task/AddTask.jsx**
- **Purpose**: Task creation form
- **Features**:
  - Task title and description
  - Team member selection
  - Priority and stage selection
  - Date picker
  - Form validation

#### **📄 client/src/components/BoardView.jsx**
- **Purpose**: Kanban board implementation
- **Features**:
  - Drag-and-drop task cards
  - Status-based columns
  - Visual task representation
  - Team member avatars

#### **📄 client/src/components/Chart.jsx**
- **Purpose**: Data visualization
- **Features**:
  - Priority-based charts
  - Task distribution graphs
  - Interactive charts using Recharts

#### **📄 client/src/redux/store.js**
- **Purpose**: Redux store configuration
- **Features**:
  - RTK Query setup
  - Authentication slice
  - API middleware configuration
  - DevTools integration

#### **📄 client/src/redux/slices/authSlice.js**
- **Purpose**: Authentication state management
- **Features**:
  - User login/logout state
  - Sidebar toggle state
  - Local storage integration
  - Authentication persistence

#### **📄 client/src/redux/slices/api/taskApiSlice.js**
- **Purpose**: Task-related API calls
- **Endpoints**:
  - Dashboard statistics
  - Task CRUD operations
  - Task activities
  - Sub-task management
  - Task duplication and trash operations

#### **📄 client/src/redux/slices/api/authApiSlice.js**
- **Purpose**: Authentication API calls
- **Endpoints**:
  - User login
  - User registration
  - User logout

#### **📄 client/src/utils/index.js**
- **Purpose**: Utility functions
- **Features**:
  - Date formatting
  - User initials generation
  - Color schemes for UI
  - Task type styling

#### **📄 client/src/utils/firebase.js**
- **Purpose**: Firebase configuration
- **Features**:
  - Firebase app initialization
  - Environment-based configuration
  - Ready for push notifications

---

## 🔧 **Configuration Files**

### **Backend Configuration**
- **📄 server/package.json**: Backend dependencies (Express, Mongoose, JWT, etc.)
- **📄 server/index.js**: Server configuration and middleware setup

### **Frontend Configuration**
- **📄 client/package.json**: Frontend dependencies (React, Redux, Tailwind, etc.)
- **📄 client/vite.config.js**: Vite build tool configuration
- **📄 client/tailwind.config.js**: Tailwind CSS customization
- **📄 client/postcss.config.js**: PostCSS configuration for Tailwind
- **📄 client/eslint.config.js**: Code linting rules

---

## 🚀 **Key Features & Functionality**

### **🔐 Authentication & Authorization**
- JWT-based authentication
- Role-based access control (Admin/User)
- Secure password hashing with bcrypt
- Session management with HTTP-only cookies

### **📋 Task Management**
- Create, read, update, delete tasks
- Task status management (todo, in progress, completed)
- Priority levels (high, medium, normal, low)
- Team assignment and collaboration
- Sub-task creation and management
- Task activities and comments
- Soft delete and restore functionality

### **👥 User Management**
- User registration and login
- Profile management
- Team member administration
- Account activation/deactivation
- Password change functionality

### **📊 Dashboard & Analytics**
- Task statistics and metrics
- Priority-based charts
- Recent activity overview
- Team performance insights

### **🔔 Notification System**
- Real-time notifications
- Task assignment alerts
- Activity updates
- Notification management

### **📱 Responsive Design**
- Mobile-first approach
- Responsive sidebar and navigation
- Touch-friendly interface
- Cross-device compatibility

---

## 🛠️ **Technology Stack**

### **Backend Technologies**
- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **MongoDB**: NoSQL database
- **Mongoose**: ODM for MongoDB
- **JWT**: Authentication tokens
- **bcryptjs**: Password hashing
- **CORS**: Cross-origin resource sharing

### **Frontend Technologies**
- **React 18**: UI library
- **Vite**: Build tool and dev server
- **Redux Toolkit**: State management
- **RTK Query**: API state management
- **React Router**: Client-side routing
- **Tailwind CSS**: Utility-first CSS framework
- **Headless UI**: Accessible UI components
- **Recharts**: Data visualization
- **React Hook Form**: Form management
- **Sonner**: Toast notifications

### **Development Tools**
- **ESLint**: Code linting
- **PostCSS**: CSS processing
- **Nodemon**: Development server
- **Vite**: Fast development and building

---

## 📦 **Dependencies Summary**

### **Backend Dependencies**
```json
{
  "bcryptjs": "^2.4.3",        // Password hashing
  "cookie-parser": "^1.4.7",   // Cookie parsing
  "cors": "^2.8.5",            // Cross-origin requests
  "dotenv": "^16.4.5",         // Environment variables
  "express": "^4.21.1",        // Web framework
  "jsonwebtoken": "^9.0.2",    // JWT tokens
  "mongodb": "^6.9.0",         // Database driver
  "mongoose": "^8.7.1",        // ODM
  "morgan": "^1.10.0"         // HTTP logging
}
```

### **Frontend Dependencies**
```json
{
  "@headlessui/react": "^2.1.9",    // Accessible UI components
  "@reduxjs/toolkit": "^2.2.8",     // State management
  "react": "^18.3.1",               // UI library
  "react-dom": "^18.3.1",           // React DOM
  "react-router-dom": "^6.26.2",   // Routing
  "tailwindcss": "^3.4.13",        // CSS framework
  "recharts": "^2.12.7",           // Charts
  "firebase": "^10.14.1",          // Firebase integration
  "sonner": "^1.5.0"               // Toast notifications
}
```

---

## 🎯 **Project Architecture**

### **MVC Pattern (Backend)**
- **Models**: Database schemas (Mongoose)
- **Views**: API responses (JSON)
- **Controllers**: Business logic

### **Component-Based Architecture (Frontend)**
- **Pages**: Route components
- **Components**: Reusable UI elements
- **Hooks**: Custom React hooks
- **State**: Redux store management

### **API-First Design**
- RESTful API endpoints
- JSON request/response format
- HTTP status codes
- Error handling

---

*This documentation provides a comprehensive overview of the Task Manager project structure and functionality. Each file and directory serves a specific purpose in creating a robust, scalable task management application.*
