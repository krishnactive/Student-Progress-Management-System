#  Student Progress Management System

-	The Student Progress Management System is a full-stack MERN application designed to help educators or administrators monitor and analyze the competitive programming progress of students using Codeforces data.
- It enables CRUD operations on student records, visual analytics of Codeforces submissions and contest history, inactivity tracking, and automated email reminders.
---

## 🔗 Project Links

- 🌐 **Docs**: [[Link](https://drive.google.com/file/d/1KOu0pOWkmV2nwmKACOty0jIISAe69YeH/view?usp=sharing)]
- 📺 **Video Demo**:[[link](https://drive.google.com/file/d/1E9EwY0E1F1Vq6OBwhwz8EHJM111H_OUa/view?usp=sharing)]
---

## 📦 Features

- 🧾 Add, view, update, and delete student profiles
- ⚙️ Auto-fetch Codeforces data (ratings, submissions, contests)
- 📊 Visualizations for contest rating progression
- 🔥 Submission heatmap and performance breakdown
- 🧮 Problem difficulty buckets and solving trends
- 📨 Inactivity detection with optional email reminders
- 📁 Export all student data as CSV

---

## 🧑‍🎓 Tech Stack

### Frontend:
- React
- Tailwind CSS
- Axios
- Recharts
- React Router
- React Toastify

### Backend:
- Node.js
- Express.js
- MongoDB + Mongoose
- Axios (for CF API)
- Node-cron (for daily sync)

---

## 🚀 Installation

###Clone
```bash
git clone https://github.com/krishnactive/Student-Progress-Management-System.git
```

### Backend

```bash
cd server
npm install
npm run dev
```
#Frontend
```bash
cd client/student\ progress\ system/
npm install
npm run dev
