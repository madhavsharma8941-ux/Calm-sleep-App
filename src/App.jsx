import { useState, useEffect, useRef, useCallback } from "react";

// ─── Utility ──────────────────────────────────────────────────────────────────
const pad = (n) => String(n).padStart(2, "0");
const today = () => new Date().toISOString().slice(0, 10);
const dayName = (iso) => new Date(iso).toLocaleDateString("en-US", { weekday: "short" });

function useLocalStorage(key, init) {
  const [val, setVal] = useState(() => {
    try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : init; }
    catch { return init; }
  });
  const save = useCallback((v) => {
    setVal(v);
    try { localStorage.setItem(key, JSON.stringify(v)); } catch {}
  }, [key]);
  return [val, save];
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const TECHNIQUES = [
  {
    id: "478", icon: "🌬️", title: "4-7-8 Breathing",
    tagline: "Reset your nervous system in 60 seconds",
    why: "Stimulates the parasympathetic nervous system, slowing heart rate and cortisol levels — mimicking the body's natural pre-sleep state.",
    steps: ["Exhale completely through your mouth", "Inhale through your nose for 4 counts", "Hold your breath for 7 counts", "Exhale slowly through mouth for 8 counts", "Repeat 3–4 cycles"],
    color: "#6ee7f7",
  },
  {
    id: "bodyscan", icon: "🧘", title: "Body Scan",
    tagline: "Release tension you didn't know you had",
    why: "Progressive muscle relaxation reduces physiological arousal by systematically releasing tension stored in the body, proven to reduce sleep onset time.",
    steps: ["Lie down and close your eyes", "Focus on your feet — soften them", "Slowly move up: calves, knees, thighs", "Notice and release tension in each area", "End at the top of your head"],
    color: "#b8a4f8",
  },
  {
    id: "shuffle", icon: "🃏", title: "Cognitive Shuffle",
    tagline: "Trick your brain into sleep mode",
    why: "Invented by Dr. Luc Beaulieu-Prévost, this technique disrupts pre-sleep cognitive arousal by generating random, unconnected imagery — mimicking natural sleep-onset thought patterns.",
    steps: ["Pick a random word (e.g. 'umbrella')", "Visualise the word as an image vividly", "After a few seconds, switch to another", "Keep images unrelated & bizarre", "Your brain will naturally drift off"],
    color: "#f9a8c9",
  },
  {
    id: "light", icon: "💡", title: "Light Exposure Control",
    tagline: "Your circadian rhythm's master switch",
    why: "Blue wavelength light suppresses melatonin production for up to 3 hours. Strategic light management can advance or delay your internal clock by 1–2 hours.",
    steps: ["Bright light within 30 min of waking", "Dim lights 2 hours before bed", "Use warm/amber bulbs in the evening", "Avoid screens 45 min before sleep", "Try a blue-light filter after sunset"],
    color: "#fcd37a",
  },
  {
    id: "restriction", icon: "⏱️", title: "Sleep Restriction",
    tagline: "Build genuine sleep pressure",
    why: "Consolidates fragmented sleep by temporarily limiting time in bed, increasing adenosine (sleep pressure) so sleep becomes deeper and more efficient.",
    steps: ["Pick a fixed wake time — stick to it", "Only go to bed when truly sleepy", "Avoid naps for the first 2 weeks", "Gradually extend bedtime by 15 min", "Maintain schedule even on weekends"],
    color: "#6effd1",
  },
];

const QUIZ_QUESTIONS = [
  { q: "What time do you usually go to bed?", type: "choice", opts: ["Before 10pm", "10–11pm", "11pm–1am", "After 1am"], scores: [10,8,4,1] },
  { q: "How long does it take you to fall asleep?", type: "choice", opts: ["< 10 min", "10–20 min", "20–45 min", "> 45 min"], scores: [10,8,4,1] },
  { q: "How often do you use your phone in bed?", type: "choice", opts: ["Never", "Rarely", "Most nights", "Every night"], scores: [10,7,3,1] },
  { q: "How would you rate your stress levels before bed?", type: "choice", opts: ["Very low", "Low", "Moderate", "High"], scores: [10,7,4,1] },
  { q: "How many caffeinated drinks per day?", type: "choice", opts: ["0", "1–2", "3–4", "5+"], scores: [10,8,4,1] },
  { q: "Do you wake up feeling rested?", type: "choice", opts: ["Almost always", "Often", "Sometimes", "Rarely"], scores: [10,7,4,1] },
  { q: "How consistent is your wake-up time?", type: "choice", opts: ["Same every day", "±30 min", "±1–2 hours", "Very variable"], scores: [10,8,4,1] },
];

const SCIENCE_CARDS = [
  { icon: "🔵", stat: "3 hrs", claim: "Blue light suppresses melatonin for up to 3 hours after exposure", source: "Harvard Medical School, 2015" },
  { icon: "📐", stat: "90 min", claim: "Humans cycle through sleep stages roughly every 90 minutes — waking between cycles feels more natural", source: "Dement & Kleitman, 1957" },
  { icon: "🌡️", stat: "1–2°C", claim: "Core body temperature needs to drop 1–2°C for sleep onset — a warm bath paradoxically accelerates this", source: "Sleep Medicine Reviews, 2019" },
  { icon: "☕", stat: "6 hrs", claim: "Caffeine's half-life is ~5–6 hours, meaning an afternoon coffee still disrupts sleep architecture at midnight", source: "Journal of Clinical Sleep Medicine, 2013" },
  { icon: "🧠", stat: "23%", claim: "Consistently sleeping under 6 hours reduces cognitive performance equivalent to 2 days without sleep", source: "Van Dongen et al., 2003" },
];

const DEFAULT_ROUTINE = [
  { id: 1, text: "Dim the lights", done: false },
  { id: 2, text: "Put phone away", done: false },
  { id: 3, text: "4-7-8 breathing (3 cycles)", done: false },
  { id: 4, text: "Gratitude journal (3 things)", done: false },
  { id: 5, text: "Read a book for 15 min", done: false },
];

// ─── Stars Background ─────────────────────────────────────────────────────────
function Stars() {
  const stars = useRef([]);
  if (!stars.current.length) {
    stars.current = Array.from({ length: 120 }, (_, i) => ({
      id: i, x: Math.random() * 100, y: Math.random() * 100,
      size: Math.random() * 2.5 + 0.5, delay: Math.random() * 4, dur: Math.random() * 3 + 2,
    }));
  }
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
      {stars.current.map(s => (
        <div key={s.id} style={{
          position: "absolute", left: `${s.x}%`, top: `${s.y}%`,
          width: s.size, height: s.size, borderRadius: "50%",
          background: `rgba(255,255,255,${0.3 + Math.random() * 0.5})`,
          animation: `twinkle ${s.dur}s ${s.delay}s infinite alternate`,
        }} />
      ))}
    </div>
  );
}

// ─── Breathing Animation ──────────────────────────────────────────────────────
function BreathingCircle({ phase, setPhase }) {
  const phases = [
    { label: "Inhale", duration: 4000, scale: 1.6, color: "#6ee7f7" },
    { label: "Hold", duration: 7000, scale: 1.6, color: "#b8a4f8" },
    { label: "Exhale", duration: 8000, scale: 1.0, color: "#6effd1" },
  ];
  const cur = phases[phase];
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
      <div style={{
        width: 160, height: 160, borderRadius: "50%",
        background: `radial-gradient(circle, ${cur.color}33, ${cur.color}11)`,
        border: `2px solid ${cur.color}66`,
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: `transform ${cur.duration}ms ease-in-out, border-color 600ms`,
        transform: `scale(${cur.scale})`,
        boxShadow: `0 0 60px ${cur.color}44, 0 0 20px ${cur.color}22`,
        fontSize: 32,
      }}>🌬️</div>
      <div style={{ fontSize: 22, fontFamily: "'Cormorant Garamond', Georgia, serif", color: cur.color, letterSpacing: 3, marginTop: 16 }}>
        {cur.label}
      </div>
    </div>
  );
}

// ─── Sleep Chart ──────────────────────────────────────────────────────────────
function SleepChart({ logs }) {
  if (!logs.length) return (
    <div style={{ textAlign: "center", color: "rgba(255,255,255,0.3)", padding: "40px 0", fontSize: 14 }}>
      No sleep logs yet. Start tracking tonight!
    </div>
  );
  const last7 = [...logs].sort((a,b) => a.date < b.date ? -1 : 1).slice(-7);
  const max = 10;
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 120, padding: "0 4px" }}>
      {last7.map((l, i) => {
        const h = (l.quality / max) * 100;
        const col = l.quality >= 7 ? "#6effd1" : l.quality >= 4 ? "#b8a4f8" : "#f9a8c9";
        return (
          <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <div style={{ fontSize: 11, color: col, fontWeight: 600 }}>{l.quality}</div>
            <div style={{
              width: "100%", height: `${h}%`, borderRadius: 6,
              background: `linear-gradient(180deg, ${col}cc, ${col}44)`,
              transition: "height 0.6s cubic-bezier(.4,0,.2,1)",
              minHeight: 4,
            }} />
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>{dayName(l.date)}</div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Streak Badge ─────────────────────────────────────────────────────────────
function StreakBadge({ streak, best }) {
  return (
    <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
      {[{ label: "Current", val: streak, col: "#fcd37a", icon: "🔥" }, { label: "Best", val: best, col: "#f9a8c9", icon: "🏆" }].map(b => (
        <div key={b.label} style={{
          background: "rgba(255,255,255,0.05)", border: `1px solid ${b.col}33`,
          borderRadius: 16, padding: "16px 24px", textAlign: "center", flex: 1,
        }}>
          <div style={{ fontSize: 28 }}>{b.icon}</div>
          <div style={{ fontSize: 32, fontWeight: 800, color: b.col, fontFamily: "'Cormorant Garamond', serif", lineHeight: 1.1 }}>{b.val}</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", letterSpacing: 1, textTransform: "uppercase", marginTop: 2 }}>{b.label} streak</div>
        </div>
      ))}
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function CalmSleep() {
  const [tab, setTab] = useState("home");
  const [calmMode, setCalmMode] = useState(false);
  const [breathPhase, setBreathPhase] = useState(0);
  const [breathActive, setBreathActive] = useState(false);
  const breathTimer = useRef(null);

  // Technique modal
  const [activeTech, setActiveTech] = useState(null);

  // Quiz
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState([]);
  const [quizDone, setQuizDone] = useState(false);

  // Sleep logs
  const [logs, saveLogs] = useLocalStorage("calmSleepLogs", []);
  const [logForm, setLogForm] = useState({ bedTime: "22:30", wakeTime: "06:30", quality: 7 });
  const [logSaved, setLogSaved] = useState(false);

  // Streak
  const [streak, saveStreak] = useLocalStorage("calmStreak", { current: 0, best: 0, lastDate: "" });

  // Routine
  const [routine, saveRoutine] = useLocalStorage("calmRoutine", DEFAULT_ROUTINE);
  const [newStep, setNewStep] = useState("");

  useEffect(() => {
    if (!breathActive) { clearTimeout(breathTimer.current); return; }
    const phases = [4000, 7000, 8000];
    breathTimer.current = setTimeout(() => {
      setBreathPhase(p => (p + 1) % 3);
    }, phases[breathPhase]);
    return () => clearTimeout(breathTimer.current);
  }, [breathPhase, breathActive]);

  const startBreath = () => { setBreathPhase(0); setBreathActive(true); };
  const stopBreath = () => { setBreathActive(false); setBreathPhase(0); };

  const handleQuizAnswer = (idx) => {
    const newAns = [...quizAnswers, idx];
    if (quizStep < QUIZ_QUESTIONS.length - 1) {
      setQuizAnswers(newAns); setQuizStep(s => s + 1);
    } else {
      setQuizAnswers(newAns); setQuizDone(true);
    }
  };

  const quizScore = quizDone ? Math.round(
    quizAnswers.reduce((sum, a, i) => sum + QUIZ_QUESTIONS[i].scores[a], 0) / QUIZ_QUESTIONS.length
  ) : 0;

  const scoreLabel = quizScore >= 9 ? ["Excellent", "#6effd1"] : quizScore >= 7 ? ["Good", "#6ee7f7"] : quizScore >= 5 ? ["Fair", "#fcd37a"] : ["Needs work", "#f9a8c9"];

  const saveLog = () => {
    const entry = { date: today(), ...logForm };
    const updated = [...logs.filter(l => l.date !== today()), entry];
    saveLogs(updated);
    // Streak
    const last = streak.lastDate;
    const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
    const yStr = yesterday.toISOString().slice(0, 10);
    const newCur = (last === yStr || last === today()) ? streak.current + (last !== today() ? 1 : 0) : 1;
    saveStreak({ current: newCur, best: Math.max(newCur, streak.best), lastDate: today() });
    setLogSaved(true);
    setTimeout(() => setLogSaved(false), 2500);
  };

  const toggleRoutineItem = (id) => {
    saveRoutine(routine.map(r => r.id === id ? { ...r, done: !r.done } : r));
  };

  const addRoutineStep = () => {
    if (!newStep.trim()) return;
    saveRoutine([...routine, { id: Date.now(), text: newStep.trim(), done: false }]);
    setNewStep("");
  };

  const todayLog = logs.find(l => l.date === today());
  const avgQuality = logs.length ? (logs.slice(-7).reduce((s, l) => s + l.quality, 0) / Math.min(logs.length, 7)).toFixed(1) : null;

  // Smart suggestions
  const suggestions = [];
  if (todayLog && todayLog.quality < 5) suggestions.push("Your quality was low last night. Try the 4-7-8 breathing technique tonight.");
  if (quizDone && quizAnswers[2] >= 2) suggestions.push("You use your phone in bed often. Try leaving it outside your bedroom for one week.");
  if (streak.current === 0) suggestions.push("Start your streak tonight by logging your sleep after you wake up tomorrow.");

  // ── CALM MODE ───────────────────────────────────────────────────────────────
  if (calmMode) {
    return (
      <div style={{
        position: "fixed", inset: 0, background: "#050810",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        gap: 48, zIndex: 1000,
      }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300&family=DM+Sans:wght@300;400;500&display=swap');
        @keyframes twinkle{0%{opacity:.2}100%{opacity:1}}`}</style>
        <Stars />
        <div style={{ zIndex: 1, textAlign: "center" }}>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 14, letterSpacing: 6, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", marginBottom: 32 }}>
            Sleep Mode
          </div>
          <BreathingCircle phase={breathPhase} setPhase={setBreathPhase} />
          <div style={{ marginTop: 40, fontFamily: "'Cormorant Garamond', serif", fontSize: 18, color: "rgba(255,255,255,0.5)", fontStyle: "italic" }}>
            Let each exhale carry the day away
          </div>
          {!breathActive ? (
            <button onClick={startBreath} style={{
              marginTop: 32, background: "rgba(110,231,247,0.1)", border: "1px solid rgba(110,231,247,0.3)",
              color: "#6ee7f7", padding: "12px 32px", borderRadius: 50, cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif", fontSize: 14, letterSpacing: 1,
            }}>Begin Breathing</button>
          ) : (
            <button onClick={stopBreath} style={{
              marginTop: 32, background: "transparent", border: "1px solid rgba(255,255,255,0.1)",
              color: "rgba(255,255,255,0.3)", padding: "12px 32px", borderRadius: 50, cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif", fontSize: 13,
            }}>Pause</button>
          )}
        </div>
        <button onClick={() => { setCalmMode(false); stopBreath(); }} style={{
          position: "fixed", top: 24, right: 24, background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.4)",
          borderRadius: 50, width: 40, height: 40, cursor: "pointer", fontSize: 16, zIndex: 2,
        }}>✕</button>
      </div>
    );
  }

  // ── TECHNIQUE MODAL ─────────────────────────────────────────────────────────
  if (activeTech) {
    const t = TECHNIQUES.find(x => x.id === activeTech);
    return (
      <div style={{
        position: "fixed", inset: 0, background: "rgba(5,8,20,0.97)", overflowY: "auto",
        zIndex: 500, display: "flex", flexDirection: "column",
      }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300&family=DM+Sans:wght@300;400;500&display=swap');`}</style>
        <div style={{ maxWidth: 520, margin: "0 auto", padding: "32px 24px 80px" }}>
          <button onClick={() => setActiveTech(null)} style={{
            background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
            color: "rgba(255,255,255,0.5)", borderRadius: 50, padding: "8px 20px", cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif", fontSize: 13, marginBottom: 32,
          }}>← Back</button>
          <div style={{ fontSize: 48, marginBottom: 16 }}>{t.icon}</div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 36, color: "#fff", fontWeight: 300, margin: "0 0 8px" }}>{t.title}</h2>
          <p style={{ color: t.color, fontSize: 14, margin: "0 0 32px", fontStyle: "italic" }}>{t.tagline}</p>
          <div style={{ background: `${t.color}0d`, border: `1px solid ${t.color}33`, borderRadius: 16, padding: 20, marginBottom: 28 }}>
            <div style={{ fontSize: 11, letterSpacing: 2, color: t.color, textTransform: "uppercase", marginBottom: 8, fontFamily: "'DM Sans', sans-serif" }}>Why it works</div>
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 14, lineHeight: 1.7, margin: 0, fontFamily: "'DM Sans', sans-serif" }}>{t.why}</p>
          </div>
          <div style={{ fontSize: 11, letterSpacing: 2, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", marginBottom: 16, fontFamily: "'DM Sans', sans-serif" }}>Step by step</div>
          {t.steps.map((s, i) => (
            <div key={i} style={{
              display: "flex", gap: 16, alignItems: "flex-start", marginBottom: 16,
              padding: "14px 16px", background: "rgba(255,255,255,0.03)", borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.06)",
            }}>
              <div style={{
                minWidth: 28, height: 28, borderRadius: "50%",
                background: `${t.color}22`, border: `1px solid ${t.color}55`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, color: t.color, fontWeight: 600, fontFamily: "'DM Sans', sans-serif",
              }}>{i+1}</div>
              <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 14, lineHeight: 1.6, fontFamily: "'DM Sans', sans-serif", paddingTop: 4 }}>{s}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const TABS = [
    { id: "home", icon: "🌙", label: "Home" },
    { id: "techniques", icon: "🧠", label: "Techniques" },
    { id: "quiz", icon: "✨", label: "Quiz" },
    { id: "tracker", icon: "📊", label: "Track" },
    { id: "routine", icon: "🌿", label: "Routine" },
    { id: "science", icon: "🔬", label: "Science" },
  ];

  const styles = {
    wrap: {
      minHeight: "100vh", background: "linear-gradient(160deg, #050810 0%, #0b0f1e 40%, #080b16 100%)",
      fontFamily: "'DM Sans', sans-serif", color: "#fff", position: "relative",
      paddingBottom: 90,
    },
    inner: { maxWidth: 520, margin: "0 auto", padding: "0 20px" },
    card: {
      background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 20, padding: "20px 22px", marginBottom: 16,
      backdropFilter: "blur(10px)",
    },
    sectionTitle: {
      fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 300,
      color: "#fff", margin: "0 0 4px",
    },
    sectionSub: { fontSize: 13, color: "rgba(255,2
