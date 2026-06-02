# CareerSetu — Full Stack Project

## Project Structure

```
careersetu-project/
├── careersetu-backend/     ← Spring Boot (Java) Backend
└── careersetu-frontend/    ← React + Vite Frontend (with backend integration)
```

---

## 🚀 How to Run

### Backend (IntelliJ IDEA)
1. Open `careersetu-backend/` as a Maven project in IntelliJ IDEA
2. Copy `.env.example` → `.env` and fill in your values
3. Set environment variables (or edit `application.yml` directly):
   - `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`
   - `JWT_SECRET`
   - `GROK_API_KEY`
   - `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`
   - `MAIL_USERNAME`, `MAIL_PASSWORD`
4. Run `CareerSetuApplication.java`
5. Backend runs on **http://localhost:8080**

### Frontend
1. Open terminal in `careersetu-frontend/`
2. Copy `.env.example` → `.env` and set `VITE_API_BASE_URL=http://localhost:8080`
3. Run:
   ```bash
   npm install
   npm run dev
   ```
4. Frontend runs on **http://localhost:5173**

---

## 🔧 Tech Stack
- **Backend:** Java 17, Spring Boot 3, Spring Security, JWT, JPA/Hibernate, MySQL
- **Frontend:** React 18, Vite, React Router, Axios
- **Payments:** Razorpay
- **AI:** Grok API (via backend proxy)
- **Email:** Spring Mail (SMTP)

