Sesa Trifecta Hub
This repository contains the source code for the Sesa Trifecta Hub, a unified platform integrating three distinct AI-powered applications: Astro Archive, Relic, and Peata. This project serves as a founding engineer-level initiative to build a scalable, secure, and collaborative software ecosystem.

🚀 Project Goals
Unified System: Consolidate three standalone applications into a single, cohesive user experience.

Scalable Infrastructure: Build on a modern tech stack (Next.js, Vercel, Google Cloud Vertex AI) designed for growth.

Professional Workflow: Implement and adhere to industry-standard Git branching, CI/CD pipelines, and secure development practices.

Cost Management: Effectively utilize and monitor Google Cloud credits to ensure a sustainable operational model.

🛠️ Tech Stack
Framework: Next.js with App Router

Language: TypeScript

Styling: Tailwind CSS

AI Platform: Google Cloud Vertex AI (Gemini Models)

Deployment: Vercel

Database: Google Firestore

📦 Getting Started
Prerequisites

Node.js (v18 or later)

pnpm (or npm/yarn)

A Google Cloud project with the Vertex AI API enabled.

Installation

Clone the repository:

git clone [https://github.com/your-username/sesa-trifecta-hub.git](https://github.com/your-username/sesa-trifecta-hub.git)
cd sesa-trifecta-hub

Install dependencies:

pnpm install

Set up your local environment variables by creating a .env.local file and adding the required keys (see .env.example).

Run the development server:

pnpm dev

Open http://localhost:3000 with your browser to see the result.

workflows
This project uses a Gitflow-like branching strategy:

main: Production-ready, stable code. Deploys to production.

develop: Integration branch for features. Deploys to a staging environment.

feature/*: Branches for new features, created from develop.

hotfix/*: Branches for urgent production fixes, created from main.