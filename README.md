# CineMatch - Movie Recommendation System

A full-stack web application that recommends movies based on dynamic personality quizzes. Built with React (Vite), Tailwind CSS, Node.js, Express, and MongoDB.

## Features
- **Personality Quiz**: Discover movies by answering engaging mood-based questions.
- **Smart Recommendations**: A custom weighting algorithm matches your answers to movie mood tags and genres.
- **User Authentication**: Secure JWT-based registration and login system.
- **Save to Watchlist**: Create a profile and save your favorite recommended movies for later.
- **Modern UI**: Fully responsive interface using Tailwind CSS, featuring smooth transitions enabled by Framer Motion and persistent dark/light mode toggling.

## Tech Stack
- **Frontend**: React.js, Tailwind CSS, Vite, Framer Motion, Axios, React Router v6
- **Backend**: Node.js, Express.js, JSON Web Tokens (JWT), Bcrypt.js
- **Database**: MongoDB (Mongoose ODMs)

## How to Run Locally

### Prerequisites
- Node.js installed (v16+ recommended)
- MongoDB running locally on `localhost:27017`

### 1. Setup the Backend
Open a terminal and navigate to the `server` directory:
```bash
cd server

# Install backend dependencies
npm install

# Seed the database with sample movies
node seed.js

# Start the Express server
node server.js
```
The server will run on `http://localhost:5000`.

### 2. Setup the Frontend
Open a new terminal window and navigate to the `client` directory:
```bash
cd client

# Install frontend dependencies
npm install

# Start the local development server
npm run dev
```
The application will be accessible at `http://localhost:3000`.

## Architecture Note
This project was implemented following modern best practices, including explicit separation of concerns between backend Models/Controllers (Routes) and Frontend UI Context/Pages.
