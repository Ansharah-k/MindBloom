'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Heart, Moon, Sun, Quote as QuoteIcon, ChevronRight, ArrowLeft, Star, Clock, Shield } from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from 'recharts';

// ─── DATA ─────────────────────────────────────────────────────────────────────

const moodOptions = [
  { emoji: "😊", label: "Happy" },
  { emoji: "😌", label: "Calm" },
  { emoji: "💪", label: "Motivated" },
  { emoji: "🎉", label: "Excited" },
  { emoji: "😢", label: "Sad" },
  { emoji: "😟", label: "Anxious" },
  { emoji: "😴", label: "Tired" },
  { emoji: "🔥", label: "Burned Out" },
];

const meditationVideos = [
  { title: "Morning Meditation", sub: "10 min • Energise", url: "https://www.youtube.com/embed/4a8fU7v4z8Y" },
  { title: "Anxiety Relief", sub: "8 min • Breathwork", url: "https://www.youtube.com/embed/tybOi4hjZFQ" },
  { title: "Deep Sleep", sub: "15 min • Unwind", url: "https://www.youtube.com/embed/1ZYbU82GVz4" },
];

const therapists = [
  { name: "Dr. Ayesha Malik", spec: "Anxiety & Stress", exp: "8 yrs", rating: 4.9, avail: "Mon–Fri" },
  { name: "Dr. Zara Hussain", spec: "Depression & Grief", exp: "12 yrs", rating: 4.8, avail: "Tue–Sat" },
  { name: "Dr. Imran Siddiqui", spec: "Trauma & PTSD", exp: "10 yrs", rating: 4.7, avail: "Mon–Thu" },
];

const quotes = [
  "You are allowed to be a work in progress and still be enough.",
  "Healing is not linear. Every small step forward matters.",
  "Be gentle with yourself. You are a child of the universe.",
  "Your feelings are valid. Your presence is enough.",
];

type Step = 'landing' | 'register' | 'login' | 'dashboard' | 'mood' | 'lifestyle' | 'emotional' | 'results' | 'therapists' | 'videos' | 'quotes';

// ─── ANIMATION HELPERS ────────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

function RevealText({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div ref={ref} variants={fadeUp} initial="hidden" animate={inView ? 'show' : 'hidden'} className={className}>
      {children}
    </motion.div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export default function MindBloom() {
  const [step, setStep] = useState<Step>('landing');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({ name: 'Friend', email: '' });
  const [darkMode, setDarkMode] = useState(false);
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);
  const [wellnessScore] = useState(84);
  const [currentQuote, setCurrentQuote] = useState(0);
  const [streak] = useState(12);

  // Lifestyle state
  const [sleepHours, setSleepHours] = useState(7);
  const [waterIntake, setWaterIntake] = useState(6);
  const [exerciseFreq, setExerciseFreq] = useState(3);
  const [dietBalanced, setDietBalanced] = useState<boolean | null>(null);
  const [sleepRefreshed, setSleepRefreshed] = useState<boolean | null>(null);

  // Emotional state
  const [overthinkingLevel, setOverthinkingLevel] = useState(3);
  const [socialSupport, setSocialSupport] = useState(7);
  const [gratitude, setGratitude] = useState<boolean | null>(null);

  const [recommendations] = useState([
    "Try 5-minute box breathing when overwhelmed",
    "Drink water mindfully — aim for 8 glasses daily",
    "Write 3 things you're grateful for each morning",
    "Take a gentle 20-minute evening walk",
  ]);

  const radarData = [
    { subject: 'Mood', A: 85 },
    { subject: 'Sleep', A: sleepHours * 10 },
    { subject: 'Energy', A: exerciseFreq * 22 },
    { subject: 'Social', A: socialSupport * 10 },
    { subject: 'Mindfulness', A: gratitude ? 90 : 50 },
  ];

  useEffect(() => {
    try {
      const saved = localStorage.getItem('mindbloomUser');
      if (saved) {
        setUser(JSON.parse(saved));
        setIsLoggedIn(true);
        setStep('dashboard');
      }
    } catch (_) {}
  }, []);

  const toggleMood = (label: string) =>
    setSelectedMoods((p) => (p.includes(label) ? p.filter((m) => m !== label) : [...p, label]));

  const handleAuth = (e: React.FormEvent, isRegister: boolean) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const emailEl = form.elements.namedItem('email') as HTMLInputElement;
    const nameEl = form.elements.namedItem('name') as HTMLInputElement | null;
    const newUser = { name: nameEl?.value || 'Friend', email: emailEl.value };
    try { localStorage.setItem('mindbloomUser', JSON.stringify(newUser)); } catch (_) {}
    setUser(newUser);
    setIsLoggedIn(true);
    setStep('dashboard');
  };

  const handleLogout = () => {
    try { localStorage.removeItem('mindbloomUser'); } catch (_) {}
    setUser({ name: 'Friend', email: '' });
    setIsLoggedIn(false);
    setSelectedMoods([]);
    setStep('landing');
  };

  // ── THEME TOKENS ────────────────────────────────────────────────────────────
  const dark = darkMode;
  const bg      = dark ? '#0a0a12' : '#f8f7ff';
  const surface = dark ? '#13131f' : '#ffffff';
  const border  = dark ? '#ffffff14' : '#0000000f';
  const muted   = dark ? '#8b8ba0' : '#6b6b80';
  const accent  = '#7c5cfc';           // deep violet
  const accent2 = '#00c4a3';           // teal
  const text    = dark ? '#ececf4' : '#1a1a2e';

  const css: React.CSSProperties = {
    background: bg,
    color: text,
    minHeight: '100vh',
    fontFamily: "'Inter', 'SF Pro Display', system-ui, sans-serif",
    overflowX: 'hidden',
  };

  // ── NAVBAR ──────────────────────────────────────────────────────────────────
  const Navbar = () => (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: dark ? 'rgba(10,10,18,0.85)' : 'rgba(248,247,255,0.9)',
      backdropFilter: 'blur(20px)',
      borderBottom: `1px solid ${border}`,
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 32px', height: 68, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <motion.button whileHover={{ scale: 1.03 }} onClick={() => isLoggedIn ? setStep('dashboard') : setStep('landing')}
          style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'none', border: 'none', cursor: 'pointer' }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg, ${accent}, ${accent2})`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Heart size={18} color="#fff" />
          </div>
          <span style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.5px', background: `linear-gradient(135deg, ${accent}, ${accent2})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            MindBloom
          </span>
        </motion.button>

        {isLoggedIn && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            {(['dashboard','therapists','videos','quotes'] as Step[]).map((s) => (
              <motion.button key={s} whileHover={{ color: accent }} onClick={() => setStep(s)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: step === s ? accent : muted, fontSize: 14, fontWeight: 500, textTransform: 'capitalize' }}>
                {s === 'dashboard' ? 'Home' : s === 'videos' ? 'Meditate' : s.charAt(0).toUpperCase() + s.slice(1)}
              </motion.button>
            ))}
            <motion.button whileHover={{ scale: 1.1 }} onClick={() => setDarkMode(!dark)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: muted, display: 'flex', alignItems: 'center' }}>
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </motion.button>
            <motion.button whileHover={{ scale: 1.03 }} onClick={handleLogout}
              style={{ background: 'none', border: `1px solid ${border}`, cursor: 'pointer', color: muted, fontSize: 13, padding: '6px 14px', borderRadius: 8 }}>
              Log out
            </motion.button>
          </div>
        )}
        {!isLoggedIn && (
          <motion.button whileHover={{ scale: 1.03 }} onClick={() => setDarkMode(!dark)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: muted }}>
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </motion.button>
        )}
      </div>
    </nav>
  );

  // ── BTN HELPERS ─────────────────────────────────────────────────────────────
  const PrimaryBtn = ({ children, onClick, disabled }: { children: React.ReactNode; onClick?: () => void; disabled?: boolean }) => (
    <motion.button whileHover={disabled ? {} : { scale: 1.03 }} whileTap={disabled ? {} : { scale: 0.97 }}
      onClick={onClick} disabled={disabled}
      style={{
        background: disabled ? '#ccc' : `linear-gradient(135deg, ${accent}, ${accent2})`,
        border: 'none', borderRadius: 14, color: '#fff', cursor: disabled ? 'not-allowed' : 'pointer',
        fontSize: 16, fontWeight: 600, padding: '16px 40px', letterSpacing: '-0.2px',
        display: 'inline-flex', alignItems: 'center', gap: 8,
      }}>
      {children}
    </motion.button>
  );

  const GhostBtn = ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => (
    <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={onClick}
      style={{
        background: 'none', border: `1.5px solid ${accent}`, borderRadius: 14, color: accent,
        cursor: 'pointer', fontSize: 16, fontWeight: 600, padding: '15px 40px',
      }}>
      {children}
    </motion.button>
  );

  const BackBtn = ({ onClick }: { onClick: () => void }) => (
    <motion.button whileHover={{ x: -3 }} onClick={onClick}
      style={{ background: 'none', border: 'none', cursor: 'pointer', color: muted, display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, marginBottom: 32 }}>
      <ArrowLeft size={16} /> Back
    </motion.button>
  );

  const Card = ({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) => (
    <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: 20, padding: 32, ...style }}>
      {children}
    </div>
  );

  // ── FLOATING BLOBS (decorative) ──────────────────────────────────────────────
  const Blobs = () => (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
      <motion.div animate={{ x: [0, 30, 0], y: [0, -20, 0] }} transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        style={{ position: 'absolute', top: '10%', right: '-5%', width: 500, height: 500, borderRadius: '50%', background: `radial-gradient(circle, ${accent}18 0%, transparent 70%)` }} />
      <motion.div animate={{ x: [0, -20, 0], y: [0, 30, 0] }} transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
        style={{ position: 'absolute', bottom: '10%', left: '-5%', width: 400, height: 400, borderRadius: '50%', background: `radial-gradient(circle, ${accent2}18 0%, transparent 70%)` }} />
    </div>
  );

  const wrap: React.CSSProperties = { maxWidth: 1100, margin: '0 auto', padding: '0 32px', position: 'relative', zIndex: 1 };

  // ─────────────────────────────────────────────────────────────────────────────
  // PAGES
  // ─────────────────────────────────────────────────────────────────────────────

  // ── LANDING ──────────────────────────────────────────────────────────────────
  const Landing = () => (
    <div style={{ ...wrap, paddingTop: 160, paddingBottom: 120 }}>
      <motion.div variants={stagger} initial="hidden" animate="show">
        <motion.p variants={fadeUp} style={{ fontSize: 13, fontWeight: 600, letterSpacing: 3, color: accent, textTransform: 'uppercase', marginBottom: 20 }}>
          Your mental wellness companion
        </motion.p>
        <motion.h1 variants={fadeUp} style={{ fontSize: 'clamp(48px, 8vw, 96px)', fontWeight: 800, lineHeight: 1.0, letterSpacing: '-3px', marginBottom: 28, maxWidth: 780 }}>
          How are you{' '}
          <span style={{ background: `linear-gradient(135deg, ${accent}, ${accent2})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            feeling
          </span>{' '}
          today?
        </motion.h1>
        <motion.p variants={fadeUp} style={{ fontSize: 20, color: muted, marginBottom: 52, maxWidth: 520, lineHeight: 1.6 }}>
          Track your moods, build healthy habits, and connect with professional support — all in one calm space.
        </motion.p>
        <motion.div variants={fadeUp} style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <PrimaryBtn onClick={() => setStep('register')}>Start your journey <ChevronRight size={18} /></PrimaryBtn>
          <GhostBtn onClick={() => setStep('login')}>I have an account</GhostBtn>
        </motion.div>

        {/* Scroll-story stat pills */}
        <motion.div variants={stagger} style={{ display: 'flex', gap: 20, marginTop: 80, flexWrap: 'wrap' }}>
          {[['94%', 'report lower anxiety in 2 weeks'], ['12k+', 'active users globally'], ['Licensed', 'therapist network']].map(([n, l]) => (
            <motion.div key={n} variants={fadeUp}
              style={{ background: surface, border: `1px solid ${border}`, borderRadius: 14, padding: '14px 22px', display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 22, fontWeight: 800, color: accent }}>{n}</span>
              <span style={{ fontSize: 14, color: muted, maxWidth: 140 }}>{l}</span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );

  // ── AUTH ──────────────────────────────────────────────────────────────────────
  const Auth = ({ isRegister }: { isRegister: boolean }) => (
    <div style={{ ...wrap, paddingTop: 140, display: 'flex', justifyContent: 'center' }}>
      <motion.div variants={fadeUp} initial="hidden" animate="show" style={{ width: '100%', maxWidth: 440 }}>
        <BackBtn onClick={() => setStep('landing')} />
        <Card>
          <h2 style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-1px', marginBottom: 8 }}>
            {isRegister ? 'Create your account' : 'Welcome back'}
          </h2>
          <p style={{ color: muted, marginBottom: 32, fontSize: 15 }}>
            {isRegister ? 'Start your wellness journey today.' : 'Continue where you left off.'}
          </p>
          <form onSubmit={(e) => handleAuth(e, isRegister)} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {isRegister && (
              <input name="name" placeholder="Full name" required
                style={{ width: '100%', padding: '14px 16px', borderRadius: 12, border: `1.5px solid ${border}`, background: bg, color: text, fontSize: 15, outline: 'none', boxSizing: 'border-box' }} />
            )}
            <input name="email" type="email" placeholder="Email address" required
              style={{ width: '100%', padding: '14px 16px', borderRadius: 12, border: `1.5px solid ${border}`, background: bg, color: text, fontSize: 15, outline: 'none', boxSizing: 'border-box' }} />
            <input type="password" placeholder="Password" required
              style={{ width: '100%', padding: '14px 16px', borderRadius: 12, border: `1.5px solid ${border}`, background: bg, color: text, fontSize: 15, outline: 'none', boxSizing: 'border-box' }} />
            <div style={{ marginTop: 8 }}>
              <PrimaryBtn>{isRegister ? 'Create account' : 'Log in'} <ChevronRight size={16} /></PrimaryBtn>
            </div>
          </form>
          <p style={{ marginTop: 20, fontSize: 14, color: muted, textAlign: 'center' }}>
            {isRegister ? 'Already have an account? ' : "Don't have an account? "}
            <button onClick={() => setStep(isRegister ? 'login' : 'register')}
              style={{ background: 'none', border: 'none', color: accent, cursor: 'pointer', fontWeight: 600 }}>
              {isRegister ? 'Log in' : 'Sign up'}
            </button>
          </p>
        </Card>
      </motion.div>
    </div>
  );

  // ── DASHBOARD ──────────────────────────────────────────────────────────────────
  const Dashboard = () => (
    <div style={{ ...wrap, paddingTop: 120, paddingBottom: 80 }}>
      <motion.div variants={stagger} initial="hidden" animate="show">
        <motion.div variants={fadeUp} style={{ marginBottom: 56 }}>
          <p style={{ fontSize: 13, color: muted, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>🔥 {streak}-day streak</p>
          <h1 style={{ fontSize: 'clamp(36px, 5vw, 60px)', fontWeight: 800, letterSpacing: '-2px' }}>
            Welcome back, <span style={{ color: accent }}>{user.name}</span>
          </h1>
          <p style={{ fontSize: 18, color: muted, marginTop: 8 }}>What would you like to focus on today?</p>
        </motion.div>

        <motion.div variants={stagger} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
          {[
            { label: 'Daily Check-in', sub: 'Assess your mood & habits', emoji: '📊', action: () => setStep('mood'), highlight: true },
            { label: 'Find a Therapist', sub: 'Connect with professionals', emoji: '🧘‍♀️', action: () => setStep('therapists') },
            { label: 'Guided Meditation', sub: 'Calm your mind', emoji: '🎵', action: () => setStep('videos') },
            { label: 'Daily Wisdom', sub: 'Gentle reminders for your day', emoji: '✨', action: () => setStep('quotes') },
          ].map((item) => (
            <motion.button key={item.label} variants={fadeUp} whileHover={{ y: -6, boxShadow: `0 20px 60px ${accent}22` }} whileTap={{ scale: 0.98 }}
              onClick={item.action}
              style={{
                background: item.highlight ? `linear-gradient(135deg, ${accent}, ${accent2})` : surface,
                border: `1px solid ${item.highlight ? 'transparent' : border}`,
                borderRadius: 20, padding: 32, cursor: 'pointer', textAlign: 'left',
                color: item.highlight ? '#fff' : text,
                transition: 'box-shadow 0.3s',
              }}>
              <div style={{ fontSize: 40, marginBottom: 16 }}>{item.emoji}</div>
              <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>{item.label}</div>
              <div style={{ fontSize: 14, opacity: 0.7 }}>{item.sub}</div>
            </motion.button>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );

  // ── MOOD ───────────────────────────────────────────────────────────────────────
  const MoodStep = () => (
    <div style={{ ...wrap, paddingTop: 120, paddingBottom: 80 }}>
      <BackBtn onClick={() => setStep('dashboard')} />
      <motion.div variants={stagger} initial="hidden" animate="show">
        <motion.div variants={fadeUp} style={{ marginBottom: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: 2, color: accent, textTransform: 'uppercase' }}>Step 1 of 3</span>
        </motion.div>
        <motion.h1 variants={fadeUp} style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 800, letterSpacing: '-2px', marginBottom: 12 }}>
          How are you feeling?
        </motion.h1>
        <motion.p variants={fadeUp} style={{ color: muted, fontSize: 17, marginBottom: 48 }}>
          Select all that apply — no right or wrong answers here.
        </motion.p>

        <motion.div variants={stagger} style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, maxWidth: 600 }}>
          {moodOptions.map((m) => {
            const selected = selectedMoods.includes(m.label);
            return (
              <motion.button key={m.label} variants={fadeUp} whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.92 }}
                onClick={() => toggleMood(m.label)}
                title={m.label}
                style={{
                  fontSize: 48, padding: '20px 0', borderRadius: 18, cursor: 'pointer',
                  border: `2px solid ${selected ? accent : border}`,
                  background: selected ? `${accent}18` : surface,
                  transition: 'all 0.2s',
                  aspectRatio: '1',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: selected ? `0 0 0 3px ${accent}44` : 'none',
                }}>
                {m.emoji}
              </motion.button>
            );
          })}
        </motion.div>

        {selectedMoods.length > 0 && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: muted, fontSize: 14, marginTop: 20 }}>
            Selected: {selectedMoods.join(' · ')}
          </motion.p>
        )}

        <div style={{ marginTop: 48 }}>
          <PrimaryBtn disabled={selectedMoods.length === 0} onClick={() => setStep('lifestyle')}>
            Continue <ChevronRight size={18} />
          </PrimaryBtn>
        </div>
      </motion.div>
    </div>
  );

  // ── LIFESTYLE ──────────────────────────────────────────────────────────────────
  const LifestyleStep = () => {
    const SliderRow = ({ label, value, min, max, unit, onChange }: { label: string; value: number; min: number; max: number; unit: string; onChange: (v: number) => void }) => (
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
          <span style={{ fontSize: 15, fontWeight: 500 }}>{label}</span>
          <span style={{ fontSize: 15, fontWeight: 700, color: accent }}>{value} {unit}</span>
        </div>
        <input type="range" min={min} max={max} value={value} onChange={(e) => onChange(Number(e.target.value))}
          style={{ width: '100%', accentColor: accent, cursor: 'pointer' }} />
      </div>
    );

    const YesNo = ({ label, value, onChange }: { label: string; value: boolean | null; onChange: (v: boolean) => void }) => (
      <div style={{ marginBottom: 24 }}>
        <p style={{ fontSize: 15, fontWeight: 500, marginBottom: 12 }}>{label}</p>
        <div style={{ display: 'flex', gap: 12 }}>
          {[true, false].map((v) => (
            <motion.button key={String(v)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => onChange(v)}
              style={{
                padding: '10px 28px', borderRadius: 10, cursor: 'pointer', fontSize: 14, fontWeight: 600,
                border: `1.5px solid ${value === v ? accent : border}`,
                background: value === v ? `${accent}18` : surface,
                color: value === v ? accent : muted,
              }}>
              {v ? 'Yes' : 'No'}
            </motion.button>
          ))}
        </div>
      </div>
    );

    return (
      <div style={{ ...wrap, paddingTop: 120, paddingBottom: 80, maxWidth: 680 }}>
        <BackBtn onClick={() => setStep('mood')} />
        <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: 2, color: accent, textTransform: 'uppercase' }}>Step 2 of 3</span>
        <h1 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 800, letterSpacing: '-1.5px', margin: '12px 0 8px' }}>Lifestyle check-in</h1>
        <p style={{ color: muted, fontSize: 16, marginBottom: 40 }}>Help us understand your day-to-day habits.</p>

        <Card>
          <SliderRow label="Hours of sleep last night" value={sleepHours} min={2} max={12} unit="hrs" onChange={setSleepHours} />
          <SliderRow label="Glasses of water today" value={waterIntake} min={0} max={12} unit="glasses" onChange={setWaterIntake} />
          <SliderRow label="Exercise days per week" value={exerciseFreq} min={0} max={7} unit="days" onChange={setExerciseFreq} />
          <YesNo label="Did you feel refreshed when you woke up?" value={sleepRefreshed} onChange={setSleepRefreshed} />
          <YesNo label="Have you eaten balanced meals today?" value={dietBalanced} onChange={setDietBalanced} />
        </Card>

        <div style={{ marginTop: 32 }}>
          <PrimaryBtn onClick={() => setStep('emotional')}>Continue <ChevronRight size={18} /></PrimaryBtn>
        </div>
      </div>
    );
  };

  // ── EMOTIONAL ─────────────────────────────────────────────────────────────────
  const EmotionalStep = () => {
    const levels = ['Rarely', 'Sometimes', 'Often', 'Very often', 'Always'];
    const YesNo = ({ label, value, onChange }: { label: string; value: boolean | null; onChange: (v: boolean) => void }) => (
      <div style={{ marginBottom: 24 }}>
        <p style={{ fontSize: 15, fontWeight: 500, marginBottom: 12 }}>{label}</p>
        <div style={{ display: 'flex', gap: 12 }}>
          {[true, false].map((v) => (
            <motion.button key={String(v)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => onChange(v)}
              style={{
                padding: '10px 28px', borderRadius: 10, cursor: 'pointer', fontSize: 14, fontWeight: 600,
                border: `1.5px solid ${value === v ? accent : border}`,
                background: value === v ? `${accent}18` : surface,
                color: value === v ? accent : muted,
              }}>
              {v ? 'Yes' : 'No'}
            </motion.button>
          ))}
        </div>
      </div>
    );

    return (
      <div style={{ ...wrap, paddingTop: 120, paddingBottom: 80, maxWidth: 680 }}>
        <BackBtn onClick={() => setStep('lifestyle')} />
        <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: 2, color: accent, textTransform: 'uppercase' }}>Step 3 of 3</span>
        <h1 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 800, letterSpacing: '-1.5px', margin: '12px 0 8px' }}>Emotional check-in</h1>
        <p style={{ color: muted, fontSize: 16, marginBottom: 40 }}>Let's understand your inner world.</p>

        <Card>
          <div style={{ marginBottom: 28 }}>
            <p style={{ fontSize: 15, fontWeight: 500, marginBottom: 12 }}>How often do you find yourself overthinking?</p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {levels.map((l, i) => (
                <motion.button key={l} whileHover={{ scale: 1.05 }} onClick={() => setOverthinkingLevel(i + 1)}
                  style={{
                    padding: '8px 18px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 500,
                    border: `1.5px solid ${overthinkingLevel === i + 1 ? accent : border}`,
                    background: overthinkingLevel === i + 1 ? `${accent}18` : surface,
                    color: overthinkingLevel === i + 1 ? accent : muted,
                  }}>
                  {l}
                </motion.button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontSize: 15, fontWeight: 500 }}>How supported do you feel socially?</span>
              <span style={{ fontSize: 15, fontWeight: 700, color: accent }}>{socialSupport}/10</span>
            </div>
            <input type="range" min={1} max={10} value={socialSupport} onChange={(e) => setSocialSupport(Number(e.target.value))}
              style={{ width: '100%', accentColor: accent, cursor: 'pointer' }} />
          </div>

          <YesNo label="Did you practice gratitude or mindfulness today?" value={gratitude} onChange={setGratitude} />
        </Card>

        <div style={{ marginTop: 32 }}>
          <PrimaryBtn onClick={() => setStep('results')}>See my wellness report <ChevronRight size={18} /></PrimaryBtn>
        </div>
      </div>
    );
  };

  // ── RESULTS ───────────────────────────────────────────────────────────────────
  const Results = () => {
    const scoreColor = wellnessScore >= 80 ? accent2 : wellnessScore >= 60 ? '#f59e0b' : '#ef4444';
    return (
      <div style={{ ...wrap, paddingTop: 120, paddingBottom: 80 }}>
        <motion.div variants={stagger} initial="hidden" animate="show">
          <motion.div variants={fadeUp} style={{ textAlign: 'center', marginBottom: 64 }}>
            <p style={{ fontSize: 13, color: muted, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>Your wellness report</p>
            <div style={{ fontSize: 'clamp(80px, 14vw, 140px)', fontWeight: 900, color: scoreColor, lineHeight: 1, letterSpacing: '-5px' }}>
              {wellnessScore}
            </div>
            <p style={{ fontSize: 18, color: muted, marginTop: 8 }}>Overall wellness score out of 100</p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            <motion.div variants={fadeUp}>
              <Card style={{ height: '100%' }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 24 }}>Wellness dimensions</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke={border} />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: muted, fontSize: 13 }} />
                    <Radar dataKey="A" stroke={accent} fill={accent} fillOpacity={0.25} strokeWidth={2} />
                  </RadarChart>
                </ResponsiveContainer>
              </Card>
            </motion.div>

            <motion.div variants={stagger} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {recommendations.map((r, i) => (
                <motion.div key={i} variants={fadeUp}>
                  <Card style={{ padding: '20px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: accent2, marginTop: 7, flexShrink: 0 }} />
                      <p style={{ fontSize: 15, lineHeight: 1.5 }}>{r}</p>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>

          <motion.div variants={fadeUp} style={{ marginTop: 40, display: 'flex', gap: 16, justifyContent: 'center' }}>
            <PrimaryBtn onClick={() => setStep('dashboard')}>Back to home</PrimaryBtn>
            <GhostBtn onClick={() => setStep('therapists')}>Talk to a therapist</GhostBtn>
          </motion.div>
        </motion.div>
      </div>
    );
  };

  // ── THERAPISTS ────────────────────────────────────────────────────────────────
  const Therapists = () => (
    <div style={{ ...wrap, paddingTop: 120, paddingBottom: 80 }}>
      <BackBtn onClick={() => setStep('dashboard')} />
      <RevealText>
        <h1 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 800, letterSpacing: '-2px', marginBottom: 12 }}>Licensed Therapists</h1>
        <p style={{ color: muted, fontSize: 17, marginBottom: 48 }}>Compassionate professionals ready to support you.</p>
      </RevealText>

      <motion.div variants={stagger} initial="hidden" animate="show" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
        {therapists.map((t) => (
          <motion.div key={t.name} variants={fadeUp} whileHover={{ y: -6 }}>
            <Card>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                <div style={{ width: 56, height: 56, borderRadius: 16, background: `linear-gradient(135deg, ${accent}, ${accent2})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
                  🧑‍⚕️
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 17 }}>{t.name}</div>
                  <div style={{ color: muted, fontSize: 13 }}>{t.spec}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 14, color: muted }}>
                  <Clock size={14} /> {t.exp} exp
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 14, color: muted }}>
                  <Star size={14} color="#f59e0b" fill="#f59e0b" /> {t.rating}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 14, color: muted }}>
                  <Shield size={14} /> Licensed
                </div>
              </div>
              <p style={{ fontSize: 13, color: muted, marginBottom: 20 }}>Available: {t.avail}</p>
              <motion.button whileHover={{ scale: 1.03 }} style={{
                width: '100%', padding: '12px 0', borderRadius: 10, cursor: 'pointer',
                background: `linear-gradient(135deg, ${accent}, ${accent2})`,
                border: 'none', color: '#fff', fontWeight: 600, fontSize: 14,
              }}>
                Book a session
              </motion.button>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );

  // ── VIDEOS ────────────────────────────────────────────────────────────────────
  const Videos = () => (
    <div style={{ ...wrap, paddingTop: 120, paddingBottom: 80 }}>
      <BackBtn onClick={() => setStep('dashboard')} />
      <RevealText>
        <h1 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 800, letterSpacing: '-2px', marginBottom: 12 }}>Guided Meditations</h1>
        <p style={{ color: muted, fontSize: 17, marginBottom: 48 }}>Breathe. You're in a safe space.</p>
      </RevealText>

      <motion.div variants={stagger} initial="hidden" animate="show" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
        {meditationVideos.map((v, i) => (
          <motion.div key={i} variants={fadeUp} whileHover={{ y: -8 }}>
            <Card style={{ padding: 0, overflow: 'hidden' }}>
              <iframe width="100%" height="220" src={v.url} allowFullScreen style={{ display: 'block', border: 'none' }} title={v.title} />
              <div style={{ padding: '20px 24px' }}>
                <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 4 }}>{v.title}</div>
                <div style={{ color: muted, fontSize: 13 }}>{v.sub}</div>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );

  // ── QUOTES ────────────────────────────────────────────────────────────────────
  const Quotes = () => (
    <div style={{ ...wrap, paddingTop: 140, paddingBottom: 80, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', minHeight: '80vh', justifyContent: 'center' }}>
      <QuoteIcon size={52} color={accent} style={{ marginBottom: 40, opacity: 0.4 }} />
      <AnimatePresence mode="wait">
        <motion.p key={currentQuote} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }}
          style={{ fontSize: 'clamp(22px, 4vw, 40px)', fontWeight: 300, lineHeight: 1.5, letterSpacing: '-0.5px', maxWidth: 680, marginBottom: 52, color: text }}>
          "{quotes[currentQuote]}"
        </motion.p>
      </AnimatePresence>
      <GhostBtn onClick={() => setCurrentQuote((p) => (p + 1) % quotes.length)}>
        Next reminder →
      </GhostBtn>
    </div>
  );

  // ─── RENDER ──────────────────────────────────────────────────────────────────
  return (
    <div style={css}>
      <Blobs />
      <Navbar />
      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
          {step === 'landing'    && <Landing />}
          {step === 'register'   && <Auth isRegister={true} />}
          {step === 'login'      && <Auth isRegister={false} />}
          {step === 'dashboard'  && <Dashboard />}
          {step === 'mood'       && <MoodStep />}
          {step === 'lifestyle'  && <LifestyleStep />}
          {step === 'emotional'  && <EmotionalStep />}
          {step === 'results'    && <Results />}
          {step === 'therapists' && <Therapists />}
          {step === 'videos'     && <Videos />}
          {step === 'quotes'     && <Quotes />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}