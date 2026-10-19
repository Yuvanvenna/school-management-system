import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Unified National School Management & Governance Portal | K-10 Institutional Platform",
  description: "Enterprise Multi-Tenant School Management Engine with Row-Level Security, Attendance Verification, Early Years Milestone Tracking, and Certified Academic Grading.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-slate-100/70 text-slate-900">{children}</body>
    </html>
  );
}
