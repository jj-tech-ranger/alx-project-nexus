# Project Nexus: Full-Stack E-commerce PWA

NovaMart is a high-performance, mobile-first Progressive Web Application (PWA) built for modern electronics retail.

Developed as a Senior Software Engineering project.

Architecture:
- Django REST Framework backend
- Next.js 15+ frontend
- Fully decoupled system

---

## 🚀 Live Links

**Frontend (Live App):**  
[https://alx-project-nexus.vercel.app](https://alx-project-nexus-five-pi.vercel.app/)

**Backend API:**  
[https://nexus-app-production-22f4.up.railway.app/api/products/](https://nexus-app-production-22f4.up.railway.app/api/products/)

**Admin Dashboard:**  
https://nexus-app-production-22f4.up.railway.app/admin/

---

## 🛠 Tech Stack

### Frontend
- Framework: Next.js 15+ (App Router)
- Language: TypeScript
- Styling: Tailwind CSS
- UI Components: Shadcn UI, Lucide React
- State Management: React Context API (Cart and Auth)
- Visualization: Recharts (Admin Analytics)
- Deployment: Vercel

### Backend
- Framework: Django 5.0 + Django REST Framework
- Database: PostgreSQL
- Authentication: JWT (JSON Web Tokens)
- Deployment: Railway
- Web Server: Gunicorn

---

## 🏗 Key Features

- PWA Ready: Installable on mobile and desktop with offline support.
- Dynamic Catalog: Real-time product fetching, category filtering, slug-based routing.
- Advanced Admin: Custom analytics dashboard for monitoring sales and inventory.
- Persona Seeding: 15 pre-configured user personas with order histories.
- Responsive Design: Optimized for mobile, tablet, and desktop.

---


## 💻 Local Setup

### Backend

```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py seed_data
python manage.py runserver
```

### Frontend

```bash
cd frontend
npm install
```

Create `.env.local`:

```
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

Start development server:

```bash
npm run dev
```

---

## 👤 Submission Credentials

### Administrative Access
- Username: admin
- Password: admin123

### Test User (Standard)
- Username: alice
- Password: password123

---

## 📂 Project Structure

```plaintext
alx-project-nexus/
├── backend/            # Django REST Framework API
│   ├── core/           # Models, Views, Serializers, Seeding
│   ├── nexus_api/      # Project Settings & WSGI
│   └── requirements.txt
├── frontend/           # Next.js Application
│   ├── app/            # App Router Pages
│   ├── components/     # UI & Custom Components
│   ├── lib/            # API Client & Utilities
│   └── public/         # PWA Manifest & Assets
└── README.md
```

---

## 📜 License

Distributed under the MIT License.

---

## 👩‍💻 Author

JJ (jj-tech-ranger)
