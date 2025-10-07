# Assessment

A full-stack web application with **React (Vite + TypeScript)** frontend, **Express + TypeScript** backend, and **MySQL** database, deployed on **AWS** with **NGINX** reverse proxy.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Technologies Used](#technologies-used)
- [Architecture](#architecture)
- [Features](#features)
- [Folder Structure](#folder-structure)
- [Setup & Deployment](#setup--deployment)
- [Security Considerations](#security-considerations)
- [Future Scope](#future-scope)

---

## Project Overview

This project demonstrates a **full-stack application** with user authentication, role-based access, and API communication between frontend and backend. It was developed with a focus on functionality rather than production-level security.

---

## Technologies Used

- **Frontend**: React, Vite, TypeScript, Mantine UI, Yarn
- **Backend**: Node.js, Express, TypeScript
- **Database**: MySQL (Dockerized)
- **Server**: NGINX (Reverse Proxy)
- **Deployment**: AWS EC2
- **Security & Auth**: JWT access tokens, password hashing (bcrypt)

---

## Architecture

```
[Frontend React (Vite + TS)]
           |
           | HTTP API Calls
           v
[Backend Express + TS] --> [MySQL DB (Docker)]
           |
           v
[NGINX Reverse Proxy]
           |
           v
[AWS EC2 Deployment]
```

---

## Features

### Backend

- **Express + TypeScript**
- **Routes, Controllers, Services** structure for clean architecture
- **Authentication & Authorization**
  - JWT **access tokens** for authentication
  - **Role-based access control** using decorators
  - Passwords stored with **bcrypt hashing**

### Frontend

- **React + Vite + TypeScript**
- **Mantine UI** for components
- **Token Storage**:
  - Stored in **localStorage** as `time_constraint`
  - Demo considered using **HTTP-only cookies**
- Clean folder structure with components, pages, contexts
- **Yarn** used for package management

### Database

- **MySQL running as a Docker container**

### Deployment

- Backend and frontend deployed on **AWS EC2**
- **NGINX reverse proxy** for API routing
- Port **5000 open** for API communication

---

## Folder Structure

### Backend

```
/backend
├── controllers
├── decorators
├── routes
├── services
├── utils
└── app.ts
```

### Frontend

```
/frontend
├── src
│   ├── components
│   ├── pages
│   ├── contexts
│   ├── hooks
│   └── App.tsx
└── vite.config.ts
```

---

## Setup & Deployment

### 1. Database

```bash
docker run --name mysql-db -e MYSQL_ROOT_PASSWORD=yourpassword -p 3306:3306 -d mysql:8
```

### 2. Backend

```bash
cd backend
npm install
npm run build
npm start
```

### 3. Frontend

```bash
cd frontend
yarn install
yarn dev
```

### 4. NGINX

- Configure reverse proxy to forward `/api` requests to backend port 5000

### 5. AWS Deployment

- EC2 instance running NGINX and serving frontend + backend
- Open port 5000 for API communication

---

## Security Considerations

- Current implementation **not production-grade secure**
- Tokens stored in `localStorage` (vulnerable to XSS)
- No rate-limiting or input sanitization applied
- Minimal validation on backend

---

## Future Scope

- Use **HTTP-only cookies** for token storage
- Implement proper **input sanitization and validation**
- Add **rate-limiting** and **CORS** security enhancements
- Production-grade deployment with **SSL** and **firewall rules**
- Containerize entire stack using **Docker Compose**
- Automated **CI/CD pipeline** for easier updates

---

## Notes

- Dev server was deployed as prod to save time; production deployment requires extra security and optimizations.
- Focused on functionality and architecture, security and production hardening left for future work.
