# 🧠 AI Financial Dashboard

A full-stack AI-powered financial dashboard that enables users to generate insightful charts and future performance predictions using natural language queries.

## 📂 Project Structure

```
AI-FINANCIAL-DASHBOARD/
├── backend/     # FastAPI server, MongoDB queries, LLM integration (Replicate, Prophet)
├── frontend/    # Vite + React frontend with dynamic chart rendering
└── README.md
```

---

## 🚀 Features

- 📊 **Natural Language Charting** – Generate charts via LLM (Meta LLaMA) based on custom queries.
- 🔮 **Sales Forecasting** – Predict future performance (sales/profit) using Prophet.
- 🧠 **AI Insight Generation** – Get one-line business recommendations from LLM based on historical and forecasted data.
- 🌐 **Full-stack Integration** – Seamless connection between MongoDB, FastAPI, and a modern React dashboard.

---

## 🛠️ Tech Stack

- **Frontend**: Vite + React + TypeScript + Tailwind CSS
- **Backend**: FastAPI + Pydantic + Python + Prophet + Replicate API
- **Database**: MongoDB (seeded from a cleaned Kaggle dataset)
- **AI Tools**: Meta LLaMA via Replicate, Facebook Prophet for forecasting

---

## 📈 Dataset

Sourced from Kaggle:  
[Company Financials Dataset](https://www.kaggle.com/code/rajatraj0502/company-financials-dataset/)

- Cleaned using Pandas
- Uploaded to MongoDB as `company_financials`

---

## 🧪 Local Setup

```bash
# Backend
cd backend
python -m venv .venv
source .venv/bin/activate  # or .venv\Scripts\activate on Windows
pip install -r requirements.txt
cp .env.example .env
uvicorn main:app --reload

# Frontend
cd frontend
npm install
npm run dev
```

Make sure MongoDB is running and `.env` contains:

```env
MONGODB_URI=mongodb://localhost:27017/
REPLICATE_API_TOKEN=your_token_here
```

---


## 🧠 Inspiration

This project demonstrates the power of combining LLMs with structured data and predictive analytics to create interactive and intelligent dashboards.

---

## 📬 Contact

Created with ❤️ by Shoaib Kalawant
Feel free to reach out or contribute!
