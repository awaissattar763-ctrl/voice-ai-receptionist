import Link from "next/link";
import CallSimulator from "../components/CallSimulator";

const ARCH_STEPS = [
  {
    icon: "📱",
    title: "Caller dials the clinic number",
    body: "A Twilio phone number receives the call — the clinic's real number, answered 24/7.",
    tech: "Twilio Voice",
  },
  {
    icon: "🔗",
    title: "Twilio hits a webhook",
    body: "The incoming call triggers a webhook on the clinic's Next.js API route, which opens a live media stream.",
    tech: "Next.js API route",
  },
  {
    icon: "🎙",
    title: "AI voice agent takes over",
    body: "An ElevenLabs conversational agent speaks with the caller — greeting, booking, answering FAQs, detecting emergencies.",
    tech: "ElevenLabs Agents",
  },
  {
    icon: "🗄",
    title: "Every call is logged",
    body: "Transcripts, outcomes, and bookings are written to Supabase the moment the call ends — staff see it instantly.",
    tech: "Supabase (Postgres)",
  },
  {
    icon: "📲",
    title: "Patient gets confirmation",
    body: "Bookings trigger an SMS confirmation; emergencies page the on-call dentist immediately.",
    tech: "Twilio SMS",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-violet-50 via-white to-white">
      {/* nav */}
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🦷</span>
          <span className="font-bold text-lg tracking-tight">Maplewood Dental</span>
          <span className="ml-2 text-[11px] font-medium bg-amber-100 text-amber-800 rounded-full px-2.5 py-1">
            CONCEPT DEMO — SIMULATED
          </span>
        </div>
        <Link
          href="/admin"
          className="text-sm font-medium text-violet-700 border border-violet-200 rounded-full px-4 py-2 hover:bg-violet-600 hover:text-white hover:border-violet-600 transition"
        >
          View admin dashboard →
        </Link>
      </nav>

      {/* hero */}
      <section className="max-w-6xl mx-auto px-6 pt-10 pb-16 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Your front desk,{" "}
            <span className="text-violet-600">answered by voice AI</span> — even
            at 2 AM.
          </h1>
          <p className="mt-5 text-lg text-slate-600 leading-relaxed">
            Meet <strong>Ava</strong> — an AI voice receptionist for small
            clinics. She picks up every call, books appointments by voice,
            answers common questions, and escalates real emergencies to the
            on-call dentist.
          </p>
          <ul className="mt-6 space-y-3 text-slate-700">
            {[
              ["🎙", "Natural voice conversation — no phone trees, no 'press 1'"],
              ["📅", "Books by voice straight into the schedule, with SMS confirmation"],
              ["🌙", "After-hours emergency detection with instant escalation"],
              ["📊", "Full transcripts and outcomes in one dashboard"],
            ].map(([icon, text]) => (
              <li key={text} className="flex items-start gap-3">
                <span className="text-xl leading-none mt-0.5">{icon}</span>
                <span>{text}</span>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#demo"
              className="bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-full px-7 py-3 transition shadow-lg shadow-violet-600/25"
            >
              Play a demo call ↓
            </a>
            <Link
              href="/admin"
              className="font-semibold rounded-full px-7 py-3 border border-slate-300 hover:border-violet-600 hover:text-violet-700 transition"
            >
              See the dashboard
            </Link>
          </div>
          <p className="mt-6 text-xs text-slate-400 max-w-md">
            This is a concept demo with simulated transcripts — no live AI voice
            agent, no Twilio account, and no real calls are connected.
            Maplewood Dental is a fictional sample business.
          </p>
        </div>

        {/* call simulator */}
        <div id="demo" className="scroll-mt-24">
          <CallSimulator />
        </div>
      </section>

      {/* architecture */}
      <section className="bg-slate-950 text-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto">
            <span className="inline-block text-[11px] font-bold uppercase tracking-[0.2em] bg-amber-400/15 text-amber-300 rounded-full px-4 py-1.5">
              How this would be wired in production
            </span>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight">
              From phone call to dashboard in seconds
            </h2>
            <p className="mt-3 text-slate-400">
              The demo above is simulated. In a real deployment, the same flow
              runs on this stack — none of it is connected here, and no real
              Twilio or ElevenLabs credentials exist in this demo.
            </p>
          </div>

          <div className="mt-12 grid md:grid-cols-5 gap-4">
            {ARCH_STEPS.map((step, i) => (
              <div key={step.title} className="relative">
                <div className="h-full rounded-2xl bg-slate-900 border border-slate-800 p-5">
                  <div className="text-3xl">{step.icon}</div>
                  <p className="mt-3 text-[11px] font-bold uppercase tracking-widest text-violet-300">
                    Step {i + 1}
                  </p>
                  <p className="mt-1 font-semibold text-sm leading-snug">
                    {step.title}
                  </p>
                  <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                    {step.body}
                  </p>
                  <p className="mt-3 inline-block text-[11px] font-mono bg-slate-800 text-violet-200 rounded px-2 py-1">
                    {step.tech}
                  </p>
                </div>
                {i < ARCH_STEPS.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-3.5 -translate-y-1/2 text-violet-500 text-xl z-10">
                    →
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-2xl border border-amber-400/30 bg-amber-400/5 p-6 max-w-3xl mx-auto">
            <p className="text-sm text-amber-200 leading-relaxed">
              <strong>Honest scope note:</strong> wiring this for real means a
              Twilio number + voice webhook, an ElevenLabs conversational agent
              with a clinic knowledge base, Next.js API routes for the call
              logic, and Supabase tables for call logs and bookings. The UI and
              flows in this demo are built to plug into exactly that — swap the
              scripted transcript for the real voice pipeline and the dashboard
              needs no changes.
            </p>
          </div>
        </div>
      </section>

      {/* emergency highlight */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="rounded-3xl bg-gradient-to-br from-red-50 to-amber-50 border border-red-100 p-8 sm:p-12 grid lg:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight">
              The call that matters most happens{" "}
              <span className="text-red-600">after hours</span>.
            </h2>
            <p className="mt-4 text-slate-600 leading-relaxed">
              A patient with severe pain at 9:47 PM doesn't leave a voicemail —
              they call the next clinic on Google. In the demo above, try the
              after-hours emergency scenario: the AI detects the urgency, pages
              the on-call dentist, and holds the first urgent slot for the
              morning.
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
              Simulated escalation timeline
            </p>
            <ul className="mt-4 space-y-4 text-sm">
              {[
                ["0:00", "Call answered after hours — no voicemail"],
                ["0:18", "Emergency keywords detected (pain + swelling)"],
                ["0:20", "On-call dentist paged automatically"],
                ["0:45", "Urgent slot held for tomorrow 8:00 AM"],
                ["≤ 15 min", "Dentist callback — logged in dashboard"],
              ].map(([t, label]) => (
                <li key={t} className="flex gap-4">
                  <span className="font-mono font-bold text-red-600 w-16 shrink-0">
                    {t}
                  </span>
                  <span className="text-slate-700">{label}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-slate-400">
              Illustrative timeline for the simulated scenario — not measured
              data.
            </p>
          </div>
        </div>
      </section>

      {/* footer */}
      <footer className="border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            <span className="font-bold">Maplewood Dental</span> is a fictional
            sample business. Concept demo — all calls, transcripts, and data
            are simulated.
          </p>
          <Link
            href="/admin"
            className="text-sm font-medium text-violet-700 hover:underline"
          >
            Admin dashboard →
          </Link>
        </div>
      </footer>
    </main>
  );
}
