"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  LoggedCall,
  OUTCOME_META,
  clearLoggedCalls,
  getLoggedCalls,
  seedSampleCalls,
} from "../../lib/calls";

function timeAgo(iso: string): string {
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const h = Math.floor(mins / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function formatDuration(sec: number): string {
  if (sec < 60) return `${sec}s`;
  const m = Math.floor(sec / 60);
  return `${m}m ${sec % 60}s`;
}

export default function AdminPage() {
  const [calls, setCalls] = useState<LoggedCall[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);

  function refresh() {
    setCalls(getLoggedCalls());
  }

  useEffect(() => {
    refresh();
  }, []);

  const answered = calls.length;
  const booked = calls.filter((c) => c.outcome === "booked").length;
  const emergencies = calls.filter((c) => c.outcome === "emergency-escalated").length;
  const followUps = calls.filter((c) => c.followUp).length;

  const stats = [
    ["📞", "Calls answered", answered],
    ["📅", "Bookings created", booked],
    ["🚨", "Emergencies escalated", emergencies],
    ["⚑", "Follow-ups open", followUps],
  ] as const;

  return (
    <main className="min-h-screen bg-slate-100">
      {/* top bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🦷</span>
            <div>
              <p className="font-bold leading-tight">Maplewood Dental</p>
              <p className="text-xs text-slate-500">AI Voice Receptionist · Admin dashboard</p>
            </div>
            <span className="ml-2 text-[11px] font-medium bg-amber-100 text-amber-800 rounded-full px-2.5 py-1">
              CONCEPT DEMO — SIMULATED
            </span>
          </div>
          <Link
            href="/"
            className="text-sm font-medium text-violet-700 hover:underline"
          >
            ← Back to demo
          </Link>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map(([icon, label, value]) => (
            <div
              key={label}
              className="bg-white rounded-2xl border border-slate-200 p-5"
            >
              <div className="text-2xl">{icon}</div>
              <p className="mt-2 text-3xl font-extrabold tabular-nums">{value}</p>
              <p className="text-sm text-slate-500">{label}</p>
            </div>
          ))}
        </div>

        {/* actions */}
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={() => {
              setCalls(seedSampleCalls());
            }}
            className="text-sm font-semibold bg-violet-600 hover:bg-violet-700 text-white rounded-full px-5 py-2.5 transition"
          >
            Load sample data
          </button>
          <button
            onClick={() => {
              clearLoggedCalls();
              setCalls([]);
              setExpanded(null);
            }}
            className="text-sm font-semibold border border-slate-300 hover:border-red-400 hover:text-red-600 rounded-full px-5 py-2.5 transition"
          >
            Clear demo data
          </button>
          <p className="w-full text-xs text-slate-400">
            Calls you complete in the demo simulator are saved here
            automatically (browser storage only). Sample data is fictional.
          </p>
        </div>

        {/* call log */}
        <h2 className="mt-10 text-xl font-bold tracking-tight">Call log</h2>
        {calls.length === 0 ? (
          <div className="mt-4 bg-white rounded-2xl border border-slate-200 p-10 text-center">
            <p className="text-4xl">📭</p>
            <p className="mt-3 font-semibold">No calls yet</p>
            <p className="mt-1 text-sm text-slate-500">
              Run a demo call on the{" "}
              <Link href="/" className="text-violet-700 font-medium hover:underline">
                demo page
              </Link>{" "}
              or load sample data above.
            </p>
          </div>
        ) : (
          <div className="mt-4 bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[720px]">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wider text-slate-400 border-b border-slate-100">
                    <th className="px-5 py-3 font-semibold">Caller</th>
                    <th className="px-5 py-3 font-semibold">When</th>
                    <th className="px-5 py-3 font-semibold">Duration</th>
                    <th className="px-5 py-3 font-semibold">Outcome</th>
                    <th className="px-5 py-3 font-semibold">Follow-up</th>
                    <th className="px-5 py-3 font-semibold">Transcript</th>
                  </tr>
                </thead>
                <tbody>
                  {calls.map((call) => {
                    const meta = OUTCOME_META[call.outcome];
                    const isOpen = expanded === call.id;
                    return (
                      <>
                        <tr
                          key={call.id}
                          className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                        >
                          <td className="px-5 py-3.5">
                            <p className="font-semibold">{call.caller}</p>
                            <p className="text-xs text-slate-400">{call.number}</p>
                          </td>
                          <td className="px-5 py-3.5 text-slate-500">
                            {timeAgo(call.at)}
                          </td>
                          <td className="px-5 py-3.5 text-slate-500 tabular-nums">
                            {formatDuration(call.durationSec)}
                          </td>
                          <td className="px-5 py-3.5">
                            <span
                              className={`inline-block text-xs font-semibold rounded-full px-2.5 py-1 ${meta.classes}`}
                            >
                              {meta.label}
                            </span>
                          </td>
                          <td className="px-5 py-3.5">
                            {call.followUp ? (
                              <span className="inline-block text-xs font-semibold bg-amber-100 text-amber-800 rounded-full px-2.5 py-1">
                                ⚑ Needed
                              </span>
                            ) : (
                              <span className="text-slate-300">—</span>
                            )}
                          </td>
                          <td className="px-5 py-3.5">
                            <button
                              onClick={() =>
                                setExpanded(isOpen ? null : call.id)
                              }
                              className="text-violet-700 font-medium hover:underline text-xs"
                            >
                              {isOpen ? "Hide ▲" : "View ▼"}
                            </button>
                          </td>
                        </tr>
                        {isOpen && (
                          <tr key={`${call.id}-t`} className="bg-violet-50/50">
                            <td colSpan={6} className="px-5 py-4">
                              <div className="space-y-2.5 max-w-3xl">
                                {call.transcript.map((line, i) => (
                                  <div
                                    key={i}
                                    className={`flex flex-col ${
                                      line.speaker === "ai"
                                        ? "items-start"
                                        : line.speaker === "caller"
                                          ? "items-end"
                                          : "items-center"
                                    }`}
                                  >
                                    {line.speaker !== "system" && (
                                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                        {line.speaker === "ai"
                                          ? "🎙 AI Receptionist"
                                          : "📞 Caller"}
                                      </span>
                                    )}
                                    <div
                                      className={`mt-0.5 max-w-[85%] rounded-2xl px-3.5 py-2 text-[13px] leading-relaxed ${
                                        line.speaker === "ai"
                                          ? "bg-violet-600 text-white"
                                          : line.speaker === "caller"
                                            ? "bg-white border border-slate-200 text-slate-800"
                                            : "bg-amber-100 text-amber-800 text-xs"
                                      }`}
                                    >
                                      {line.text}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <p className="mt-8 text-xs text-slate-400 max-w-2xl">
          Concept demo: all calls, names, numbers, and transcripts on this page
          are fictional sample data stored only in this browser. No real
          telephony is connected.
        </p>
      </div>
    </main>
  );
}
