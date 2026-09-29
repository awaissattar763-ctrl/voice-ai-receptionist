// Concept demo data layer: scripted call scenarios + mock call-log storage.
// Everything here is SIMULATED. No real telephony, no live AI voice agent,
// no real patient data. "Maplewood Dental" is a fictional sample business.

export type Speaker = "ai" | "caller" | "system";

export interface CallLine {
  speaker: Speaker;
  text: string;
  // how long (ms) this line "plays" before the next line starts
  dwellMs: number;
}

export interface CallScenario {
  id: string;
  title: string;
  description: string;
  icon: string;
  // simulated call metadata
  callerName: string;
  callerNumber: string;
  startedAtLabel: string;
  lines: CallLine[];
  summary: {
    outcome: CallOutcome;
    outcomeLabel: string;
    detail: string;
    followUp: boolean;
    followUpNote?: string;
  };
}

export type CallOutcome =
  | "booked"
  | "emergency-escalated"
  | "faq"
  | "voicemail-avoided";

const BOOKING_LINES: CallLine[] = [
  {
    speaker: "ai",
    text: "Thank you for calling Maplewood Dental. This is Ava, the AI receptionist. How can I help you today?",
    dwellMs: 2600,
  },
  {
    speaker: "caller",
    text: "Hi, I'd like to book a cleaning for next week.",
    dwellMs: 1400,
  },
  {
    speaker: "ai",
    text: "Of course — I can do that right now. For a cleaning we have Tuesday at 10:30 AM or Thursday at 2:15 PM. Which works better for you?",
    dwellMs: 2800,
  },
  {
    speaker: "caller",
    text: "Tuesday at 10:30 works.",
    dwellMs: 1200,
  },
  {
    speaker: "ai",
    text: "Great. May I have your full name and a mobile number for the confirmation text?",
    dwellMs: 2200,
  },
  {
    speaker: "caller",
    text: "Sarah Miller, 555-014-2288.",
    dwellMs: 1300,
  },
  {
    speaker: "ai",
    text: "Thanks, Sarah. You're booked for a cleaning on Tuesday at 10:30 AM with Dr. Patel. I've sent a confirmation text to 555-014-2288. Anything else I can help with?",
    dwellMs: 3000,
  },
  {
    speaker: "caller",
    text: "That's all, thanks!",
    dwellMs: 1000,
  },
  {
    speaker: "system",
    text: "Call ended · Booking saved · SMS confirmation queued",
    dwellMs: 0,
  },
];

const EMERGENCY_LINES: CallLine[] = [
  {
    speaker: "ai",
    text: "You've reached Maplewood Dental after hours. This is Ava, the AI receptionist. If this is a life-threatening emergency, please hang up and call 911. Otherwise, how can I help?",
    dwellMs: 3200,
  },
  {
    speaker: "caller",
    text: "I have really bad tooth pain and my cheek is swelling up.",
    dwellMs: 1500,
  },
  {
    speaker: "ai",
    text: "I'm sorry you're dealing with that. Severe pain with swelling can be urgent, so I'm flagging this as an emergency and connecting you to our on-call dentist right now. Please stay on the line.",
    dwellMs: 3000,
  },
  {
    speaker: "system",
    text: "Emergency detected · On-call dentist paged · Call flagged URGENT",
    dwellMs: 1800,
  },
  {
    speaker: "ai",
    text: "The on-call dentist has been notified and will call you back within 15 minutes at this number. I've also reserved the first urgent slot tomorrow at 8:00 AM for you. Is there anything else you need right now?",
    dwellMs: 3000,
  },
  {
    speaker: "caller",
    text: "No, thank you — I'll wait for the call.",
    dwellMs: 1200,
  },
  {
    speaker: "system",
    text: "Call ended · Escalation logged · Urgent slot held for tomorrow 8:00 AM",
    dwellMs: 0,
  },
];

export const SCENARIOS: CallScenario[] = [
  {
    id: "booking",
    title: "Appointment booking",
    description: "A routine daytime call: the AI books a cleaning in under a minute.",
    icon: "📅",
    callerName: "Sarah Miller",
    callerNumber: "(555) 014-2288",
    startedAtLabel: "Tue 10:42 AM",
    lines: BOOKING_LINES,
    summary: {
      outcome: "booked",
      outcomeLabel: "Appointment booked",
      detail: "Cleaning · Tue 10:30 AM · Dr. Patel · SMS confirmation sent",
      followUp: false,
    },
  },
  {
    id: "emergency",
    title: "After-hours emergency",
    description:
      "A 9:47 PM call: the AI detects severe pain + swelling and escalates to the on-call dentist.",
    icon: "🚨",
    callerName: "James Carter",
    callerNumber: "(555) 309-7712",
    startedAtLabel: "Tue 9:47 PM",
    lines: EMERGENCY_LINES,
    summary: {
      outcome: "emergency-escalated",
      outcomeLabel: "Emergency escalated",
      detail: "On-call dentist paged · Urgent slot held Wed 8:00 AM · Callback within 15 min",
      followUp: true,
      followUpNote: "Confirm the dentist reached the patient; release or confirm the urgent slot.",
    },
  },
];

// ---------------------------------------------------------------------------
// Mock call log (localStorage). Sample data only — nothing real.
// ---------------------------------------------------------------------------

export interface LoggedCall {
  id: string;
  at: string; // ISO string
  caller: string;
  number: string;
  durationSec: number;
  outcome: CallOutcome;
  followUp: boolean;
  transcript: { speaker: Speaker; text: string }[];
}

const STORAGE_KEY = "voice-ai-receptionist-demo-calls-v1";

export function getLoggedCalls(): LoggedCall[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as LoggedCall[]) : [];
  } catch {
    return [];
  }
}

function saveLoggedCalls(calls: LoggedCall[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(calls));
}

export function logCall(call: LoggedCall) {
  const calls = getLoggedCalls();
  calls.unshift(call);
  saveLoggedCalls(calls);
}

export function clearLoggedCalls() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}

function hoursAgoIso(h: number): string {
  return new Date(Date.now() - h * 3600 * 1000).toISOString();
}

export function seedSampleCalls(): LoggedCall[] {
  const samples: LoggedCall[] = [
    {
      id: "sample-1",
      at: hoursAgoIso(3),
      caller: "Priya Nair",
      number: "(555) 882-4109",
      durationSec: 74,
      outcome: "booked",
      followUp: false,
      transcript: [
        { speaker: "ai", text: "Thank you for calling Maplewood Dental. This is Ava. How can I help?" },
        { speaker: "caller", text: "Do you have anything for a checkup this Friday?" },
        { speaker: "ai", text: "Yes — Friday at 11:00 AM or 3:40 PM. Which do you prefer?" },
        { speaker: "caller", text: "11 works." },
        { speaker: "ai", text: "Booked for Friday at 11:00 AM. Confirmation text is on its way." },
      ],
    },
    {
      id: "sample-2",
      at: hoursAgoIso(14),
      caller: "Tom Becker",
      number: "(555) 201-6634",
      durationSec: 96,
      outcome: "emergency-escalated",
      followUp: true,
      transcript: [
        { speaker: "ai", text: "You've reached Maplewood Dental after hours. This is Ava." },
        { speaker: "caller", text: "My crown just fell off and it's bleeding a little." },
        { speaker: "ai", text: "I'm flagging this as urgent and paging the on-call dentist now. They'll call back within 15 minutes." },
        { speaker: "caller", text: "Okay, thank you." },
      ],
    },
    {
      id: "sample-3",
      at: hoursAgoIso(26),
      caller: "Linda Osei",
      number: "(555) 774-9021",
      durationSec: 48,
      outcome: "faq",
      followUp: false,
      transcript: [
        { speaker: "ai", text: "Thank you for calling Maplewood Dental. This is Ava. How can I help?" },
        { speaker: "caller", text: "What are your Saturday hours?" },
        { speaker: "ai", text: "We're open Saturdays 9 AM to 2 PM. Would you like to book?" },
        { speaker: "caller", text: "Not today, just checking. Thanks!" },
      ],
    },
    {
      id: "sample-4",
      at: hoursAgoIso(49),
      caller: "Unknown",
      number: "(555) 410-3378",
      durationSec: 31,
      outcome: "voicemail-avoided",
      followUp: false,
      transcript: [
        { speaker: "ai", text: "Thank you for calling Maplewood Dental. This is Ava. How can I help?" },
        { speaker: "caller", text: "Oh — I didn't expect a person. Do you take Delta insurance?" },
        { speaker: "ai", text: "Yes, we accept Delta Dental. Anything I can book for you?" },
        { speaker: "caller", text: "I'll call back later." },
      ],
    },
  ];
  saveLoggedCalls(samples);
  return samples;
}

export const OUTCOME_META: Record<
  CallOutcome,
  { label: string; classes: string }
> = {
  booked: { label: "Booked", classes: "bg-emerald-100 text-emerald-800" },
  "emergency-escalated": { label: "Emergency escalated", classes: "bg-red-100 text-red-800" },
  faq: { label: "FAQ handled", classes: "bg-slate-200 text-slate-700" },
  "voicemail-avoided": { label: "Answered (no voicemail)", classes: "bg-violet-100 text-violet-800" },
};
