# 🚀 QRIFY Deployment Guide (Render)

This guide will help you deploy the QRIFY application using **Render** (Free Tier).

## Prerequisites
- A [Render](https://render.com/) account.
- Your code pushed to GitHub: [https://github.com/JatinVerma24/QRIFYBYJATIN](https://github.com/JatinVerma24/QRIFYBYJATIN)
- A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster.

---

## Step 1: Deploy the Backend (Web Service)

1.  Log in to Render and click **New +** > **Web Service**.
2.  Connect your GitHub repository.
3.  Configure the service:
    - **Name:** `qrify-backend`
    - **Root Directory:** `backend`
    - **Runtime:** `Node`
    - **Build Command:** `npm install`
    - **Start Command:** `npm start`
4.  **Environment Variables**:
    - `PORT`: `10000` (Render default)
    - `MONGO_URI`: `your_mongodb_connection_string`
    - `JWT_SECRET`: `your_random_secret_key`
    - `CLIENT_URL`: `https://qrify-frontend.onrender.com` (Update this after deploying frontend)
5.  Click **Create Web Service**.

---

## Step 2: Deploy the Frontend (Static Site)

1.  On Render, click **New +** > **Static Site**.
2.  Connect your GitHub repository.
3.  Configure the site:
    - **Name:** `qrify-frontend`
    - **Root Directory:** `frontend`
    - **Build Command:** `npm install && npm run build`
    - **Publish Directory:** `dist`
4.  **Environment Variables**:
    - `VITE_API_URL`: `https://qrify-backend.onrender.com` (The URL of your deployed backend)
5.  Click **Create Static Site**.

---

## Step 3: Final Configuration

1.  Go back to your **Backend Service** settings on Render.
2.  Update the `CLIENT_URL` environment variable to match your **Frontend URL**.
3.  In MongoDB Atlas, ensure you allow access from "anywhere" (`0.0.0.0/0`) since Render IPs change, or check Render's documentation for static outgoing IPs.

---

## Done! 
Your app should now be live 🚀
- **Frontend:** `https://qrify-frontend.onrender.com`
- **Backend API:** `https://qrify-backend.onrender.com`
