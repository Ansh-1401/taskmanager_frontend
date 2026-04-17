<div align="center">

# ✅ TaskFlow — Frontend

### *A sleek, modern Task Manager built with React*

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](https://choosealicense.com/licenses/mit/)
![Status](https://img.shields.io/badge/Status-Active-brightgreen?style=flat-square)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-blue?style=flat-square)

<br/>

> 🎯 **Stay organized. Stay productive. Ship more.**
> TaskFlow helps you manage your daily tasks with a beautiful, intuitive UI — built for speed and simplicity.

<br/>

[🚀 Live Demo](https://taskmanager-frontend-koiw.onrender.com/) · [🐛 Report Bug](#) · [💡 Request Feature](#)

---

</div>

## 📸 Screenshots

![App UI](./screenshots/login.png)

```
![App UI](./screenshots/manager-dashboard.png)

```
![App UI](./screenshots/developer-dashboard.png)
---

## ✨ Features

- 📋 **Create, edit & delete tasks** with ease
- ✅ **Mark tasks as complete** — satisfying one-click done!
- 🗂️ **Filter & sort** tasks by status, priority, or date
- 🔐 **JWT-based Auth** — secure login & signup
- 📱 **Fully Responsive** — works on mobile, tablet & desktop
- 🌙 **Clean UI** — distraction-free design
- ⚡ **Fast & lightweight** — React-powered SPA

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| ⚛️ **React** | UI library & component architecture |
| 🔀 **React Router** | Client-side navigation |
| 📡 **Axios / Fetch** | API communication with backend |
| 🎨 **CSS Modules / Tailwind** | Styling |
| 🔑 **JWT (localStorage)** | Auth token management |
| ⚡ **Vite** | Dev server & build tool |

---

## 🚀 Getting Started

### 📦 Prerequisites

Make sure you have the following installed:

```bash
node >= 18.0.0
npm >= 9.0.0
```

### 🔧 Installation

**1. Clone the repository**
```bash
git clone https://github.com/Ansh-1401/taskmanager_frontend.git
cd taskflow-frontend
```

**2. Install dependencies**
```bash
npm install
```

**3. Set up environment variables**
```bash
cp .env.example .env
```

Edit `.env` file:
```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_APP_NAME=TaskFlow
```

**4. Start the development server**
```bash
npm run dev
```

🎉 App is running at **http://localhost:5173**

---

## 📁 Project Structure

```
taskflow-frontend/
├── 📂 public/
├── 📂 src/
│   ├── 📂 components/       # Reusable UI components
│   │   ├── TaskCard.jsx
│   │   ├── TaskForm.jsx
│   │   └── Navbar.jsx
│   ├── 📂 pages/            # Route-level pages
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   └── Register.jsx
│   ├── 📂 services/         # API call functions
│   │   └── taskService.js
│   ├── 📂 context/          # Global state (Auth context)
│   │   └── AuthContext.jsx
│   ├── 📂 hooks/            # Custom React hooks
│   ├── 📂 assets/           # Images, icons
│   ├── App.jsx
│   └── main.jsx
├── .env.example
├── package.json
└── vite.config.js
```

---

## 🔗 API Integration

This frontend connects to the **TaskFlow Backend** (Spring Boot).

> 🔙 Backend repo: [taskflow-backend](https://github.com/Ansh-1401/task_manager_backend)

Make sure the backend server is running on `http://localhost:8080` before starting the frontend.

---

## 🧪 Available Scripts

```bash
npm run dev       # 🔥 Start development server
npm run build     # 📦 Build for production
npm run preview   # 👀 Preview production build
npm run lint      # 🔍 Run ESLint
```

---

## 🤝 Contributing

Contributions are always welcome! 🙌

```bash
# 1. Fork the project
# 2. Create your feature branch
git checkout -b feature/AmazingFeature

# 3. Commit your changes
git commit -m "✨ Add some AmazingFeature"

# 4. Push to the branch
git push origin feature/AmazingFeature

# 5. Open a Pull Request
```

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

<div align="center">

Made with ❤️ by [Ansh Srivastava](https://github.com/Ansh-1401/taskmanager_frontend)

⭐ **Star this repo if you find it helpful!** ⭐

</div>
