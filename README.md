# Taskify- Fullstack Task Manager (MERN Stack)

A cloud-based task management application that enables streamlined task assignment, tracking, and team collaboration. Built using the MERN stack (MongoDB, Express.js, React, Node.js), Redux Toolkit, and Tailwind CSS for an efficient and scalable solution.

## 🔗 Live Demo

- **Frontend (Vercel):** [https://taskify-lyart-five.vercel.app](https://taskify-lyart-five.vercel.app)
- **Backend (Render):** [https://taskify-jhhu.onrender.com](https://taskify-jhhu.onrender.com)

## 🔐 Admin Credentials

You can log in with the following default admin credentials:

```
Email: admin@gmail.com  
Password: Admin@123
```

---

## 📦 Tech Stack

- **Frontend:** React + Vite, Redux Toolkit, Tailwind CSS, Headless UI  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB Atlas  
- **Deployment:** Vercel (Frontend) & Render (Backend)

---

## ✨ Features

### Admin Features

- 👥 Manage team members and admins  
- 📋 Assign, update, and delete tasks  
- 🏷️ Label tasks: Todo, In Progress, Completed  
- ⚠️ Set priority: High, Medium, Normal, Low  
- 🧩 Manage sub-tasks and upload assets  
- 🛑 Disable/activate user accounts  

### User Features

- 📌 Change task status  
- 💬 Comment/chat on tasks  
- 🔍 View task details  
- 🧑‍💼 Manage profile and change password  

---

## ⚙️ Setup Instructions

### 1. MongoDB Atlas Setup

1. Visit [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)  
2. Create an account and a new cluster  
3. Add a database user and whitelist IP  
4. Copy the connection string for use in the server `.env` file

---

### 2. Server Setup

```bash
cd server
touch .env
```

Add the following to `server/.env`:

```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=8800
NODE_ENV=development
```

Then install dependencies and start the server:

```bash
npm install
npm start
```

---

### 3. Client Setup

```bash
cd client
touch .env
```

Add the following to `client/.env`:

```
VITE_APP_BASE_URL=https://taskify-jhhu.onrender.com
VITE_APP_FIREBASE_API_KEY=your_firebase_api_key
```

Then install dependencies and start the client:

```bash
npm install
npm run dev
```

Or build for production:

```bash
npm run build
```

---

## 📁 Project Structure

```
root/
├── client/          # Vite + React frontend
├── server/          # Express.js backend
└── README.md
```

---

## ⚠️ Troubleshooting

- **CORS Error?**  
Make sure your backend includes this CORS setup:

