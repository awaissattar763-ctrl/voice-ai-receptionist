import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Maplewood Dental — AI Voice Receptionist Demo",
  description:
    "Concept demo: a simulated AI phone receptionist that answers calls, books appointments, and escalates after-hours emergencies for a fictional clinic.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white text-slate-900">{children}</body>
    </html>
  );
}
