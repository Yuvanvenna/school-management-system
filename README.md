# 🏛️ Unified National K–10 Institutional School Governance Engine

> **Public Sector & Government-Grade Multi-Tenant School Management Platform**  
> Built for educational institutions from Early Childhood (**Nursery / LKG / UKG**) through Secondary School (**Classes 1–10**) in compliance with national educational board standards (CBSE & State Boards).

---

## 📌 Executive Summary & Project Purpose

Educational governance across K–10 institutions often suffers from severe operational fragmentation—relying on disconnected paper logs, manual attendance sheets, rigid exam-centric tools misapplied to preschoolers, and unverified data transfers.

This platform provides a **unified, secure, multi-tenant digital backbone** designed specifically for government school networks, education directorates, and regional clusters. It guarantees strict **Row-Level Security (RLS)** tenant isolation, immutable audit trails for regulatory compliance, and tailored pedagogical workflows for each age band.

---

## 🏗️ Core Architectural Pillars

### 1. Multi-Tenant Data Isolation (Row-Level Security)
* **Single Database, Multi-Tenant Engine:** Every database table strictly enforces a `schoolId` foreign key.
* **RLS & Query Scoping:** ORM queries and database security policies enforce `WHERE school_id = context.schoolId`. Cross-tenant data leakage is structurally prevented at both API and database layers.

### 2. Differentiated Age-Band Feature Engine
Recognizing that a one-size-fits-all model fails early learners, the system divides workflows into 4 specialized bands:


### 3. Role-Based Access Control (RBAC)
Granular permissions mapped to 7 distinct institutional personas

## ✨ Implemented Core Modules

| Module | Key Functionality | Government & Compliance Standard |
| :--- | :--- | :--- |
| **Institutional Governance** | Live KPI cards: enrollment, faculty ratios, daily attendance %, band distributions. | Directorate-level institutional visibility |
| **Attendance Engine** | Daily & Period-wise roll call, "Mark All Present" quick toggle, exception tracking. | **Compound Duplicate Guard:** `(classId, date, period)` prevents re-entry |
| **Certified Gradebook** | Scaled marks entry, client & server range validation (`obtained <= maxMarks`). | Automatic CBSE 9-Point Scale calculation (`A1` to `E`) & locked publications |
| **Early Years Diary** | Activity diaries, sensory observations, dietary/nap logs, and developmental domains. | Replaces numerical stress with holistic progress |
| **Homework & Materials** | Curricular assignment publishing, due date tracking, and downloadable PDF worksheets. | Centralized academic distribution |
| **Official Report Cards** | Dynamic, printable student progress certificate with national headers and seal. | Format ready for official issuance & PDF print |
| **CSV Roster Ingestion** | Bulk student & teacher onboarding powered by `PapaParse` with duplicate roll rejection. | Fast onboarding of entire student cohorts |
| **Immutable Audit Trail** | Tamper-evident ledger capturing actor ID, timestamp, target entity, and state diffs. | Mandatory compliance & post-publication audit trace |

---

## 🛠️ Technology Stack

* **Frontend:** Next.js (App Router, React, TypeScript)
* **Styling & UI:** Tailwind CSS, Lucide Enterprise Icons, Custom Print Stylesheet
* **Database & ORM:** PostgreSQL + Prisma ORM (with compound keys and foreign key constraints)
* **CSV Processing:** PapaParse
* **Document Engine:** CSS Paged Media / `@react-pdf/renderer` compatible print layout
* **Async Job Queue Ready:** Redis + BullMQ (for peak-hour parent notifications)

---

## 🚀 Quick Start Guide

### Prerequisites
* **Node.js:** v18.0.0 or higher
* **npm:** v9.0.0 or higher

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Yuvanvenna/school-management-system.git
   cd school-management-system


This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
