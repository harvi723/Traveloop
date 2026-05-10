# Traveloop

Traveloop is an AI-powered travel planning platform developed for the Odoo Hackathon. The application helps users create personalized multi-city travel itineraries with intelligent recommendations, real-time collaboration, budget tracking, activity discovery, and interactive trip management.

The platform is designed to provide a modern and premium travel planning experience inspired by products like Airbnb, Google Travel, Notion, and Apple Maps.

---

# Features

## Authentication
- Login and Signup
- JWT-based authentication
- Form validation using Zod and React Hook Form
- Protected routes and session handling

## Dashboard
- Personalized user dashboard
- Upcoming trips overview
- Popular destinations
- Budget insights
- AI-powered recommendations

## Trip Management
- Create, edit, and delete trips
- Multi-city itinerary planning
- Add travel dates and activities
- Upload trip cover images
- Public/private trip visibility

## Itinerary Builder
- Day-wise travel planning
- Drag-and-drop itinerary structure
- Activity scheduling
- Route organization
- Notes and reminders

## City & Activity Discovery
- Search cities and destinations
- Explore activities and attractions
- Filter by category, cost, and duration
- Hidden gems recommendations

## Budget Analytics
- Expense tracking
- Cost breakdown
- Daily budget analysis
- Charts and analytics using Recharts

## Packing Checklist
- Add and manage packing items
- Categorized checklist
- Packing progress tracking

## Trip Journal
- Daily notes and reminders
- Trip memories and journal entries
- Timestamped notes

## Shared Trips
- Public itinerary sharing
- Read-only shared trip pages
- Clone and remix itineraries

## Real-Time Collaboration
- Live itinerary editing
- Shared trip planning
- Real-time updates using Firebase and WebSockets

## AI Features
- AI itinerary generation
- AI budget optimization
- AI packing assistant
- AI travel recommendations
- AI chatbot assistant

---

# Tech Stack

## Frontend
- Next.js 15
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Framer Motion
- Zustand
- TanStack Query

## Backend
- Node.js
- Express.js
- FastAPI
- Prisma ORM
- PostgreSQL
- Redis
- Firebase
- Socket.IO

---

# Database

Main database entities:
- Users
- Trips
- Itineraries
- Activities
- Expenses
- Packing Lists
- Journals
- Notifications
- Shared Trips
- AI Recommendations

Database is designed using Prisma ORM with relational architecture and optimized queries.

---

# UI/UX Highlights

- Responsive design for desktop, tablet, and mobile
- Glassmorphism UI
- Smooth animations and transitions
- Interactive maps and timelines
- Modern dashboard layouts
- Dark and light theme support

---

# Folder Structure

```bash
src/
├── app/
├── components/
├── features/
├── hooks/
├── services/
├── store/
├── prisma/
├── lib/
├── utils/
└── styles/
```

---

# APIs & Integrations

- OpenAI API
- Mapbox / Google Maps
- Firebase Realtime Database
- Cloudinary
- Unsplash API
- Weather APIs

---

# Security Features

- JWT authentication
- Protected API routes
- Secure environment variables
- Input validation
- Session management

---

# Deployment

The project is deployment-ready using:
- Vercel
- Docker
- PostgreSQL
- Firebase
- Redis

---

# Future Enhancements

- Voice-controlled trip planning
- AI-generated travel stories
- Offline itinerary mode
- Carbon footprint tracking
- Advanced travel analytics
- Community trip marketplace

---

# Team Goal

The goal of Traveloop is to simplify travel planning through AI, real-time collaboration, immersive UI/UX, and intelligent automation while delivering a startup-grade product experience.