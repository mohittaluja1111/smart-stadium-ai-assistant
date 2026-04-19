# 🏟️ Smart Stadium AI Assistant

<p align="center">
  <b>Enhancing Stadium Experiences with Real-Time AI Insights</b><br/>
  <i>Optimizing crowd movement, reducing wait times, and enabling smarter decisions</i>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Frontend-React-blue?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Backend-FastAPI-green?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Deployment-Vercel%20%7C%20Render-black?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Status-Live-success?style=for-the-badge" />
</p>

---

## 🎥 **Live Demo**

- 🌐 **Frontend:** https://smart-stadium-ai-assistant-bzh4-5jd9y3jg6.vercel.app/ 
- 🔗 **Backend API:** https://smart-stadium-backend.onrender.com/
- https://smart-stadium-backend.onrender.com/crowd
- https://smart-stadium-backend.onrender.com/wait-time
- https://smart-stadium-backend.onrender.com/alerts

> ⚠️ *Note: Backend is hosted on Render free tier and may take a few seconds to respond initially due to cold start.*

---

## 📸 **Screenshots**

<img width="1910" height="960" alt="dashboard_1" src="https://github.com/user-attachments/assets/a64de70e-4d57-495f-a044-31f5b92d4b85" />
<img width="1908" height="962" alt="dashboard_2" src="https://github.com/user-attachments/assets/a90774bd-8b31-44e8-8159-9484a74985d3" />

---

## 📌 **1. Chosen Vertical**

**Smart Infrastructure & Event Experience Optimization**

This project addresses key challenges in **large-scale sporting venues**, where managing thousands of attendees efficiently is critical.

### 🎯 Focus Areas:
- Reducing **crowd congestion**
- Minimizing **waiting times**
- Improving **real-time coordination**
- Enhancing overall **fan experience**

---

## 🧠 **2. Approach & Logic**

The system is designed as a **real-time intelligent decision-making solution** that continuously monitors and optimizes stadium conditions.

### 🔍 Core Approach
- Simulate real-time stadium data using backend APIs  
- Analyze crowd density and wait times  
- Generate actionable insights  
- Continuously update the interface  

### ⚙️ Logic Flow

Data Collection → Analysis → Insight Generation → User Action

### 🧩 Key Components

- **Crowd Density Engine**  
  Classifies zones into Low / Medium / High  

- **Wait-Time Estimator**  
  Predicts queue durations for facilities  

- **Alert System**  
  Detects and notifies overcrowding  

- **AI Recommendation Engine**  
  Suggests optimal gates, routes, and services  

---

## ⚙️ **3. How the Solution Works**

### 🖥️ Backend (FastAPI)
- Provides APIs:
  - `/crowd` → Zone-wise density  
  - `/wait-time` → Queue estimates  
  - `/alerts` → Real-time alerts  
- Generates dynamic simulated data  
- Enables seamless frontend communication  

---

### 🌐 Frontend (React)
- Fetches backend data every few seconds  
- Displays:
  - 📊 Live Dashboard  
  - 🗺️ Crowd Heatmap  
  - ⏱️ Wait Times  
  - 🤖 AI Recommendations  
  - 🚨 Alerts  

---

### 🔄 System Workflow

1. Backend generates dynamic data  
2. Frontend fetches data periodically  
3. UI updates in real-time  
4. Users receive actionable insights  

---

### 🚀 Deployment

- **Frontend:** Vercel  
- **Backend:** Render  

---

## ⚠️ **4. Assumptions Made**

- Data is **simulated** (no real IoT integration)  
- Crowd density categorized as **Low / Medium / High**  
- Wait times are **estimated**  
- Users follow system recommendations  
- Stable internet connectivity is available  

---

<p align="center">
  🚀 <b>Demonstrating how AI can transform real-world stadium experiences</b>
</p>

---

## 👨‍💻 **Author**

**Mohit Taluja**
