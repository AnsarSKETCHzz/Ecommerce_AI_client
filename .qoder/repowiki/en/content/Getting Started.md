# Getting Started

<cite>
**Referenced Files in This Document**
- [README.md](file://README.md)
- [package.json](file://package.json)
- [backend/package.json](file://backend/package.json)
- [backend/index.js](file://backend/index.js)
- [backend/db/db.js](file://backend/db/db.js)
- [backend/API_GUIDE.md](file://backend/API_GUIDE.md)
- [backend/seed.js](file://backend/seed.js)
- [backend/controllers/authController.js](file://backend/controllers/authController.js)
- [src/App.jsx](file://src/App.jsx)
- [src/pages/Home/Home.jsx](file://src/pages/Home/Home.jsx)
- [src/data/products.js](file://src/data/products.js)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Prerequisites](#prerequisites)
3. [System Requirements](#system-requirements)
4. [Installation Steps](#installation-steps)
5. [Environment Configuration](#environment-configuration)
6. [Database Setup](#database-setup)
7. [Initial Project Launch](#initial-project-launch)
8. [Basic Usage Examples](#basic-usage-examples)
9. [Verification Checklist](#verification-checklist)
10. [Troubleshooting Guide](#troubleshooting-guide)
11. [Development Workflow](#development-workflow)
12. [Next Steps](#next-steps)

## Introduction
This guide helps you install, configure, and run the full-stack e-commerce application locally. It covers frontend and backend setup, environment configuration, database initialization, and basic usage examples. The application uses a modern React frontend with a Node.js/Express backend and MongoDB for persistence.

## Prerequisites
Before installing the application, ensure you have:
- Node.js installed (version 18.x or later recommended)
- npm (comes with Node.js) version 8.x or later
- Git (recommended for cloning the repository)
- A code editor (VS Code recommended)
- Basic understanding of React and Node.js

These requirements align with the project's dependencies and scripts as defined in the repository configuration.

**Section sources**
- [package.json:17-22](file://package.json#L17-L22)
- [backend/package.json:6-10](file://backend/package.json#L6-L10)

## System Requirements
- Operating Systems: Windows, macOS, or Linux
- RAM: Minimum 4 GB recommended for smooth development
- Disk Space: ~500 MB free space for dependencies
- Network: Internet connection for downloading dependencies
- Ports: 
  - Frontend runs on port 3000 (http://localhost:3000)
  - Backend runs on port 5000 (http://localhost:5000)

These ports are configured in the frontend and backend scripts and server configurations.

**Section sources**
- [README.md:9-12](file://README.md#L9-L12)
- [backend/index.js:78](file://backend/index.js#L78)

## Installation Steps

### Step 1: Clone the Repository
Clone the repository to your local machine using Git:
```bash
git clone <repository-url>
cd my-app
```

### Step 2: Install Frontend Dependencies
Navigate to the project root and install React dependencies:
```bash
npm install
```

This installs all frontend packages defined in the root `package.json`.

**Section sources**
- [package.json:5-16](file://package.json#L5-L16)

### Step 3: Install Backend Dependencies
Navigate to the backend directory and install Node.js dependencies:
```bash
cd backend
npm install
```

This installs the backend stack including Express, Mongoose, JWT utilities, and validation libraries.

**Section sources**
- [backend/package.json:20-28](file://backend/package.json#L20-L28)

### Step 4: Configure Environment Variables
Create a `.env` file in the backend directory with the following variables:
- `MONGODB_URI`: Your MongoDB connection string (Atlas or local)
- `CLIENT_URL`: Frontend URL (default: http://localhost:3000)
- `NODE_ENV`: Set to development or production
- `PORT`: Backend port (default: 5000)

Example `.env` content:
```
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/<dbname>?retryWrites=true&w=majority
CLIENT_URL=http://localhost:3000
NODE_ENV=development
PORT=5000
```

**Section sources**
- [backend/index.js:24-29](file://backend/index.js#L24-L29)
- [backend/db/db.js:9](file://backend/db/db.js#L9)

## Environment Configuration

### Frontend Configuration
The React app uses Create React App defaults. Development scripts are defined in the root `package.json`:
- `npm start`: Starts the development server on port 3000
- `npm run build`: Creates a production build
- `npm test`: Runs tests in watch mode

**Section sources**
- [README.md:9-30](file://README.md#L9-L30)
- [package.json:17-22](file://package.json#L17-L22)

### Backend Configuration
The backend uses environment variables loaded via dotenv. Key configurations:
- CORS allows requests from the frontend origin
- Database connection uses `MONGODB_URI`
- Logging enabled in development mode
- Health check endpoint available at `/health`

**Section sources**
- [backend/index.js:1](file://backend/index.js#L1)
- [backend/index.js:24-38](file://backend/index.js#L24-L38)
- [backend/index.js:40-48](file://backend/index.js#L40-L48)

## Database Setup

### MongoDB Connection
The backend connects to MongoDB using Mongoose. Ensure your `MONGODB_URI` is valid and reachable.

Connection logic and error handling are implemented in the database module.

**Section sources**
- [backend/db/db.js:7-21](file://backend/db/db.js#L7-L21)

### Seeding Sample Data
Run the seed script to populate the database with sample users and products:
```bash
node seed.js
```

This script creates:
- Two users (one regular, one admin) with predefined credentials
- A set of sample products across various categories

Sample credentials:
- Regular user: user@example.com / User@123456
- Admin user: admin@example.com / Admin@123456

**Section sources**
- [backend/seed.js:209-253](file://backend/seed.js#L209-L253)
- [backend/seed.js:255-258](file://backend/seed.js#L255-L258)
- [backend/API_GUIDE.md:16-24](file://backend/API_GUIDE.md#L16-L24)

## Initial Project Launch

### Start the Backend Server
From the backend directory, start the server in development mode:
```bash
npm run dev
```

This uses nodemon for automatic restarts during development.

**Section sources**
- [backend/package.json:8](file://backend/package.json#L8)

### Start the Frontend Application
From the project root, start the React development server:
```bash
npm start
```

The frontend will open automatically in your browser at http://localhost:3000.

**Section sources**
- [README.md:9-12](file://README.md#L9-L12)
- [package.json:18](file://package.json#L18)

### Verify Database Connection
Check the backend logs for successful MongoDB connection messages. You can also hit the health endpoint:
```
GET http://localhost:5000/health
```

**Section sources**
- [backend/db/db.js:15](file://backend/db/db.js#L15)
- [backend/index.js:40-48](file://backend/index.js#L40-L48)

## Basic Usage Examples

### Authentication Flow
1. Register a new user via the backend API
2. Log in to receive a JWT token
3. Use the token for protected routes (Authorization: Bearer <token>)

Example endpoints:
- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/profile

**Section sources**
- [backend/API_GUIDE.md:30-42](file://backend/API_GUIDE.md#L30-L42)
- [backend/controllers/authController.js:17-47](file://backend/controllers/authController.js#L17-L47)
- [backend/controllers/authController.js:54-94](file://backend/controllers/authController.js#L54-L94)

### Browse Products
The frontend displays a static list of products from local data. Navigate to:
- Home page for featured products
- Products page for the full catalog
- Deals page for discounted items

**Section sources**
- [src/pages/Home/Home.jsx:18-29](file://src/pages/Home/Home.jsx#L18-L29)
- [src/data/products.js:1-100](file://src/data/products.js#L1-L100)

## Verification Checklist

- [ ] Node.js and npm versions meet requirements
- [ ] Frontend dependencies installed (`npm install`)
- [ ] Backend dependencies installed (`cd backend && npm install`)
- [ ] `.env` file created with valid `MONGODB_URI`
- [ ] Backend server starts successfully (port 5000)
- [ ] Frontend opens at http://localhost:3000
- [ ] Database connected (check backend logs)
- [ ] Sample data seeded (users and products created)
- [ ] Health endpoint responds (GET /health)

**Section sources**
- [backend/index.js:78](file://backend/index.js#L78)
- [backend/db/db.js:15](file://backend/db/db.js#L15)
- [backend/seed.js:251-258](file://backend/seed.js#L251-L258)

## Troubleshooting Guide

### Common Issues and Solutions

#### Node.js/npm Version Problems
- Symptom: Installation fails with engine compatibility errors
- Solution: Upgrade to Node.js 18.x or later and npm 8.x or later

#### Port Conflicts
- Symptom: Cannot start frontend/backend on port 3000/5000
- Solution: Change ports in environment variables or stop conflicting applications

#### MongoDB Connection Errors
- Symptom: Backend logs show database connection failures
- Solution: Verify `MONGODB_URI` is correct and network/firewall allows connections

#### CORS Errors in Browser
- Symptom: API calls fail due to CORS policy
- Solution: Ensure `CLIENT_URL` matches frontend origin (http://localhost:3000)

#### Nodemon Not Restarting
- Symptom: Changes don't trigger server restart
- Solution: Install nodemon globally or use `npm run dev` from backend directory

#### Missing Environment Variables
- Symptom: Application crashes with undefined variable errors
- Solution: Create `.env` file in backend directory with required variables

**Section sources**
- [backend/index.js:24-29](file://backend/index.js#L24-L29)
- [backend/db/db.js:17-20](file://backend/db/db.js#L17-L20)
- [backend/package.json:30](file://backend/package.json#L30)

## Development Workflow

### Running Tests
- Frontend tests: `npm test`
- Backend tests: `cd backend && npm test`

### Building for Production
- Frontend: `npm run build`
- Backend: No separate build step (runs as-is)

### Hot Reload
- Frontend: Automatic refresh on file changes
- Backend: Automatic restart via nodemon during development

**Section sources**
- [README.md:17-30](file://README.md#L17-L30)
- [backend/package.json:9](file://backend/package.json#L9)

## Next Steps

### Explore API Endpoints
Review the API documentation for complete endpoint details and examples.

**Section sources**
- [backend/API_GUIDE.md:1-277](file://backend/API_GUIDE.md#L1-L277)

### Customize Application
- Modify frontend components in `src/components` and `src/pages`
- Extend backend routes and controllers in `backend/routes` and `backend/controllers`
- Update database models in `backend/models`

### Deploy
- Frontend: Build and deploy static assets
- Backend: Deploy Node.js application with MongoDB Atlas

[No sources needed since this section provides general guidance]