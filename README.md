# 🏥 VitalMind.ai — Healthcare Management Platform
> INFO 6150 Web Design Final Project

## Live Demo
🌐 **Frontend**: https://vitalmind-ai-blush.vercel.app/
🔧 **API**: https://vitalmind-ai-e9xn.onrender.com/api
📖 **Swagger Docs**: https://vitalmind-ai-e9xn.onrender.com/api/docs/

## Demo Credentials
| Role | Email | Password |
|------|-------|----------|
| 🏥 Admin | admin@vitalmind.ai | Admin@123 |
| 👨‍⚕️ Doctor | doctor@vitalmind.ai | Doctor@123 |
| 👤 Patient | patient@vitalmind.ai | Patient@123 |

## Tech Stack
| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + React Router v6 + Bootstrap 5 |
| Backend | Node.js + Express.js (MVC pattern) |
| Database | MongoDB Atlas + Mongoose |
| Auth | JWT + bcrypt + Google OAuth 2.0 (Passport.js) |
| AI Chatbot | Anthropic Claude API |
| Payments | Stripe (sandbox/test mode) |
| File Upload | Multer (local storage, 10MB limit, type validation) |
| API Docs | Swagger UI at /api/docs |
| Deployment | Vercel (frontend) + Render (backend) |

## Features
- ✅ 3 user roles: Admin (Hospital), Doctor, Patient
- ✅ JWT authentication + bcrypt password hashing
- ✅ Google OAuth 2.0 sign-in
- ✅ Appointment booking with Stripe payment (sandbox)
- ✅ Digital prescription system (multi-medication)
- ✅ Medical records with file upload (Multer, type + size validated)
- ✅ AI health chatbot (Anthropic Claude API)
- ✅ Swagger API documentation (all endpoints)
- ✅ Role-based access control on all API routes
- ✅ Responsive design (mobile-friendly)
- ✅ Beautiful landing page with features, testimonials, CTA

## Transaction Flows
### Patient (3 flows)
1. Login → Browse Doctors → Book Appointment → Stripe Payment → Confirmation
2. Login → View Appointments → Cancel Appointment
3. Login → View Prescriptions → Read medications + follow-up

### Doctor (3 flows)
1. Login → View Appointments → Confirm/Complete → Add Doctor Notes
2. Login → Write Prescription → Select Patient → Add Medications → Save
3. Login → Manage Schedule → Toggle Slots → Set Consultation Fee

### Admin (3 flows)
1. Login → Manage Users → Approve Pending Doctor → Delete User
2. Login → View All Appointments → Filter by Status
3. Login → Upload Medical Record → Select Patient → Attach File

## Installation
```bash
# Clone
git clone https://github.com/YOUR_USERNAME/vitalmind-ai.git

# Backend
cd server
npm install
cp .env.example .env   # fill in your API keys
node seed.js            # seed demo users
node app.js

# Frontend (new terminal)
cd client
npm install
npm run dev
```

## Git Branching Strategy
- `main` — production-ready code
- `develop` — integration branch
- `feature/backend` — backend + core frontend (Apurva Raj)
- `feature/patient` — patient portal (Jam)
- `feature/doctor` — doctor portal (Harshitha)
- `feature/admin` — admin portal + deployment (Gowri)

## API Documentation
All REST endpoints documented with Swagger UI at `/api/docs`.
Key endpoints:
- `POST /api/auth/register` — Register new user
- `POST /api/auth/login` — Login, returns JWT
- `GET /api/auth/google` — Google OAuth
- `GET /api/appointments` — Get user appointments
- `POST /api/appointments` — Book appointment
- `POST /api/payments/create-intent` — Stripe payment intent
- `POST /api/prescriptions` — Create prescription
- `POST /api/records` — Upload medical record (multipart)
- `POST /api/chat` — AI chatbot message

## Deviations from Requirements
None — all requirements fully implemented.