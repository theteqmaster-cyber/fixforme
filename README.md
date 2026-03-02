# fixforme
a site for people with problems and people who can fix them


PROJECT PROPOSAL
FixBulawayo – A Local Skills & Services Marketplace
1. Executive Summary

Project Name: FixBulawayo
Location Focus: Bulawayo
Type: Local Service Marketplace (Web App – Phase 1 Demo)

FixBulawayo is a web-based platform that connects residents of Bulawayo with verified local service providers such as plumbers, electricians, carpenters, welders, and technicians.

The platform aims to:

Empower local youth with practical skills

Reduce unemployment

Make it easy for residents to find trusted help

Build a rating-based trust system within communities

2. Problem Statement

Bulawayo faces two major challenges:

Skilled youths cannot find jobs despite training.

Residents struggle to find reliable service providers quickly.

Currently:

Services are found through word-of-mouth

No structured review system

No digital job board for local trades

Trust is informal and risky

3. Proposed Solution

A localized web platform where:

👤 Customer Flow

User visits site

Searches “plumber”

Sees:

Profile photo

Ratings ⭐

Reviews

Location

Availability

Clicks Hire

Service provider receives job request

After completion → customer rates service

🔧 Service Provider Flow

Register / Login

Set:

Skill category

Location (e.g. Pumula, Nkulumane, CBD)

Availability status

View job requests

Accept / Decline

Build rating & reputation

4. Target Users (Bulawayo Focus)
Customers

Homeowners

Landlords

Small businesses

Students renting rooms

Service Providers

Trained youth (plumbing, electrical, carpentry)

Informal skilled workers

College graduates

Artisans from vocational training centers

5. Key Features (Phase 1 – Demo)

Search by service

Filter by rating

Profile pages

Star rating system

Simple hire request

Provider dashboard

Mobile responsive design

6. Revenue Model (Future)

Small service fee per booking (2–5%)

Featured provider listings

Local ads

Premium verified badge

7. Social Impact

Youth empowerment

Digital visibility for informal workers

Trust-based service ecosystem

Economic stimulation within Bulawayo communities

8. Implementation Roadmap
Phase	Focus	Status
Phase 1	React Frontend Demo	Start Now
Phase 2	Node.js Backend	After UI
Phase 3	Database (MongoDB/Postgres)	Later
Phase 4	Authentication + Payments	Production
🚀 NOW LET’S BUILD THE DEMO (Frontend Focus – React)

You said: React frontend first. JS backend later. Demo only.
Perfect. That’s the right approach.

🏗️ STEP-BY-STEP: HOW TO BUILD IT
🥇 STEP 1 – Create React App

If using Vite (recommended):

npm create vite@latest fixbulawayo
cd fixbulawayo
npm install
npm run dev
🥈 STEP 2 – Folder Structure
src/
 ├── components/
 │     ├── Navbar.jsx
 │     ├── ServiceCard.jsx
 │     ├── RatingStars.jsx
 │     ├── ProviderDashboard.jsx
 │
 ├── pages/
 │     ├── Home.jsx
 │     ├── SearchResults.jsx
 │     ├── Profile.jsx
 │
 ├── data/
 │     ├── mockProviders.js
 │
 ├── App.jsx
 └── main.jsx
🥉 STEP 3 – Mock Data (No DB Yet)

Create mockProviders.js

export const providers = [
  {
    id: 1,
    name: "Tawanda Plumbing",
    service: "Plumber",
    rating: 4.8,
    reviews: 21,
    location: "Nkulumane",
    available: true
  },
  {
    id: 2,
    name: "Bright Sparks Electrical",
    service: "Electrician",
    rating: 4.5,
    reviews: 12,
    location: "Pumula",
    available: false
  }
];

This simulates your database.

🧩 STEP 4 – Service Card Component

Shows:

Name

Rating

Location

Hire Button

🔍 STEP 5 – Search Functionality

In Home.jsx:

Add input field

Filter mock data:

const filtered = providers.filter(p =>
  p.service.toLowerCase().includes(searchTerm.toLowerCase())
);

Render ServiceCard components.

⭐ STEP 6 – Rating Component

Create star UI:

{Array.from({ length: 5 }, (_, i) => (
  <span key={i}>
    {i < Math.round(rating) ? "⭐" : "☆"}
  </span>
))}
👷 STEP 7 – Provider Dashboard

Simple demo page:

Show job requests (hardcoded)

Button: Accept / Reject

🎨 STEP 8 – Make It Look Clean

Install Tailwind:

npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

Add modern clean UI:

Cards with shadows

Green “Available” badge

Smooth hover animations

🧠 After Demo – Backend Plan (Node + Express)

Later:

npm init -y
npm install express cors

Create:

GET /providers

POST /hire

POST /login

But not now — focus on UI first.

💡 MVP Pages You Must Have

Landing Page

Search Results Page

Provider Profile

Provider Dashboard

Login/Register (simple UI only)

🌍 Future Vision

Imagine later:

Geo-location services

WhatsApp integration

EcoCash / mobile money integration

Verified badges

Community ranking

Bro this can scale beyond Bulawayo to:

Gweru

Harare

Victoria Falls

But start local. Dominate one city first.
