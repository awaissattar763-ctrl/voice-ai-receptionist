# Maplewood Dental — AI Voice Receptionist (Concept Demo)

**Live demo:** https://awaissattar763-ctrl.github.io/voice-ai-receptionist/

A polished **concept demo** of an AI voice receptionist for a small clinic,
built to show prospective clients what an AI phone agent could do for their
business.

**Important: this is a concept demo — the "calls" are scripted transcripts
played back with a typing effect. No live AI voice agent, no Twilio account,
no real phone calls, and no real patient data are involved.** "Maplewood
Dental" is a fictional sample business; it is not a real client.

## What it demonstrates

**Public demo page (`/`)** — a phone-style call simulator where the visitor
picks a scenario and watches a simulated live call play out, with speaker
labels (Caller / AI Receptionist), a live call timer, an animated voice
waveform, and an end-of-call summary card.

- 📅 **Appointment booking** — greeting → slot offer → name/number capture →
  booking confirmation + SMS note
- 🚨 **After-hours emergency** — 9:47 PM call, severe pain + swelling detected
  → on-call dentist paged → urgent slot held → follow-up flagged
- **Architecture section** — an honest, labeled diagram of how this would be
  wired in production (Twilio Voice webhook → Next.js API route → ElevenLabs
  conversational agent → Supabase call logs → Twilio SMS), explicitly marked
  as *not connected* in this demo

**Admin dashboard (`/admin`)** — the clinic owner's view:

- Call log table: caller, time, duration, outcome tags (booked / emergency
  escalated / FAQ handled / answered), follow-up flags
- Expandable transcripts per call
- Stats: calls answered, bookings created, emergencies escalated, open follow-ups
- "Load sample data" / "Clear demo data" buttons
- Calls completed in the simulator are saved to the log automatically

Call logs persist in the browser's `localStorage` (mock storage — no backend).

## How to run

```bash
npm install
npm run dev
```

Then open:

- Public demo → http://localhost:3000
- Admin dashboard → http://localhost:3000/admin

To verify a production build:

```bash
npm run build
```

## Tech

- Next.js 15 (App Router) + React 19 + TypeScript
- Tailwind CSS v4
- Zero backend — scenarios (`lib/calls.ts`) are client-side scripted
  transcripts; storage is `localStorage`

## Turning this into a real product

The demo is deliberately structured so the simulated player can be swapped for
a real one: replace the scripted `SCENARIOS` playback in
`components/CallSimulator.tsx` with a live voice pipeline (Twilio media
streams → ElevenLabs conversational AI), and replace the `localStorage` log in
`lib/calls.ts` with Supabase writes from Next.js API routes. The UI, dashboard,
and escalation logic need no changes.

## File map

| Path | What |
|---|---|
| `app/page.tsx` | Public landing page + call simulator + architecture section |
| `app/admin/page.tsx` | Admin dashboard (call log, transcripts, stats) |
| `components/CallSimulator.tsx` | Phone-style call UI, scripted transcript player |
| `lib/calls.ts` | Scenarios, sample data, mock call-log storage |
| `DEMO-SCRIPT.md` | 60-second walkthrough script for recording a demo video |
