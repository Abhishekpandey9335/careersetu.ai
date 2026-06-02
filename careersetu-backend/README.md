# CareerSetu Backend

> **India's AI-Powered Career Operating System** — Spring Boot + PostgreSQL + JWT

---

## Tech Stack

| Layer | Technology |
|---|---|
| Language | Java 17 |
| Framework | Spring Boot 3.2 |
| Security | Spring Security + JWT (jjwt 0.11.5) |
| Database | PostgreSQL 16 |
| ORM | Spring Data JPA / Hibernate |
| API Docs | SpringDoc OpenAPI 3 (Swagger UI) |
| AI | Grok API (x.ai) or OpenAI GPT-4o |
| Payments | Razorpay |
| Scheduler | Spring `@Scheduled` |
| Build | Maven 3.9 |
| Container | Docker + Docker Compose |

---

## Project Structure

```
src/main/java/com/careersetu/
├── CareerSetuApplication.java
├── config/
│   ├── AppConfig.java          — Jackson, RestTemplate beans
│   ├── DataSeeder.java         — Seeds admin + 10 exams + 5 companies on startup
│   ├── OpenApiConfig.java      — Swagger / OpenAPI 3
│   └── SecurityConfig.java     — JWT filter chain, CORS, role-based access
├── controller/                 — REST controllers (one per domain)
├── dto/                        — Request/Response objects (no entity exposure)
├── entity/                     — JPA entities
├── exception/
│   ├── ApiResponse.java        — Uniform JSON wrapper
│   ├── BadRequestException.java
│   ├── GlobalExceptionHandler.java
│   └── ResourceNotFoundException.java
├── repository/                 — Spring Data JPA repositories
├── scheduler/
│   └── DeadlineReminderScheduler.java  — Daily notifications + premium expiry
├── security/
│   ├── JwtAuthFilter.java
│   ├── JwtUtil.java
│   └── UserDetailsServiceImpl.java
├── service/                    — Business logic layer
└── util/
    └── SecurityUtil.java       — getCurrentEmail() from SecurityContext
```

---

## API Endpoints

Base path: `/api`

### Authentication — `/api/auth`
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/auth/register` | Public | Register new user |
| POST | `/auth/login` | Public | Login, get JWT tokens |
| POST | `/auth/refresh` | Public | Refresh access token (pass refresh in `X-Refresh-Token` header) |

### Homepage — `/api/home`
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/home` | Public | All homepage data in one call |

### Exams — `/api/exams`
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/exams` | Public | Search & filter exams (`?category=SSC&status=FORM_OPEN&search=CGL&page=0&size=20`) |
| GET | `/exams/{slug}` | Public | Full exam details with syllabus, salary, selection process |
| POST | `/exams/eligibility-check` | Public | Get eligible exams for given age, qualification, stream |
| POST | `/exams` | Admin | Create exam |
| PATCH | `/exams/{id}/status` | Admin | Update exam status |

### Jobs — `/api/jobs`
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/jobs` | Public | Search jobs (`?type=PRIVATE&location=Bengaluru&salaryMin=5`) |
| GET | `/jobs/{id}` | Public | Get job details |
| POST | `/jobs` | Admin | Create job listing |
| DELETE | `/jobs/{id}` | Admin | Delete job listing |

### Companies — `/api/companies`
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/companies` | Public | Search companies (`?industry=IT&search=TCS`) |
| GET | `/companies/{slug}` | Public | Company detail with prep info. Pass JWT for readiness score. |
| POST | `/companies` | Admin | Create company |

### Study Materials — `/api/study-materials`
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/study-materials` | Public | Browse (`?examId=1&type=PYQ&premium=false`) |
| GET | `/study-materials/{id}` | Public | Download (premium check if material is locked) |
| POST | `/study-materials` | Admin | Upload material |
| DELETE | `/study-materials/{id}` | Admin | Delete material |

### Roadmaps — `/api/roadmaps`
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/roadmaps` | Public | Popular roadmaps |
| GET | `/roadmaps/{slug}` | Public | Roadmap by slug |
| GET | `/roadmaps/exam/{examId}` | Public | Roadmaps for an exam |

### AI Career Advisor — `/api/ai`
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/ai/chat` | User | Chat with AI. Pass `conversationId` to continue a thread. |
| POST | `/ai/roadmap` | User | Generate personalised roadmap for exam/goal |
| GET | `/ai/skill-gap?targetRole=` | User | Skill gap analysis for a role |
| GET | `/ai/conversations` | User | Saved conversation history (last 20) |
| DELETE | `/ai/conversations/{id}` | User | Delete a conversation |

### User Profile — `/api/users`
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/users/me` | User | Get current user profile |
| PUT | `/users/me` | User | Update profile (skills, goal, age, stream, etc.) |
| PATCH | `/users/me/resume` | User | Update resume URL |

### Application Tracker — `/api/applications`
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/applications` | User | All tracked applications |
| POST | `/applications/jobs/{jobId}` | User | Track a job application |
| POST | `/applications/exams/{examId}` | User | Track an exam application |
| PATCH | `/applications/{id}/status` | User | Update status (APPLIED → SHORTLISTED → SELECTED etc.) |
| DELETE | `/applications/{id}` | User | Remove tracked application |

### Notifications — `/api/notifications`
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/notifications` | User | Paginated notifications |
| GET | `/notifications/unread-count` | User | Count of unread |
| PATCH | `/notifications/mark-all-read` | User | Mark all read |
| PATCH | `/notifications/{id}/read` | User | Mark one read |

### Subscriptions — `/api/subscriptions`
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/subscriptions/order` | User | Create Razorpay order (`plan: MONTHLY / YEARLY`) |
| POST | `/subscriptions/verify` | User | Verify payment and activate premium |
| GET | `/subscriptions/history` | User | Subscription history |

### Admin — `/api/admin`
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/admin/stats` | Admin | Platform stats (users, exams, subscriptions) |

---

## Quick Start (Local)

### Prerequisites
- Java 17+
- Maven 3.9+
- PostgreSQL 16 running locally (or use Docker)
- Git

### 1 — Clone and configure
```bash
git clone https://github.com/your-org/careersetu-backend.git
cd careersetu-backend
cp .env.example .env
# Edit .env with your DB credentials and API keys
```

### 2 — Run with Docker (recommended)
```bash
# Starts PostgreSQL + Spring Boot app
docker compose up --build
```

### 3 — Run locally (without Docker)
```bash
# Make sure PostgreSQL is running and careersetu DB exists
createdb careersetu

# Export env vars (or set in IDE run config)
export DB_URL=jdbc:postgresql://localhost:5432/careersetu
export JWT_SECRET=careersetu-super-secret-jwt-key-minimum-256-bits!!
export AI_PROVIDER=grok
export GROK_API_KEY=xai-your-key-here

# Run
mvn spring-boot:run
```

### 4 — Verify
```
API:         http://localhost:8080/api
Swagger UI:  http://localhost:8080/api/swagger-ui.html
```

**Seeded credentials:**
- Admin: `admin@careersetu.in` / `Admin@123`

---

## Authentication Flow

```
POST /api/auth/register  →  { accessToken, refreshToken }
POST /api/auth/login     →  { accessToken, refreshToken }

All protected requests:
Authorization: Bearer <accessToken>

When accessToken expires (24h):
POST /api/auth/refresh
X-Refresh-Token: <refreshToken>   →  { new accessToken }
```

---

## Subscription Plans

| Plan | Price | Duration |
|---|---|---|
| MONTHLY | ₹99 | 30 days |
| YEARLY | ₹799 | 365 days |

**Flow:**
1. `POST /subscriptions/order` → get Razorpay `orderId` + `amount`
2. Open Razorpay checkout on frontend with the orderId
3. On success, `POST /subscriptions/verify` with `razorpayOrderId`, `razorpayPaymentId`, `razorpaySignature`
4. Backend verifies HMAC signature → activates premium

---

## Scheduled Jobs

| Job | Schedule | Description |
|---|---|---|
| Deadline Reminders | Daily 8:00 AM | Notifies all users about exam forms closing in 3 days |
| New Form Openings | Daily 9:00 AM | Notifies users when an exam form opens today |
| Premium Expiry | Daily midnight | Marks expired premium users as free |

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `DB_URL` | Yes | PostgreSQL JDBC URL |
| `DB_USERNAME` | Yes | DB username |
| `DB_PASSWORD` | Yes | DB password |
| `JWT_SECRET` | Yes | HS256 signing key (min 32 chars) |
| `AI_PROVIDER` | No | `grok` (default) or `openai` |
| `GROK_API_KEY` | For AI | x.ai Grok API key |
| `OPENAI_API_KEY` | For AI | OpenAI API key (if using OpenAI) |
| `RAZORPAY_KEY_ID` | For payments | Razorpay key ID |
| `RAZORPAY_KEY_SECRET` | For payments | Razorpay key secret |
| `MAIL_USERNAME` | For email | Gmail address |
| `MAIL_PASSWORD` | For email | Gmail App Password |
| `CORS_ORIGINS` | No | Comma-separated allowed origins |

---

## Database Schema (Key Tables)

```
users              — id, name, email, password_hash, role, is_premium, premium_expiry
user_profiles      — user_id, age, qualification, stream, state, category, skills[], goal
exams              — id, name, slug, category, vacancy, form_start, form_end, status
exam_details       — exam_id, syllabus_json, selection_process_json, salary_json, books_json
companies          — id, name, slug, industry, avg_package_fresher
company_prep       — company_id, dsa_level, required_skills[], interview_process_json
jobs               — id, company_id, title, type, salary_min, salary_max, skills_required[]
study_materials    — id, title, exam_id, type, file_url, is_premium, downloads_count
roadmaps           — id, title, slug, exam_id, duration_weeks, plan_json
user_applications  — id, user_id, job_id, exam_id, status
notifications      — id, user_id, type, title, message, is_read
subscriptions      — id, user_id, plan, amount, start_date, end_date, razorpay_payment_id
ai_conversations   — id, user_id, title, messages_json
```

---

## Roadmap (Phase 2+)

- [ ] Email notifications via SendGrid / JavaMailSender
- [ ] Resume builder — PDF generation (iText)
- [ ] Full-text search via PostgreSQL `tsvector` (no Elasticsearch needed in Phase 1)
- [ ] Bulk CSV import for seeding 1000+ exams
- [ ] Rate limiting on AI endpoints (per-user daily quota)
- [ ] Admin panel APIs (user management, content moderation)
- [ ] Vernacular support (Hindi responses from AI)

---

*Built with ❤️ for India's 300M+ students.*
