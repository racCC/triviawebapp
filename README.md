# 🧠 The Trivia Archivist

A full-stack trivia quiz application that allows users to generate, play, and track their quiz history. Built with React, Node.js, Express, and MongoDB.

![Trivia Archivist](https://img.shields.io/badge/Status-Active-brightgreen)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![React](https://img.shields.io/badge/React-18+-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-6+-darkgreen)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Running the Application](#-running-the-application)
- [API Endpoints](#-api-endpoints)
- [Design Decisions & Trade-offs](#-design-decisions--trade-offs)
- [Future Improvements](#-future-improvements)

---

## ✨ Features

### Quiz Generator
- **Category Selection**: Choose from 24+ trivia categories (fetched from Open Trivia Database)
- **Difficulty Levels**: Easy, Medium, or Hard
- **Customizable Amount**: Select 1-50 questions per quiz

### Quiz Player
- **Interactive UI**: Clean, minimal interface with progress tracking
- **Instant Feedback**: Visual feedback for correct/incorrect answers
- **Score Tracking**: Real-time score updates during quiz
- **Answer Review**: Complete review of all answers after quiz completion

### Quiz History
- **Persistent Storage**: All quizzes saved to MongoDB
- **Statistics Dashboard**: View total quizzes, questions answered, and completion rates
- **Score Display**: Color-coded scores based on performance
- **Review Past Quizzes**: Revisit and review previous quiz attempts

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18 | UI Framework |
| Vite | Build Tool & Dev Server |
| Lucide React | Icon Library |
| CSS3 | Styling (CSS Variables, Flexbox, Grid) |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js 18+ | Runtime Environment |
| Express.js | Web Framework |
| MongoDB | Database |
| Mongoose | ODM for MongoDB |
| Axios | HTTP Client for External API |
| CORS | Cross-Origin Resource Sharing |
| dotenv | Environment Variables |

### External API
| Service | Purpose |
|---------|---------|
| [Open Trivia Database](https://opentdb.com/) | Source of trivia questions |

---

## 📁 Project Structure

```
triviawebapp/
├── backend/
│   ├── config/
│   │   ├── config.js          # App configuration & constants
│   │   └── db.js              # MongoDB connection
│   ├── controllers/
│   │   └── quizController.js  # Quiz route handlers
│   ├── models/
│   │   └── Quiz.js            # Mongoose schema for quizzes
│   ├── routes/
│   │   └── quizRoutes.js      # API route definitions
│   ├── services/
│   │   └── triviaService.js   # Open Trivia DB integration
│   ├── .env                   # Environment variables (not in git)
│   ├── .env.example           # Example environment file
│   ├── package.json
│   └── server.js              # Express app entry point
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── QuizGenerator.jsx  # Quiz creation form
│   │   │   ├── QuizPlayer.jsx     # Quiz playing interface
│   │   │   ├── QuizQuestion.jsx   # Individual question component
│   │   │   └── QuizHistory.jsx    # Quiz history list
│   │   ├── services/
│   │   │   └── apiClient.js       # Backend API client
│   │   ├── App.jsx                # Main application component
│   │   ├── App.css                # Global styles
│   │   ├── index.css              # CSS reset & variables
│   │   └── main.jsx               # React entry point
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher) - [Download](https://nodejs.org/)
- **npm** (v9.0.0 or higher) - Comes with Node.js
- **MongoDB** (v6.0 or higher) - [Download](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/atlas)
- **Git** - [Download](https://git-scm.com/)

### Verify Installation

```bash
node --version    # Should be v18+
npm --version     # Should be v9+
mongod --version  # Should be v6+ (if using local MongoDB)
```

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/triviawebapp.git
cd triviawebapp
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

Edit the `.env` file with your configuration:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/triviadb

# For MongoDB Atlas, use:
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/triviadb
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install
```

---

## ▶️ Running the Application

### Option 1: Run Separately (Recommended for Development)

**Terminal 1 - Start MongoDB (if running locally):**
```bash
mongod
```

**Terminal 2 - Start Backend:**
```bash
cd backend
npm run dev
```
Backend will run on: `http://localhost:5000`

**Terminal 3 - Start Frontend:**
```bash
cd frontend
npm run dev
```
Frontend will run on: `http://localhost:5173`

### Option 2: Using Concurrently (Single Command)

From the project root, you can run both servers:

```bash
# Install concurrently globally (one time)
npm install -g concurrently

# Run both servers
concurrently "cd backend && npm run dev" "cd frontend && npm run dev"
```

### Accessing the Application

Open your browser and navigate to:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api

---

## 📡 API Endpoints

### Base URL: `http://localhost:5000/api`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/options` | Get available categories and difficulties |
| `POST` | `/generate` | Generate a new quiz |
| `GET` | `/quizzes` | Get all saved quizzes |
| `GET` | `/quizzes/:id` | Get a specific quiz by ID |
| `POST` | `/quizzes/:id/submit` | Submit quiz answers and calculate score |

### Example Requests

**Generate Quiz:**
```bash
curl -X POST http://localhost:5000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"amount": 10, "category": "Science: Computers", "difficulty": "medium"}'
```

**Get Quiz History:**
```bash
curl http://localhost:5000/api/quizzes
```

**Submit Quiz Answers:**
```bash
curl -X POST http://localhost:5000/api/quizzes/<quiz_id>/submit \
  -H "Content-Type: application/json" \
  -d '{"answers": {"0": "Answer 1", "1": "Answer 2"}}'
```

---

## 🎯 Design Decisions & Trade-offs

### Architecture Decisions

| Decision | Reasoning | Trade-off |
|----------|-----------|-----------|
| **Separate Frontend/Backend** | Clear separation of concerns, easier to scale and maintain | Requires CORS configuration, two servers to manage |
| **MongoDB over SQL** | Flexible schema for quiz data, easy to store nested questions/answers | Less suitable for complex relational queries |
| **Vite over CRA** | Faster development builds, better HMR, smaller bundle size | Newer tool with smaller ecosystem |
| **CSS-in-JS (inline styles)** | Component-scoped styles, no CSS conflicts | Slightly larger component files |
| **No Authentication** | Simplified MVP, faster development | No user-specific quiz history |

### API Design Decisions

| Decision | Reasoning |
|----------|-----------|
| **Category names instead of IDs** | Better UX - users see readable names, backend handles ID lookup |
| **Store questions in quiz document** | Enables offline review, no need to re-fetch from external API |
| **Calculate score on backend** | Prevents cheating, centralized validation |

### Frontend Decisions

| Decision | Reasoning |
|----------|-----------|
| **Single-page navigation** | Smooth transitions, no page reloads |
| **Inline `<style>` tags** | Self-contained components, easy to understand |
| **Lucide React icons** | Lightweight, tree-shakeable, consistent design |
| **No state management library** | App is simple enough for React's built-in useState |

### Data Flow

```
User selects options → Frontend sends POST /generate
                                ↓
                     Backend calls Open Trivia DB
                                ↓
                     Backend saves quiz to MongoDB
                                ↓
                     Backend returns quiz to Frontend
                                ↓
                     User plays quiz (answers stored in React state)
                                ↓
                     User finishes → Frontend sends POST /submit
                                ↓
                     Backend calculates score, updates MongoDB
                                ↓
                     Frontend displays results
```

### Known Limitations

1. **No User Authentication**: All quizzes are shared/public
2. **Rate Limiting**: Open Trivia DB has rate limits (not handled gracefully)


---

## 🔮 Future Improvements
- [] AI-genereted Did you Know sections
- [ ] User authentication and personal quiz history
- [ ] Leaderboard system
- [ ] Timed quizzes with countdown
- [ ] Multiplayer/competitive mode
- [ ] Custom quiz creation (user-submitted questions)
- [ ] Progressive Web App (PWA) support
- [ ] Dark mode theme
- [ ] Export quiz results as PDF
- [ ] Social sharing of scores

---

