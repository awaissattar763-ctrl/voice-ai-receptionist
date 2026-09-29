"use client";

import { useEffect, useRef, useState } from "react";
import {
  CallLine,
  CallScenario,
  SCENARIOS,
  Speaker,
  logCall,
} from "../lib/calls";

type Phase = "idle" | "dialing" | "live" | "ended";

interface ShownLine {
  speaker: Speaker;
  text: string;
}

function formatTimer(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function Waveform({ active }: { active: boolean }) {
  const bars = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  return (
    <div className="flex items-center justify-center gap-1 h-8" aria-hidden>
      {bars.map((i) => (
        <span
          key={i}
          className={`w-1 rounded-full bg-violet-400 ${active ? "wave-bar" : "scale-y-[0.25]"}`}
          style={{
            height: "100%",
            animationDelay: `${(i % 6) * 0.12}s`,
            animationDuration: `${0.7 + (i % 4) * 0.15}s`,
          }}
        />
      ))}
    </div>
  );
}

function SpeakerLabel({ speaker }: { speaker: Speaker }) {
  if (speaker === "ai")
    return (
      <span className="text-[10px] font-bold uppercase tracking-widest text-violet-600">
        🎙 AI Receptionist
      </span>
    );
  if (speaker === "caller")
    return (
      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
        📞 Caller
      </span>
    );
  return null;
}

export default function CallSimulator() {
  const [scenarioId, setScenarioId] = useState(SCENARIOS[0].id);
  const scenario: CallScenario =
    SCENARIOS.find((s) => s.id === scenarioId) ?? SCENARIOS[0];

  const [phase, setPhase] = useState<Phase>("idle");
  const [shown, setShown] = useState<ShownLine[]>([]);
  const [aiTyping, setAiTyping] = useState(false);
  const [aiSpeaking, setAiSpeaking] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [runId, setRunId] = useState(0);

  const timers = useRef<number[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  function clearTimers() {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  }

  function later(ms: number, fn: () => void) {
    timers.current.push(window.setTimeout(fn, ms));
  }

  useEffect(() => {
    return () => clearTimers();
  }, []);

  // auto-scroll transcript
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [shown, aiTyping]);

  // call timer while live
  useEffect(() => {
    if (phase !== "live") return;
    const iv = window.setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => window.clearInterval(iv);
  }, [phase]);

  function startCall() {
    clearTimers();
    setShown([]);
    setAiTyping(false);
    setAiSpeaking(false);
    setElapsed(0);
    setPhase("dialing");

    // simulate ~1.2s of ringing, then connect
    later(1300, () => {
      setPhase("live");
      playLines(scenario.lines, 0);
    });
    setRunId((r) => r + 1);
  }

  function playLines(lines: CallLine[], idx: number) {
    if (idx >= lines.length) {
      finishCall();
      return;
    }
    const line = lines[idx];

    if (line.speaker === "system") {
      later(500, () => {
        setShown((s) => [...s, { speaker: line.speaker, text: line.text }]);
        playLines(lines, idx + 1);
      });
      return;
    }

    if (line.speaker === "ai") {
      // AI "thinks", then speaks with waveform
      setAiTyping(true);
      later(700, () => {
        setAiTyping(false);
        setAiSpeaking(true);
        setShown((s) => [...s, { speaker: line.speaker, text: line.text }]);
        later(line.dwellMs, () => {
          setAiSpeaking(false);
          playLines(lines, idx + 1);
        });
      });
    } else {
      // caller line appears quickly
      later(450, () => {
        setShown((s) => [...s, { speaker: line.speaker, text: line.text }]);
        later(line.dwellMs, () => playLines(lines, idx + 1));
      });
    }
  }

  function finishCall() {
    const transcript = shown.map((l) => ({ speaker: l.speaker, text: l.text }));
    logCall({
      id: `demo-${Date.now()}`,
      at: new Date().toISOString(),
      caller: scenario.callerName,
      number: scenario.callerNumber,
      durationSec: elapsed,
      outcome: scenario.summary.outcome,
      followUp: scenario.summary.followUp,
      transcript,
    });
    setPhase("ended");
  }

  function reset(newScenarioId?: string) {
    clearTimers();
    if (newScenarioId) setScenarioId(newScenarioId);
    setPhase("idle");
    setShown([]);
    setAiTyping(false);
    setAiSpeaking(false);
    setElapsed(0);
  }

  const summary = scenario.summary;

  return (
    <div className="w-full max-w-md mx-auto">
      {/* scenario picker */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        {SCENARIOS.map((s) => (
          <button
            key={s.id}
            onClick={() => phase !== "live" && phase !== "dialing" && reset(s.id)}
            disabled={phase === "live" || phase === "dialing"}
            className={`text-left rounded-2xl border p-4 transition ${
              s.id === scenarioId
                ? "border-violet-500 bg-violet-50 shadow-md shadow-violet-100"
                : "border-slate-200 bg-white hover:border-violet-300"
            } ${phase === "live" || phase === "dialing" ? "opacity-60" : ""}`}
          >
            <div className="text-2xl">{s.icon}</div>
            <div className="mt-1 font-semibold text-sm">{s.title}</div>
            <div className="mt-1 text-xs text-slate-500 leading-relaxed">
              {s.description}
            </div>
          </button>
        ))}
      </div>

      {/* phone frame */}
      <div className="rounded-[2rem] bg-slate-950 p-3 shadow-2xl shadow-violet-900/20">
        <div className="rounded-[1.6rem] bg-white overflow-hidden">
          {/* call header */}
          <div className="bg-gradient-to-b from-violet-600 to-violet-700 text-white px-5 pt-6 pb-5 text-center">
            <div className="flex items-center justify-center gap-2">
              <span
                className={`inline-block w-2.5 h-2.5 rounded-full ${
                  phase === "live" || phase === "dialing"
                    ? "bg-red-400 live-dot"
                    : "bg-white/40"
                }`}
              />
              <span className="text-[11px] font-bold uppercase tracking-[0.2em]">
                {phase === "idle" && "Ready"}
                {phase === "dialing" && "Calling…"}
                {phase === "live" && "Live call"}
                {phase === "ended" && "Call ended"}
              </span>
            </div>
            <p className="mt-3 font-bold text-lg">Maplewood Dental</p>
            <p className="text-violet-200 text-sm">
              {scenario.callerName} · {scenario.callerNumber}
            </p>
            <p className="mt-1 text-violet-100 font-mono text-sm tabular-nums">
              {formatTimer(elapsed)}
            </p>
            <div className="mt-3">
              <Waveform active={aiSpeaking} />
            </div>
          </div>

          {/* transcript */}
          <div
            ref={scrollRef}
            className="call-scroll h-80 overflow-y-auto px-4 py-4 space-y-4 bg-slate-50"
          >
            {phase === "idle" && shown.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center px-6">
                <div className="text-4xl">📞</div>
                <p className="mt-3 text-sm text-slate-500 leading-relaxed">
                  Pick a scenario above, then start the demo call to hear how
                  the AI receptionist handles it — simulated in real time.
                </p>
              </div>
            )}
            {phase === "dialing" && (
              <div className="h-full flex items-center justify-center">
                <p className="text-sm text-slate-500 speaking">
                  Ringing Maplewood Dental…
                </p>
              </div>
            )}
            {shown.map((l, i) =>
              l.speaker === "system" ? (
                <div key={`${runId}-${i}`} className="msg-in text-center">
                  <span className="inline-block text-[11px] font-medium bg-amber-100 text-amber-800 rounded-full px-3 py-1.5">
                    ⚙ {l.text}
                  </span>
                </div>
              ) : (
                <div
                  key={`${runId}-${i}`}
                  className={`msg-in flex flex-col ${
                    l.speaker === "ai" ? "items-start" : "items-end"
                  }`}
                >
                  <SpeakerLabel speaker={l.speaker} />
                  <div
                    className={`mt-1 max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                      l.speaker === "ai"
                        ? "bg-violet-600 text-white rounded-tl-md"
                        : "bg-white text-slate-800 border border-slate-200 rounded-tr-md"
                    }`}
                  >
                    {l.text}
                  </div>
                </div>
              )
            )}
            {aiTyping && (
              <div className="msg-in flex flex-col items-start">
                <SpeakerLabel speaker="ai" />
                <div className="mt-1 bg-violet-600 rounded-2xl rounded-tl-md px-4 py-3 flex gap-1.5">
                  <span className="typing-dot w-2 h-2 rounded-full bg-white" />
                  <span className="typing-dot w-2 h-2 rounded-full bg-white" />
                  <span className="typing-dot w-2 h-2 rounded-full bg-white" />
                </div>
              </div>
            )}
          </div>

          {/* call controls */}
          <div className="px-5 py-4 bg-white border-t border-slate-100">
            {phase === "idle" && (
              <button
                onClick={startCall}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-full py-3.5 transition shadow-lg shadow-emerald-500/25"
              >
                📞 Start demo call
              </button>
            )}
            {(phase === "dialing" || phase === "live") && (
              <button
                onClick={() => reset()}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-bold rounded-full py-3.5 transition shadow-lg shadow-red-500/25"
              >
                ⏹ End call
              </button>
            )}
            {phase === "ended" && (
              <div className="space-y-3">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
                    Call summary
                  </p>
                  <p className="mt-1 font-bold">{summary.outcomeLabel}</p>
                  <p className="mt-1 text-sm text-slate-600">{summary.detail}</p>
                  {summary.followUp && (
                    <p className="mt-2 inline-block text-xs font-semibold bg-amber-100 text-amber-800 rounded-full px-2.5 py-1">
                      ⚑ Follow-up needed — {summary.followUpNote}
                    </p>
                  )}
                  <p className="mt-2 text-xs text-slate-400">
                    Saved to the call log — see it on the admin dashboard.
                  </p>
                </div>
                <button
                  onClick={startCall}
                  className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-full py-3 transition"
                >
                  ↺ Replay this scenario
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <p className="mt-4 text-center text-xs text-slate-400">
        Simulated transcript — no real call is placed and no audio is recorded.
      </p>
    </div>
  );
}
