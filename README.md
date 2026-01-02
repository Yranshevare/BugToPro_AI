# BugToPro AI

BugToPro AI is an AI-powered learning platform that helps developers improve by reviewing their code, explaining mistakes, and guiding them through structured, task-based learning paths.

Instead of passive learning, users submit real solutions and receive actionable feedback from AI to gradually move from beginner mistakes to professional-level understanding.

---

## 🚀 Features

- **AI-Generated Learning Roadmaps**
  - Users provide a topic, timeline, current understanding, and goal
  - AI generates a structured, task-based roadmap for review and confirmation

- **Task-Based Learning Flow**
  - Roadmaps are divided into clear learning tasks
  - Each task includes focus areas and estimated completion time

- **AI Code Review & Feedback**
  - Users submit solutions and explanations for tasks
  - AI reviews submissions for correctness, clarity, and understanding
  - Constructive feedback highlights strengths, mistakes, and improvement areas

- **Progress Tracking**
  - Track active, completed, and paused learning topics
  - View past submissions and AI feedback

- **User Authentication**
  - Secure authentication using Supabase

---

## 🧠 How It Works

1. User selects a topic and learning goal
2. AI generates a roadmap overview
3. User reviews and confirms the roadmap
4. AI convert the text based roadmap into interactive task-sheet
5. Tasks are completed one by one, with assignment based completion
6. User submits solutions 
7. AI analyzes the submission and provides feedback
8. User improves iteratively based on feedback

---

## 🛠 Tech Stack

**Frontend & Backend**
- Next.js (App Router)

**Authentication**
- Supabase Auth

**Database**
- MongoDB
- Prisma ORM

**AI & Orchestration**
- LangChain
- LangGraph
- Gemini (LLM)

---
## ⚙️ Installation & Setup

Follow these steps to run **BugToPro AI** locally.



### 1️⃣ Prerequisites

Make sure you have the following installed:

- **Node.js** (v18 or later)
- **npm** 
- **MongoDB** (local or Atlas)
- **Supabase** account
- **Google Cloud account** (for OAuth & Gemini)
- **Google Gemini API key**



### 2️⃣ Clone the Repository

```bash
git clone https://github.com/Yranshevare/BugToPro_AI.git
cd BugToPro_AI
```

### 3️⃣ Install Dependencies
```bash
npm install
```
### 4️⃣ Set Up Google OAuth (Required for Supabase Auth)
BugToPro AI uses Google OAuth via Supabase for authentication.

**Step 1: Create OAuth Credentials**
1. Go to Google Cloud Console
2. Create or select a project
3. Navigate to APIs & Services → Credentials
4. Create OAuth 2.0 Client ID
5. Set application type to Web
6. Add the following redirect URI (you can get this sme url form your supabase account):
```
https://<your-project-id>.supabase.co/auth/v1/callback
```
Save the following:
- Google Client ID
- Google Client Secret

**Step 2: Configure Supabase OAuth**

1. Go to your Supabase Project
2. Navigate to Authentication → Providers
3. Enable Google
4. Paste:
    - Google Client ID
    - Google Client Secret
5. Save changes

### 5️⃣ Setup Supabase Redirect
1. Go to your Supabase Project
2. Navigate to Authentication → URL Configuration
3. inside Redirect URLs paste following urls:
```
http://localhost:3000/**
```
```
http://localhost:3000/Auth/**
```
```
http://localhost:3000/Auth/ResetPassword
```

later on you will need to change them by you production url

### 6️⃣ Environment Variables

Create a `.env` file in the root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=YOUR_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_KEY
NEXT_PUBLIC_SUPABASE_PROJECT_NAME=YOUR_NAME
SUPABASE_SECREAT_KEY=YOUR_KEY
GEMINI_API_KEY=YOUR_KEY
DATABASE_URL=YOUR_MONGODB_URL
```
### 7️⃣ Prisma Setup
Generate Prisma client:
```bash
npx prisma generate
```
(Optional) If you use migrations:
```bash
npx prisma db push
```
### 8️⃣ Run the Development Server
```bash
npm run dev
```

---

# 📚 What I Learned From This Project

Building **BugToPro AI** helped me explore and apply several new concepts and tools in a real-world project setup.

- **Building AI Applications**
  - This is my first project using **LangChain, LangGraph, and an LLM (Gemini)**.
  - Learned how to design AI workflows, write effective system and human prompts, and structure multi-step AI interactions.

- **Supabase Authentication & OAuth**
  - Implemented authentication using Supabase.
  - Integrated **Google OAuth**, including client configuration and redirect handling.
  - Gained practical experience with secure auth flows in a Next.js application.

- **TanStack Query**
  - Used TanStack Query for efficient server-state management.
  - Learned how to handle caching, background refetching, and loading/error states cleanly.

- **Server-Sent Events (SSE) & Event Streaming**
  - Implemented **SSE** to stream AI responses from the server.
  - Learned how to handle real-time updates and progressive rendering of AI-generated content on the frontend.

This project significantly improved my understanding of how modern full-stack applications integrate AI, authentication, real-time data flow, and scalable state management.

---
# 🔮 Future Plans

The following features are planned to expand BugToPro AI beyond individual learning into a collaborative and intelligent developer platform.

- **Community & Project Sharing**
  - Introduce a community space where users can publish their learning projects or repositories.
  - Other users can explore, learn from, and reuse these projects for reference or practice.
  - This feature aims to encourage peer learning and knowledge sharing, similar to open-source collaboration platforms.

- **RAG-Based AI Chatbot**
  - Integrate a Retrieval-Augmented Generation (RAG) based chatbot within the platform.
  - The chatbot will help users ask questions related to programming concepts, tasks, or learning topics.
  - Responses will be grounded in relevant documentation, learning material, and user context to provide more accurate and helpful answers.

These enhancements will make BugToPro AI a more interactive, community-driven, and intelligent learning ecosystem.

---