# EventHub Platform

**A full-stack event discovery, ticketing, payment, and operations platform built for the complete event lifecycle, from the first search to the final check-in scan.**

EventHub is more than an event listing website. It is an end-to-end digital venue system where audiences discover experiences, reserve seats, pay through QR banking, receive secure tickets, and check in at the gate. Behind the scenes, administrators manage events, artists, seating, orders, refunds, coupons, blogs, AI content workflows, notifications, and operational analytics from one focused dashboard.

The product is designed around a simple idea: an event platform should feel effortless for guests, precise for operators, and reliable when money, seats, and tickets are moving in real time.

## What Makes It Different

- **Complete ticketing flow**: browse events, select seats, create orders, pay, receive QR tickets, and validate attendance.
- **Real operations dashboard**: manage events, categories, artists, ticket types, default seats, orders, refunds, transactions, users, contacts, blogs, and system settings.
- **QR-first admission**: each paid ticket receives a secure token and QR code for fast check-in with duplicate and invalid scan tracking.
- **SePay payment integration**: generate bank-transfer QR payment details, match incoming webhook transactions, and protect seat state during payment confirmation.
- **Seat-state protection**: seats move through available, reserving, booked, and disabled states to reduce double-booking risk.
- **AI-assisted content**: generate blog ideas, draft event-related content, configure models and prompts, and support AI chat sessions.
- **Automated communication**: queue-based email delivery for verification, password recovery, ticket delivery, event reminders, and refund updates.
- **Content and community layer**: blogs, comments, ratings, event likes, saved events, search, contact forms, and user profiles.

## Product Areas

### Public Experience

The public site gives users a polished discovery and booking journey:

- Home page with featured and trending events.
- Event explorer with search, category filters, date filters, and detailed event pages.
- Seat-based booking flow with customer information, order summary, and payment handoff.
- Payment QR, payment success, payment failed, and payment status pages.
- My Tickets and event check-in pages for ticket access, QR display, PDF export, refund requests, and ticket status.
- Blog, blog detail, search, contact, authentication, profile, and saved-event experiences.

### Admin Workspace

The admin area is the command center for event operations:

- Dashboard and notification center.
- Event CRUD, event detail, categories, artists, ticket types, and default seat maps.
- Orders, payment transactions, tickets, refunds, coupons, and check-in logs.
- User management, contact management, site settings, blog management, blog categories, and AI blog configuration.
- Manual and QR-based check-in tools for front-gate staff.

### Backend System

The API powers business logic and operational reliability:

- Express API with validation, rate limiting, centralized responses, and error handling.
- Prisma data model for users, events, seats, orders, tickets, payments, refunds, blogs, comments, AI content, notifications, jobs, and chat sessions.
- Queue worker for asynchronous email and notification jobs.
- Scheduler process for recurring tasks such as pending order expiration, weekly blog generation, and event reminders.
- Static upload serving for event thumbnails, artist avatars, user images, and content assets.

## Tech Stack

### Frontend

- React 19
- Vite
- React Router
- Zustand
- Tailwind CSS
- Mantine UI
- Base UI
- TipTap rich text editor
- Framer Motion / Motion
- Axios
- Firebase client auth
- Recharts
- html5-qrcode

### Backend

- Node.js
- Express 5
- TypeScript
- Prisma 7
- MySQL / MariaDB
- Firebase Admin
- JSON Web Tokens
- Zod
- Nodemailer
- PDFKit
- QRCode
- Node Cron
- AI SDK

## Project Structure

```text
eventhub-platform/
+-- client/                 # React + Vite frontend
|   +-- src/
|   |   +-- components/     # Shared UI and reusable interaction components
|   |   +-- hooks/          # Data and behavior hooks
|   |   +-- layouts/        # Public, auth, and admin layouts
|   |   +-- lib/            # HTTP, Firebase, services, utilities
|   |   +-- pages/          # Public, auth, and admin pages
|   |   +-- routes/         # Route guards
|   |   +-- stores/         # Zustand state
|   |   +-- styles/         # Global and admin styles
|   +-- package.json
|
+-- server/                 # Express + TypeScript backend
|   +-- prisma/             # Prisma schema, migrations, and seed script
|   +-- src/
|   |   +-- controllers/    # Request handlers
|   |   +-- jobs/           # Cron task definitions
|   |   +-- middlewares/    # Auth, validation, upload, response, errors
|   |   +-- queue-jobs/     # Async email and system jobs
|   |   +-- routes/         # API route modules
|   |   +-- schema/         # Zod request schemas
|   |   +-- services/       # Business logic
|   |   +-- utils/          # Prisma, pagination, errors, helpers
|   |   +-- index.ts        # API process
|   |   +-- queue.ts        # Queue worker process
|   |   +-- schedule.ts     # Scheduler process
|   +-- package.json
|
+-- README.md
```

## Getting Started

### Prerequisites

- Node.js
- npm
- MySQL or MariaDB
- Firebase project for Google authentication and admin verification
- SePay account details for QR payment integration
- SMTP mailbox for transactional email
- AI provider credentials if AI content generation is enabled

### 1. Install Dependencies

```bash
cd server
npm install

cd ../client
npm install
```

### 2. Configure Environment Variables

Create `server/.env`:

```env
PORT=8000
NODE_ENV=development

DATABASE_HOST=localhost
DATABASE_USER=root
DATABASE_PASSWORD=your_password
DATABASE_NAME=eventhub

ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d

FRONTEND_URL=http://localhost:5173

MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your_email@example.com
MAIL_PASS=your_mail_app_password

FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_CLIENT_EMAIL=your_firebase_client_email
FIREBASE_PRIVATE_KEY="your_private_key_with_escaped_newlines"

SEPAY_BANK_CODE=your_bank_code
SEPAY_ACCOUNT_NUMBER=your_account_number
SEPAY_ACCOUNT_NAME=your_account_name

OPENAI_API_KEY=your_ai_provider_key
```

Create `client/.env.development`:

```env
VITE_API_URL=http://localhost:8000

VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### 3. Prepare the Database

```bash
cd server
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

### 4. Run the Platform

Start the API:

```bash
cd server
npm run dev
```

Start the queue worker in a second terminal:

```bash
cd server
npm run queue
```

Start the scheduler in a third terminal:

```bash
cd server
npm run schedule
```

Start the frontend:

```bash
cd client
npm run dev
```

The frontend runs on `http://localhost:5173` by default, while the API runs on `http://localhost:8000`.

## Useful Scripts

### Client

```bash
npm run dev       # Start Vite development server
npm run build     # Build production frontend
npm run lint      # Run ESLint
npm run format    # Format files with Prettier
npm run preview   # Preview production build
```

### Server

```bash
npm run dev              # Start API with ts-node-dev
npm run queue            # Start async job worker
npm run schedule         # Start scheduled cron process
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Run development migrations
npm run prisma:deploy    # Deploy migrations
npm run prisma:studio    # Open Prisma Studio
npm run prisma:seed      # Seed database
```

## API Surface

All backend routes are mounted under `/api`.

```text
/api/health
/api/auth
/api/users
/api/events
/api/categories
/api/artists
/api/seats
/api/ticket-types
/api/tickets
/api/orders
/api/payment
/api/payment-transactions
/api/refunds
/api/coupons
/api/check-ins
/api/search
/api/blogs
/api/blog-categories
/api/blog-ideas
/api/ai-content-config
/api/ai-chat
/api/comments
/api/contacts
/api/notifications
/api/app-settings
/api/admin/dashboard
```

Uploaded assets are served from `/uploads`.

## Data Model Highlights

EventHub's Prisma schema is organized around the real objects of event operations:

- **Users and auth**: users, roles, local credentials, Google provider IDs, email verification, refresh tokens, and password reset tokens.
- **Events and seats**: categories, artists, event-artist roles, ticket types, default seats, event-specific seats, and event status.
- **Commerce**: orders, order seats, payment transactions, coupons, tickets, refunds, and seat release behavior.
- **Admission**: ticket QR secure tokens, check-in state, and check-in logs for valid, duplicate, and invalid scans.
- **Content**: blogs, blog categories, blog ideas, AI content configuration, comments, ratings, and images.
- **Operations**: notifications, site settings, banners, reminder logs, queue jobs, and chat sessions.

## System Flow

```text
User discovers event
        |
User selects seats and creates an order
        |
Seats are reserved while payment is pending
        |
SePay QR payment is generated
        |
Payment webhook confirms transaction
        |
Order becomes paid and seats become booked
        |
Tickets are generated with secure QR tokens
        |
Queue worker sends ticket email
        |
Staff scans QR at event check-in
        |
System records valid, duplicate, or invalid scan
```

## Development Notes

- Keep the API, queue worker, and scheduler as separate processes during development. They serve different operational responsibilities.
- The backend uses centralized response and error middleware, so controllers should delegate business rules to services and return clean results.
- Seat and payment logic should be treated as high-risk code because it controls money, inventory, and ticket validity.
- Do not commit real secrets. Keep Firebase, SMTP, SePay, database, JWT, and AI keys in environment files only.

## Vision

EventHub is built as a serious event platform, not a demo shell. It connects discovery, commerce, content, automation, and admission into one coherent system. The goal is to make every event easier to launch, easier to sell, easier to manage, and easier to enter.
