# Servu | Empowering Bulawayo’s Future 🇿🇼

Servu (formerly FixBulawayo) is a local skills and services marketplace that connects residents and SMEs of Bulawayo with verified youth for micro-tasks.

## 🚀 Vision
Built for the 2026 Hackathon, Servu aims to empower local youth with digital visibility, reduce unemployment, and build a rating-based trust system within our community.

## ✨ Key Features
- **SME Portal**: Post tasks, set budgets, and manage hires.
- **Youth Portal**: Build a digital reputation, browse gigs, and manage active tasks.
- **Commitment Lock**: An innovative escrow-backed payment system to ensure fair trade.
- **Offline Ready**: Designed with a "data-light" philosophy for accessibility.

## 🛠️ Technology Stack
- **Frontend**: Next.js 16 (React 19), TailwindCSS 4, Framer Motion.
- **Backend**: Supabase Auth & Realtime Database.
- **Icons**: Lucide React.

## 🏃 Getting Started

### 1. Prerequisites
- Node.js v18+
- A Supabase account

### 2. Setup
```bash
# Clone the repository
git clone <your-repo-url>
cd fixforme

# Install dependencies
npm install

# Configure Environment
# Create a .env.local file in the root directory
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Database Initialization
Run the SQL script located in `supabase/schema.sql` within your Supabase SQL Editor to initialize the tables and security policies.

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to see your local instance.

---
*Built with ❤️ in Bulawayo.*
