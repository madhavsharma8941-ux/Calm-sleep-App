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
    sectionSub: { fontSize: 13, color: "rgba(255,255,255,0.4)", margin: "0 0 20px" },
    label: { fontSize: 11, letterSpacing: 2, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", marginBottom: 8, display: "block" },
    pill: (col) => ({
      display: "inline-block", background: `${col}22`, border: `1px solid ${col}55`,
      color: col, borderRadius: 50, padding: "4px 12px", fontSize: 11, letterSpacing: 1,
    }),
    btn: (col = "#6ee7f7") => ({
      background: `${col}18`, border: `1px solid ${col}44`, color: col,
      padding: "12px 24px", borderRadius: 50, cursor: "pointer",
      fontSize: 13, letterSpacing: 0.5, fontFamily: "'DM Sans', sans-serif",
      transition: "all 0.2s",
    }),
    input: {
      background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
      borderRadius: 12, padding: "10px 14px", color: "#fff", fontSize: 14,
      fontFamily: "'DM Sans', sans-serif", outline: "none", width: "100%", boxSizing: "border-box",
    },
    navBar: {
      position: "fixed", bottom: 0, left: 0, right: 0,
      background: "rgba(5,8,20,0.92)", backdropFilter: "blur(20px)",
      borderTop: "1px solid rgba(255,255,255,0.07)",
      display: "flex", justifyContent: "space-around", padding: "8px 0 12px", zIndex: 100,
    },
  };

  return (
    <div style={styles.wrap}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300&family=DM+Sans:wght@300;400;500&display=swap');
        @keyframes twinkle{0%{opacity:.15}100%{opacity:.9}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}
        * { box-sizing: border-box; }
        input[type=range]{-webkit-appearance:none;height:4px;border-radius:4px;background:rgba(255,255,255,0.15);}
        input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:18px;height:18px;border-radius:50%;background:#b8a4f8;cursor:pointer;}
        input[type=time]{color-scheme:dark;}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.1);border-radius:4px}
      `}</style>
      <Stars />

      <div style={{ position: "relative", zIndex: 1 }}>

        {/* ── HOME ─────────────────────────────────────────────────────── */}
        {tab === "home" && (
          <div style={styles.inner}>
            <div style={{ padding: "56px 0 28px", animation: "fadeUp 0.7s ease" }}>
              <div style={{ fontSize: 11, letterSpacing: 4, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", marginBottom: 12 }}>Good evening</div>
              <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 42, fontWeight: 300, margin: 0, lineHeight: 1.1 }}>
                Ready for<br /><em style={{ color: "#b8a4f8" }}>deeper sleep?</em>
              </h1>
              <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 15, margin: "16px 0 0", lineHeight: 1.7 }}>
                Your personal sleep companion, built on science.
              </p>
            </div>

            {/* Calm Mode CTA */}
            <button onClick={() => setCalmMode(true)} style={{
              width: "100%", background: "linear-gradient(135deg, rgba(184,164,248,0.18) 0%, rgba(110,231,247,0.12) 100%)",
              border: "1px solid rgba(184,164,248,0.35)", borderRadius: 24, padding: "28px 24px",
              cursor: "pointer", textAlign: "left", marginBottom: 16, color: "#fff",
              animation: "pulse 4s infinite", fontFamily: "'DM Sans', sans-serif",
            }}>
              <div style={{ fontSize: 36, marginBottom: 10 }}>🌌</div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, marginBottom: 4 }}>Start Sleep Mode</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>Breathing guide · Dark screen · Calm focus</div>
            </button>

            {/* Stats row */}
            <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
              {[
                { label: "Tonight", val: todayLog ? `${todayLog.quality}/10` : "–", col: "#6effd1", icon: "⭐" },
                { label: "7-day avg", val: avgQuality ? `${avgQuality}/10` : "–", col: "#6ee7f7", icon: "📈" },
                { label: "Streak", val: `${streak.current}d`, col: "#fcd37a", icon: "🔥" },
              ].map(s => (
                <div key={s.label} style={{ ...styles.card, flex: 1, padding: "16px", textAlign: "center", marginBottom: 0 }}>
                  <div style={{ fontSize: 20 }}>{s.icon}</div>
                  <div style={{ fontSize: 18, fontWeight: 600, color: s.col, margin: "4px 0 2px", fontFamily: "'Cormorant Garamond', serif" }}>{s.val}</div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", letterSpacing: 1 }}>{s.label.toUpperCase()}</div>
                </div>
              ))}
            </div>

            {/* Smart suggestions */}
            {suggestions.length > 0 && (
              <div style={{ ...styles.card, borderColor: "rgba(252,211,122,0.2)", marginBottom: 16 }}>
                <div style={{ fontSize: 11, letterSpacing: 2, color: "#fcd37a", textTransform: "uppercase", marginBottom: 12 }}>💡 For you tonight</div>
                {suggestions.map((s, i) => (
                  <div key={i} style={{ color: "rgba(255,255,255,0.7)", fontSize: 14, lineHeight: 1.6, marginBottom: i < suggestions.length-1 ? 8 : 0, paddingLeft: 12, borderLeft: "2px solid rgba(252,211,122,0.3)" }}>{s}</div>
                ))}
              </div>
            )}

            {/* Routine quick-check */}
            <div style={styles.card}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <div style={{ fontSize: 14, color: "rgba(255,255,255,0.7)" }}>Tonight's routine</div>
                <div style={{ ...styles.pill("#6effd1"), fontSize: 11 }}>{routine.filter(r => r.done).length}/{routine.length}</div>
              </div>
              {routine.slice(0, 3).map(r => (
                <div key={r.id} onClick={() => toggleRoutineItem(r.id)} style={{
                  display: "flex", alignItems: "center", gap: 12, padding: "8px 0",
                  cursor: "pointer", borderBottom: "1px solid rgba(255,255,255,0.05)",
                }}>
                  <div style={{
                    width: 20, height: 20, borderRadius: 6, border: `1.5px solid ${r.done ? "#6effd1" : "rgba(255,255,255,0.2)"}`,
                    background: r.done ? "#6effd166" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11,
                  }}>{r.done ? "✓" : ""}</div>
                  <div style={{ fontSize: 14, color: r.done ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.75)", textDecoration: r.done ? "line-through" : "none" }}>{r.text}</div>
                </div>
              ))}
              <div onClick={() => setTab("routine")} style={{ color: "#b8a4f8", fontSize: 12, marginTop: 12, cursor: "pointer" }}>View full routine →</div>
            </div>
          </div>
        )}

        {/* ── TECHNIQUES ──────────────────────────────────────────────── */}
        {tab === "techniques" && (
          <div style={styles.inner}>
            <div style={{ padding: "48px 0 24px" }}>
              <h2 style={styles.sectionTitle}>Sleep Techniques</h2>
              <p style={styles.sectionSub}>Science-backed methods that actually work</p>
            </div>
            {TECHNIQUES.map((t, i) => (
              <div key={t.id} onClick={() => setActiveTech(t.id)} style={{
                ...styles.card, cursor: "pointer",
                borderColor: `${t.color}22`,
                animation: `fadeUp ${0.3 + i * 0.08}s ease`,
                transition: "transform 0.2s, border-color 0.2s",
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = `${t.color}55`}
                onMouseLeave={e => e.currentTarget.style.borderColor = `${t.color}22`}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <div style={{
                    width: 52, height: 52, borderRadius: 16, background: `${t.color}18`,
                    border: `1px solid ${t.color}33`, display: "flex", alignItems: "center",
                    justifyContent: "center", fontSize: 24, flexShrink: 0,
                  }}>{t.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, marginBottom: 2 }}>{t.title}</div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)" }}>{t.tagline}</div>
                  </div>
                  <div style={{ color: `${t.color}88`, fontSize: 18 }}>›</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── QUIZ ────────────────────────────────────────────────────── */}
        {tab === "quiz" && (
          <div style={styles.inner}>
            <div style={{ padding: "48px 0 24px" }}>
              <h2 style={styles.sectionTitle}>Sleep Assessment</h2>
              <p style={styles.sectionSub}>7 questions to understand your sleep</p>
            </div>

            {!quizDone ? (
              <div style={{ animation: "fadeUp 0.4s ease" }}>
                {/* Progress */}
                <div style={{ display: "flex", gap: 4, marginBottom: 32 }}>
                  {QUIZ_QUESTIONS.map((_, i) => (
                    <div key={i} style={{
                      flex: 1, height: 3, borderRadius: 3,
                      background: i <= quizStep ? "#b8a4f8" : "rgba(255,255,255,0.1)",
                      transition: "background 0.3s",
                    }} />
                  ))}
                </div>
                <div style={{ fontSize: 11, letterSpacing: 2, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", marginBottom: 12 }}>
                  Question {quizStep + 1} of {QUIZ_QUESTIONS.length}
                </div>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 400, margin: "0 0 28px", lineHeight: 1.35 }}>
                  {QUIZ_QUESTIONS[quizStep].q}
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {QUIZ_QUESTIONS[quizStep].opts.map((opt, i) => (
                    <button key={i} onClick={() => handleQuizAnswer(i)} style={{
                      background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: 14, padding: "16px 20px", color: "rgba(255,255,255,0.8)",
                      cursor: "pointer", textAlign: "left", fontSize: 14, fontFamily: "'DM Sans', sans-serif",
                      transition: "all 0.2s",
                    }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = "#b8a4f8"; e.currentTarget.style.background = "rgba(184,164,248,0.1)"; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
                    >{opt}</button>
                  ))}
                </div>
                {quizStep > 0 && (
                  <button onClick={() => { setQuizStep(s => s-1); setQuizAnswers(a => a.slice(0,-1)); }} style={{
                    ...styles.btn(), marginTop: 20, fontSize: 12,
                  }}>← Back</button>
                )}
              </div>
            ) : (
              <div style={{ animation: "fadeUp 0.5s ease" }}>
                <div style={{ ...styles.card, textAlign: "center", borderColor: `${scoreLabel[1]}33`, marginBottom: 20 }}>
                  <div style={{ fontSize: 64, fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, color: scoreLabel[1], lineHeight: 1 }}>{quizScore}</div>
                  <div style={{ fontSize: 11, letterSpacing: 2, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", margin: "8px 0 4px" }}>Sleep score</div>
                  <div style={{ ...styles.pill(scoreLabel[1]) }}>{scoreLabel[0]}</div>
                </div>
                <div style={{ fontSize: 11, letterSpacing: 2, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", marginBottom: 12 }}>Your recommendations</div>
                {quizScore < 7 && (
                  <>
                    {quizAnswers[2] >= 2 && <div style={styles.card}><div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", lineHeight: 1.6 }}>📵 Avoid screens for 45 minutes before bed to protect your melatonin production.</div></div>}
                    {quizAnswers[3] >= 2 && <div style={styles.card}><div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", lineHeight: 1.6 }}>🌬️ Try the <strong style={{ color: "#6ee7f7" }}>4-7-8 breathing</strong> technique to lower your pre-sleep stress levels.</div></div>}
                    {quizAnswers[4] >= 2 && <div style={styles.card}><div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", lineHeight: 1.6 }}>☕ Cut caffeine after 2pm — its half-life means it still affects your sleep at midnight.</div></div>}
                    {quizAnswers[6] >= 2 && <div style={styles.card}><div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", lineHeight: 1.6 }}>⏰ Fix your wake-up time first — even on weekends. This anchors your circadian rhythm.</div></div>}
                  </>
                )}
                {quizScore >= 7 && <div style={styles.card}><div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", lineHeight: 1.6 }}>🎉 Your sleep habits are solid! Focus on maintaining consistency and tracking your quality each morning.</div></div>}
                <button onClick={() => { setQuizDone(false); setQuizStep(0); setQuizAnswers([]); }} style={styles.btn("#b8a4f8")}>Retake quiz</button>
              </div>
            )}
          </div>
        )}

        {/* ── TRACKER ─────────────────────────────────────────────────── */}
        {tab === "tracker" && (
          <div style={styles.inner}>
            <div style={{ padding: "48px 0 24px" }}>
              <h2 style={styles.sectionTitle}>Sleep Tracker</h2>
              <p style={styles.sectionSub}>Log each morning, spot your patterns</p>
            </div>

            <StreakBadge streak={streak.current} best={streak.best} />

            <div style={{ ...styles.card, marginTop: 16 }}>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", marginBottom: 16 }}>Log last night's sleep</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
                {[["Bed time", "bedTime"], ["Wake time", "wakeTime"]].map(([lbl, key]) => (
                  <div key={key}>
                    <label style={styles.label}>{lbl}</label>
                    <input type="time" value={logForm[key]} onChange={e => setLogForm(f => ({ ...f, [key]: e.target.value }))} style={styles.input} />
                  </div>
                ))}
              </div>
              <label style={styles.label}>Sleep quality — {logForm.quality}/10</label>
              <input type="range" min={1} max={10} value={logForm.quality} onChange={e => setLogForm(f => ({ ...f, quality: +e.target.value }))} style={{ width: "100%", accentColor: "#b8a4f8", marginBottom: 16 }} />
              <button onClick={saveLog} style={{
                ...styles.btn("#6effd1"), width: "100%", textAlign: "center",
                background: logSaved ? "rgba(110,255,209,0.2)" : "rgba(110,255,209,0.1)",
              }}>{logSaved ? "✓ Saved!" : "Save entry"}</button>
            </div>

            <div style={styles.card}>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", marginBottom: 16 }}>Weekly quality</div>
              <SleepChart logs={logs} />
            </div>

            {avgQuality && (
              <div style={{ ...styles.card, borderColor: "rgba(110,231,247,0.2)" }}>
                <div style={{ fontSize: 11, letterSpacing: 2, color: "#6ee7f7", textTransform: "uppercase", marginBottom: 8 }}>Insight</div>
                <div style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", lineHeight: 1.6 }}>
                  Your 7-day average quality is <strong style={{ color: "#6ee7f7" }}>{avgQuality}/10</strong>.
                  {parseFloat(avgQuality) < 6 ? " Focusing on one technique consistently can improve this significantly." : " You're doing well — keep the momentum going!"}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── ROUTINE ─────────────────────────────────────────────────── */}
        {tab === "routine" && (
          <div style={styles.inner}>
            <div style={{ padding: "48px 0 24px" }}>
              <h2 style={styles.sectionTitle}>Night Routine</h2>
              <p style={styles.sectionSub}>Build the ritual that prepares your mind</p>
            </div>

            <div style={{ ...styles.card, background: "rgba(184,164,248,0.06)", borderColor: "rgba(184,164,248,0.2)", marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                <span style={{ fontSize: 13, color: "#b8a4f8" }}>Tonight's progress</span>
                <span style={{ fontSize: 13, color: "#b8a4f8", fontWeight: 600 }}>{routine.filter(r => r.done).length}/{routine.length}</span>
              </div>
              <div style={{ height: 4, background: "rgba(255,255,255,0.08)", borderRadius: 4, overflow: "hidden" }}>
                <div style={{
                  height: "100%", background: "#b8a4f8",
                  width: `${(routine.filter(r => r.done).length / routine.length) * 100}%`,
                  borderRadius: 4, transition: "width 0.4s cubic-bezier(.4,0,.2,1)",
                }} />
              </div>
            </div>

            {routine.map((r, i) => (
              <div key={r.id} onClick={() => toggleRoutineItem(r.id)} style={{
                ...styles.card, cursor: "pointer", display: "flex", alignItems: "center", gap: 14,
                borderColor: r.done ? "rgba(110,255,209,0.2)" : "rgba(255,255,255,0.07)",
                padding: "16px 18px", animation: `fadeUp ${0.3 + i * 0.06}s ease`,
              }}>
                <div style={{
                  width: 24, height: 24, borderRadius: 8,
                  border: `1.5px solid ${r.done ? "#6effd1" : "rgba(255,255,255,0.2)"}`,
                  background: r.done ? "rgba(110,255,209,0.2)" : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, color: "#6effd1", flexShrink: 0, transition: "all 0.2s",
                }}>{r.done ? "✓" : ""}</div>
                <div style={{ flex: 1, fontSize: 14, color: r.done ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.8)", textDecoration: r.done ? "line-through" : "none" }}>{r.text}</div>
                <div onClick={e => { e.stopPropagation(); saveRoutine(routine.filter(x => x.id !== r.id)); }} style={{ color: "rgba(255,255,255,0.15)", cursor: "pointer", fontSize: 16, padding: "0 4px" }}>✕</div>
              </div>
            ))}

            <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
              <input
                value={newStep} onChange={e => setNewStep(e.target.value)}
                onKeyDown={e => e.key === "Enter" && addRoutineStep()}
                placeholder="Add a routine step…"
                style={{ ...styles.input, flex: 1 }}
              />
              <button onClick={addRoutineStep} style={{
                ...styles.btn("#6effd1"), padding: "10px 18px", whiteSpace: "nowrap",
              }}>+</button>
            </div>

            <button onClick={() => saveRoutine(routine.map(r => ({ ...r, done: false })))} style={{
              ...styles.btn(), marginTop: 16, fontSize: 12,
            }}>Reset checklist</button>
          </div>
        )}

        {/* ── SCIENCE ─────────────────────────────────────────────────── */}
        {tab === "science" && (
          <div style={styles.inner}>
            <div style={{ padding: "48px 0 24px" }}>
              <h2 style={styles.sectionTitle}>Sleep Science</h2>
              <p style={styles.sectionSub}>Research that changes how you sleep</p>
            </div>
            {SCIENCE_CARDS.map((s, i) => (
              <div key={i} style={{ ...styles.card, animation: `fadeUp ${0.3 + i * 0.08}s ease` }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
                  <div style={{
                    minWidth: 52, height: 52, background: "rgba(184,164,248,0.12)",
                    border: "1px solid rgba(184,164,248,0.25)", borderRadius: 14,
                    display: "flex", flexDirection: "column", alignItems: "center",
                    justifyContent: "center", fontSize: 20, gap: 2,
                  }}>
                    <span>{s.icon}</span>
                    <span style={{ fontSize: 10, color: "#b8a4f8", fontWeight: 600 }}>{s.stat}</span>
                  </div>
                  <div>
                    <div style={{ fontSize: 14, color: "rgba(255,255,255,0.8)", lineHeight: 1.6, marginBottom: 8 }}>{s.claim}</div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", fontStyle: "italic" }}>— {s.source}</div>
                  </div>
                </div>
              </div>
            ))}
            <div style={{ ...styles.card, background: "rgba(110,231,247,0.05)", borderColor: "rgba(110,231,247,0.15)", marginTop: 4 }}>
              <div style={{ fontSize: 13, color: "#6ee7f7", marginBottom: 8, fontFamily: "'Cormorant Garamond', serif", fontSize: 18 }}>The key insight</div>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.7, margin: 0 }}>
                Sleep is not just rest — it's active restoration. Your brain clears waste products, consolidates memories, and regulates hormones. Protecting sleep is protecting your entire health.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ── NAVBAR ─────────────────────────────────────────────────────── */}
      <nav style={styles.navBar}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            background: "none", border: "none", cursor: "pointer",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
            padding: "4px 8px", transition: "opacity 0.2s",
            opacity: tab === t.id ? 1 : 0.4,
          }}>
            <span style={{ fontSize: 20 }}>{t.icon}</span>
            <span style={{ fontSize: 9, letterSpacing: 0.5, color: tab === t.id ? "#b8a4f8" : "rgba(255,255,255,0.5)", textTransform: "uppercase" }}>{t.label}</span>
            {tab === t.id && <div style={{ width: 16, height: 2, background: "#b8a4f8", borderRadius: 2, marginTop: 1 }} />}
          </button>
        ))}
      </nav>
    </div>
  );
}
