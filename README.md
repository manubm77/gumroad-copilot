# Gumroad Copilot 🚀

> **AI-powered revenue intelligence for Gumroad creators.**
> *"You create. Copilot optimizes."*

## The Problem
Gumroad creators make great products but fly blind on business decisions:
- Why did sales drop this week?
- Is my pricing hurting conversions?
- Which products are quietly dying?
- Who are my most valuable customers?

**Gumroad Copilot answers all of that.**

## Features

### 📊 Sales Brain
Connect your Gumroad account and instantly see what's working and what's leaking. Revenue trends, refund spikes, top products — all in one clean dashboard.

### 🏥 Product Health Score
Every product gets a score from 0–100 based on conversion rate, refund rate, revenue trend, and repeat purchases. Know exactly what's hurting each score.

### 💰 AI Pricing Optimizer
Gemini AI analyzes your product category, conversion trends, past discounts, and refund rate — then suggests the optimal price.
> *"Test $24 instead of $29 — projected +18% conversion"*

### 🚀 Launch Assistant
Launching a new product? Copilot generates:
- 3 product title options
- Landing page copy
- Email announcement
- Suggested price + upsell ideas

### 👥 Customer Segmentation
Find your VIP buyers, repeat customers, one-time buyers, and churn risks. Know who generates 80% of your revenue.

### 🚨 Refund Detector
Get alerted when refund rates spike. Know which products are underperforming and why — before it becomes a real problem.

## Stack
| Layer | Tech |
|-------|------|
| Backend | Ruby on Rails 8 |
| Frontend | React 19 + TypeScript |
| Styling | Tailwind CSS v4 |
| AI | Google Gemini API (via Faraday) |
| Auth | Gumroad OAuth2 |
| Database | PostgreSQL |
| Build | esbuild |

## Local Setup

```bash
# Clone the repo
git clone https://github.com/manubm77/gumroad-copilot
cd gumroad-copilot

# Install dependencies
bundle install
npm install

# Setup database
rails db:create db:migrate

# Start the server
bin/dev
```

Visit `http://localhost:3000`

## Environment Variables

```bash
GUMROAD_CLIENT_ID=       # From Gumroad Developer Dashboard
GUMROAD_CLIENT_SECRET=   # From Gumroad Developer Dashboard
GEMINI_API_KEY=          # From Google AI Studio
RAILS_MASTER_KEY=        # From config/master.key
DATABASE_URL=            # PostgreSQL connection URL
RAILS_ENV=production
SECRET_KEY_BASE=         # Run: rails secret
```

## Why I Built This

Gumroad gives creators the infrastructure to sell. But it doesn't tell them **why** things are working or failing. Copilot fills that gap — acting as an AI product strategist for every creator on the platform.

Better creator decisions = more revenue = stronger Gumroad ecosystem.

---

Built by [Manu B.M.](https://github.com/manubm77) • [LinkedIn](https://linkedin.com/in/manu-bm)
