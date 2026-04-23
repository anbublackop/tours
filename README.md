# YatraSathi — Tours & Travel Booking Platform

A full-stack travel booking web application for browsing, booking, and managing tour packages. Built with FastAPI and React, containerised with Docker.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Running the App](#running-the-app)
- [Database Migrations](#database-migrations)
- [Exposing Locally via ngrok](#exposing-locally-via-ngrok)
- [Payment Integration (Razorpay)](#payment-integration-razorpay)
- [Email (Password Reset)](#email-password-reset)
- [Admin Panel](#admin-panel)
- [API Reference](#api-reference)
- [Pages & Routes](#pages--routes)

---

## Features

### For Users
- Browse tour packages by country and category
- Search packages by name, destination, location, or category
- View detailed package pages with itinerary, hotels, transport options, and add-ons
- Book packages with travel date, number of members, hotel & transport selection
- Pay securely via Razorpay (cards, UPI, NetBanking, wallets)
- View booking history and booking details from a personal dashboard
- Cancel bookings
- Submit enquiries for custom packages
- Forgot password / reset password via email link
- Multilingual UI support (i18n)

### For Admins
- Full admin dashboard at `/admin`
- Create, edit, archive, and delete tour packages
- Manage destinations and categories
- View and manage all bookings across all users
- View all enquiries submitted by users
- Cancel any booking

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui, Framer Motion |
| Backend | FastAPI, SQLAlchemy (ORM), Alembic (migrations), PostgreSQL |
| Auth | JWT — short-lived access tokens + rotating refresh tokens |
| Payments | Razorpay (orders API + HMAC-SHA256 signature verification) |
| Email | SMTP via Gmail (password reset) |
| Infrastructure | Docker, Docker Compose, nginx (reverse proxy + static files) |
| Tunneling | ngrok (optional, for exposing local app publicly) |

---

## Project Structure

```
tours/
├── backend/
│   ├── app/
│   │   ├── api/v1/          # Route handlers (auth, packages, bookings, payments, …)
│   │   ├── core/            # Config, security, email utilities
│   │   ├── db/              # Database session & base
│   │   ├── models/          # SQLAlchemy models
│   │   └── schemas/         # Pydantic request/response schemas
│   ├── alembic/             # Database migrations
│   ├── .env                 # Environment variables (not committed)
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── pages/           # All page components
│   │   ├── components/      # Shared UI components
│   │   ├── context/         # Auth context
│   │   ├── lib/             # API client, utilities
│   │   └── types/           # TypeScript types
│   └── nginx.conf           # nginx config (static files + API proxy)
├── docker-compose.yml
└── ngrok.yml
```

---

## Getting Started

### Prerequisites

- [Docker](https://www.docker.com/) and Docker Compose
- A [Razorpay account](https://razorpay.com) (free)
- A Gmail account with an App Password (for password reset emails — optional)

### 1. Configure environment

Fill in `backend/.env` (see [Environment Variables](#environment-variables) for the full reference):

```env
DATABASE_URL=postgresql://postgres:mysecretpassword@postgres_db:5432/tours_and_travels
SECRET_KEY=your-secret-key-at-least-32-characters-long

RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxx

SMTP_USER=your@gmail.com
SMTP_PASSWORD=your-16-char-app-password
SMTP_FROM=your@gmail.com

FRONTEND_URL=http://localhost
```

---

## Running the App

```bash
# Build and start all services (backend, frontend, postgres)
docker compose up -d --build

# View logs
docker compose logs -f

# Stop everything
docker compose down
```

The app will be available at **http://localhost**.
The backend API is available at **http://localhost:8000**.
Interactive API docs (Swagger UI): **http://localhost:8000/docs**

---

## Database Migrations

Migrations run automatically on container start via `alembic upgrade head`.

To run manually:

```bash
docker compose exec api alembic upgrade head
```

To create a new migration after changing a model:

```bash
docker compose exec api alembic revision --autogenerate -m "describe your change"
docker compose exec api alembic upgrade head
```

---

## Exposing Locally via ngrok

The app includes an ngrok service for sharing your local app publicly (useful for testing payments or showing the app on a mobile device).

### Setup

1. Sign up at [ngrok.com](https://ngrok.com) and get your auth token
2. Add it to your environment or a `.env` file at the project root:

```env
NGROK_AUTHTOKEN=your_ngrok_auth_token
```

3. Start ngrok alongside the app:

```bash
docker compose up -d
```

4. View the public URL at **http://localhost:4040** (ngrok dashboard)

5. Update `FRONTEND_URL` in `backend/.env` to your ngrok URL so password reset links work correctly:

```env
FRONTEND_URL=https://xxxx.ngrok-free.app
```

> The nginx config proxies all `/api/` requests internally to the backend, so only one ngrok tunnel is needed for the frontend.

---

## Payment Integration (Razorpay)

### Getting your API keys

1. Sign up at [dashboard.razorpay.com](https://dashboard.razorpay.com)
2. Go to **Settings → API Keys → Generate Key**
3. Copy the **Key ID** and **Key Secret**
4. Add them to `backend/.env`:

```env
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxx
```

5. Rebuild the backend:

```bash
docker compose build api && docker compose up -d api
```

### How the payment flow works

1. User fills in booking details on the Checkout page and clicks **Pay**
2. Frontend calls `POST /api/v1/payments/create-order`
3. Backend creates a Razorpay order and a `pending` booking in the database, returns the order ID and amount
4. The Razorpay checkout modal opens in the browser
5. User completes payment via card / UPI / NetBanking / wallet
6. Razorpay sends a payment signature back to the frontend handler
7. Frontend calls `POST /api/v1/payments/verify` with the signature
8. Backend verifies the HMAC-SHA256 signature — if valid, booking is marked `confirmed` and `paid`
9. User is redirected to their dashboard

### Testing payments (Test Mode)

Use test keys (`rzp_test_...`) during development — no real money is charged.

**Test card:**
| Field | Value |
|---|---|
| Card Number | `4111 1111 1111 1111` |
| Expiry | Any future date (e.g. `12/26`) |
| CVV | Any 3 digits |
| OTP | `1234` |

**Test UPI ID:** `success@razorpay`

### Going live

1. Complete KYC on the Razorpay dashboard
2. Replace test keys with live keys (`rzp_live_...`) in `backend/.env`
3. Rebuild and redeploy

---

## Email (Password Reset)

The app sends password reset links via SMTP. Gmail is the recommended provider.

### Gmail setup

1. Enable **2-Step Verification** on your Google account
2. Go to **Google Account → Security → App passwords**
3. Create an app password for "Mail"
4. Add to `backend/.env`:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@gmail.com
SMTP_PASSWORD=xxxx xxxx xxxx xxxx
SMTP_FROM=your@gmail.com
FRONTEND_URL=https://your-domain-or-ngrok-url
```

> If `SMTP_USER` is left empty, the reset link is printed to the backend container logs instead — useful for local development.

---

## Admin Panel

The admin panel is available at `/admin` and is accessible only to users with `is_admin = 1`.

### Default admin credentials

Set via environment variables (auto-seeded on first startup):

```env
ADMIN_EMAIL=admin@yatrasathi.com
ADMIN_PASSWORD=Admin@YatraSathi2024
ADMIN_NAME=Super Admin
```

### Admin capabilities

- **Packages** — create, edit, archive/unarchive, delete packages with full details (title, price, duration, itinerary, hotels, transport, add-ons, images)
- **Destinations** — add and manage travel destinations
- **Categories** — manage package categories
- **Bookings** — view all bookings across all users, cancel any booking
- **Enquiries** — view all customer enquiries

---

## API Reference

Base URL: `http://localhost:8000/api/v1`
Full interactive docs: `http://localhost:8000/docs`

### Auth

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/auth/login` | — | Login with email + password, returns JWT tokens |
| POST | `/auth/refresh` | — | Exchange refresh token for new access token |
| POST | `/auth/logout` | ✓ | Revoke all refresh tokens for current user |
| POST | `/auth/forgot-password` | — | Send password reset email (rate limited: 5/min) |
| POST | `/auth/reset-password` | — | Reset password using token from email |

### Users

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/users/register` | — | Register a new user account |
| GET | `/users/me` | ✓ | Get current user profile |
| GET | `/users` | Admin | List all users |

### Packages

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/packages` | — | List packages. Query params: `search`, `destination_slug`, `category_slug`, `limit` |
| GET | `/packages/:id` | — | Get full package details |
| POST | `/packages` | Admin | Create a new package |
| PUT | `/packages/:id` | Admin | Update a package |
| DELETE | `/packages/:id` | Admin | Delete a package |

### Destinations

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/destinations` | — | List all destinations |
| POST | `/destinations` | Admin | Create a destination |
| PUT | `/destinations/:id` | Admin | Update a destination |
| DELETE | `/destinations/:id` | Admin | Delete a destination |

### Categories

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/categories` | — | List all categories |
| POST | `/categories` | Admin | Create a category |
| PUT | `/categories/:id` | Admin | Update a category |
| DELETE | `/categories/:id` | Admin | Delete a category |

### Bookings

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/bookings/my` | ✓ | List current user's bookings |
| GET | `/bookings/:id` | ✓ | Get a single booking (own or any if admin) |
| PUT | `/bookings/:id/cancel` | ✓ | Cancel a booking |
| GET | `/bookings` | Admin | List all bookings |

### Payments

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/payments/create-order` | ✓ | Create Razorpay order + pending booking |
| POST | `/payments/verify` | ✓ | Verify payment signature + confirm booking |

### Reviews

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/reviews` | — | List reviews (filterable by package) |
| POST | `/reviews` | ✓ | Submit a review |

### Enquiries

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/enquiries` | — | Submit a customer enquiry |
| GET | `/enquiries` | Admin | List all enquiries |

---

## Pages & Routes

| Route | Access | Description |
|---|---|---|
| `/` | Public | Homepage — featured packages, destinations, categories |
| `/packages` | Public | All packages with search, country & category filters |
| `/packages/:country` | Public | Packages filtered by country |
| `/package/:id` | Public | Full package detail page |
| `/about` | Public | About page |
| `/enquiry` | Public | Contact & enquiry form |
| `/login` | Public | Login page |
| `/register` | Public | Registration page |
| `/forgot-password` | Public | Request password reset email |
| `/reset-password` | Public | Set new password via token |
| `/dashboard` | Auth | User dashboard — bookings overview & stats |
| `/booking/:id` | Auth | Booking detail page |
| `/checkout` | Auth | Checkout & payment page |
| `/admin` | Admin | Admin dashboard |

---

## Environment Variables Reference

| Variable | Required | Default | Description |
|---|---|---|---|
| `DATABASE_URL` | Yes | — | PostgreSQL connection string |
| `SECRET_KEY` | Yes | — | JWT signing secret (min 32 chars) |
| `ALGORITHM` | No | `HS256` | JWT algorithm |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | No | `15` | Access token lifetime |
| `REFRESH_TOKEN_EXPIRE_DAYS` | No | `7` | Refresh token lifetime |
| `RAZORPAY_KEY_ID` | For payments | — | Razorpay Key ID |
| `RAZORPAY_KEY_SECRET` | For payments | — | Razorpay Key Secret |
| `SMTP_HOST` | No | — | SMTP server (e.g. `smtp.gmail.com`) |
| `SMTP_PORT` | No | `587` | SMTP port |
| `SMTP_USER` | No | — | SMTP login email |
| `SMTP_PASSWORD` | No | — | SMTP password / app password |
| `SMTP_FROM` | No | `noreply@yatrasathi.com` | From address for emails |
| `FRONTEND_URL` | Yes | `http://localhost:80` | Base URL of the frontend (used in email links) |
| `ADMIN_EMAIL` | No | `admin@yatrasathi.com` | Seeded admin email |
| `ADMIN_PASSWORD` | No | `Admin@YatraSathi2024` | Seeded admin password |
| `ADMIN_NAME` | No | `Super Admin` | Seeded admin display name |
| `NGROK_AUTHTOKEN` | No | — | ngrok auth token (for public tunneling) |
