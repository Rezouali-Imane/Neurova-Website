import { useState, useEffect, useRef, useCallback } from "react";
import { motion, useInView, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import LiquidEther from "./components/LiquidEther/LiquidEther";
const BASE = import.meta.env.BASE_URL;
const C = {
  orchid1:"#C8A2C8", orchid2:"#B284BE", periwinkle:"#A2ADD0",
  cream:"#ECEBBD", peach:"#F8B878",
  dark:"#0D0B14", darkMid:"#13101F", darkCard:"#1A1628",
  darkBorder:"#2A2440", white:"#FFFFF0",
};
function BlurText({ text = "", delay = 80, animateBy = "words", style }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const segs = animateBy === "words" ? text.split(" ") : text.split("");
  return (
    <span ref={ref} style={{ display: "inline", ...style }}>
      {segs.map((s, i) => (
        <motion.span key={i}
          initial={{ opacity: 0, filter: "blur(12px)", y: -18 }}
          animate={inView ? { opacity: 1, filter: "blur(0px)", y: 0, transition: { delay: i * delay / 1000, duration: 0.55, ease: [.25, .1, .25, 1] } } : {}}
          style={{ display: "inline-block", willChange: "transform,filter,opacity" }}>
          {s}{animateBy === "words" && i < segs.length - 1 ? "\u00A0" : ""}
        </motion.span>
      ))}
    </span>
  );
}
function ShinyText({ text, speed = 3, style }) {
  return (
    <span style={{ position: "relative", display: "inline-block", ...style }}>
      <style>{`@keyframes shny{0%{background-position:-200% center}100%{background-position:200% center}}`}</style>
      <span style={{ background: `linear-gradient(90deg,${C.orchid1} 0%,${C.peach} 25%,${C.white} 50%,${C.orchid2} 75%,${C.periwinkle} 100%)`, backgroundSize: "200% auto", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", animation: `shny ${speed}s linear infinite` }}>{text}</span>
    </span>
  );
}
function CountUp({ to, from = 0, duration = 1.5, suffix = "", decimals = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const mv = useMotionValue(from);
  const sp = useSpring(mv, { duration: duration * 1000, bounce: 0 });
  const [val, setVal] = useState(from.toFixed(decimals));
  useEffect(() => { if (inView) mv.set(to); }, [inView, to]);
  useEffect(() => sp.on("change", v => setVal(v.toFixed(decimals))), [sp]);
  return <span ref={ref}>{val}{suffix}</span>;
}
function AnimatedContent({ children, direction = "vertical", distance = 40, delay = 0, blur = false, threshold = 0.12, style }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: threshold });
  return (
    <motion.div ref={ref} style={style}
      initial={{ opacity: 0, filter: blur ? "blur(8px)" : "blur(0px)", y: direction === "vertical" ? distance : 0, x: direction === "horizontal" ? distance : 0 }}
      animate={inView ? { opacity: 1, filter: "blur(0px)", y: 0, x: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  );
}
function TiltedCard({ children, scale = 1.04, tiltMaxX = 12, tiltMaxY = 12, glareOpacity = 0.12 }) {
  const ref = useRef(null);
  const [t, setT] = useState({ x: 0, y: 0, gx: 50, gy: 50, on: false });
  const mv = useCallback((e) => {
    const r = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
    setT({ x: (py - .5) * tiltMaxX * 2, y: (px - .5) * -tiltMaxY * 2, gx: px * 100, gy: py * 100, on: true });
  }, [tiltMaxX, tiltMaxY]);
  return (
    <motion.div ref={ref} onMouseMove={mv} onMouseLeave={() => setT(p => ({ ...p, x: 0, y: 0, on: false }))}
      animate={{ rotateX: t.x, rotateY: t.y, scale: t.on ? scale : 1 }}
      transition={{ type: "spring", stiffness: 280, damping: 28 }}
      style={{ transformStyle: "preserve-3d", position: "relative" }}>
      {children}
      <div style={{ position: "absolute", inset: 0, borderRadius: "inherit", pointerEvents: "none", background: `radial-gradient(circle at ${t.gx}% ${t.gy}%,rgba(255,255,255,${t.on ? glareOpacity : 0}),transparent 60%)`, transition: "opacity .3s" }} />
    </motion.div>
  );
}
function ClickSpark({ children, sparkColor = C.orchid1, sparkCount = 8, sparkRadius = 55 }) {
  const [sparks, setSparks] = useState([]);
  const fire = (e) => {
    const r = e.currentTarget.getBoundingClientRect(), id = Date.now();
    setSparks(s => [...s, { id, cx: e.clientX - r.left, cy: e.clientY - r.top }]);
    setTimeout(() => setSparks(s => s.filter(p => p.id !== id)), 650);
  };
  return (
    <div style={{ position: "relative", display: "inline-block" }} onClick={fire}>
      {children}
      <AnimatePresence>
        {sparks.map(sp => Array.from({ length: sparkCount }).map((_, i) => {
          const a = (i / sparkCount) * 2 * Math.PI;
          return <motion.div key={`${sp.id}-${i}`}
            initial={{ x: sp.cx, y: sp.cy, opacity: 1, scale: 1 }}
            animate={{ x: sp.cx + Math.cos(a) * sparkRadius, y: sp.cy + Math.sin(a) * sparkRadius, opacity: 0, scale: 0 }}
            exit={{ opacity: 0 }} transition={{ duration: 0.5, ease: "easeOut" }}
            style={{ position: "absolute", top: 0, left: 0, width: 6, height: 6, borderRadius: "50%", background: sparkColor, pointerEvents: "none" }} />;
        }))}
      </AnimatePresence>
    </div>
  );
}
function StarBorder({ children, color = C.orchid2, speed = "4s", style, onClick }) {
  return (
    <div onClick={onClick} style={{ position: "relative", display: "inline-block", padding: 1, borderRadius: 99, cursor: "pointer", ...style }}>
      <style>{`@keyframes sbr{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
      <div style={{ position: "absolute", inset: -1, borderRadius: 99, overflow: "hidden", zIndex: 0 }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", width: "200%", height: "200%", transform: "translate(-50%,-50%)", background: `conic-gradient(from 0deg,transparent 0%,${color} 5%,transparent 10%)`, animation: `sbr ${speed} linear infinite` }} />
      </div>
      <div style={{ position: "relative", zIndex: 1, borderRadius: 99, background: C.dark }}>{children}</div>
    </div>
  );
}
function Magnet({ children, strength = 28 }) {
  const ref = useRef(null);
  const x = useMotionValue(0), y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 20 }), sy = useSpring(y, { stiffness: 200, damping: 20 });
  return (
    <motion.div ref={ref} style={{ x: sx, y: sy, display: "inline-block" }}
      onMouseMove={e => { const r = ref.current.getBoundingClientRect(); x.set((e.clientX - r.left - r.width / 2) * strength / 100); y.set((e.clientY - r.top - r.height / 2) * strength / 100); }}
      onMouseLeave={() => { x.set(0); y.set(0); }}>
      {children}
    </motion.div>
  );
}
function ScrollReveal({ children, stagger = 0.055 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const words = typeof children === "string" ? children.split(" ") : null;
  if (!words) return <div ref={ref}>{children}</div>;
  return (
    <span ref={ref} style={{ display: "inline" }}>
      {words.map((w, i) => (
        <motion.span key={i} initial={{ opacity: 0, y: 26 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: i * stagger, duration: 0.5, ease: [.22, 1, .36, 1] }}
          style={{ display: "inline-block", marginRight: "0.25em" }}>{w}</motion.span>
      ))}
    </span>
  );
}
function GradientText({ text, gradient, style }) {
  return <span style={{ background: gradient || `linear-gradient(135deg,${C.orchid1},${C.orchid2},${C.periwinkle})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", ...style }}>{text}</span>;
}
function SectionBadge({ text, color = C.peach }) {
  return (
    <div style={{ display: "inline-block", background: color + "18", border: `1px solid ${color}50`, borderRadius: 99, padding: "6px 18px", marginBottom: 20 }}>
      <span style={{ color, fontSize: 11, fontWeight: 700, letterSpacing: 1.5 }}>{text}</span>
    </div>
  );
}
function Logo({ size = 36, showText = true }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <img src={`${BASE}images/logo.png`} alt="Neurova" style={{ width: size, height: size, objectFit: "contain", flexShrink: 0 }} />
      {showText && <span style={{ color: C.white, fontWeight: 800, fontSize: size * 0.5, letterSpacing: "-0.5px" }}>Neurova</span>}
    </div>
  );
}
function PhoneFrame({ children, label, active = false, onClick, animDelay = 0, width = 220 }) {
  const nr = Math.round;
  return (
    <AnimatedContent delay={animDelay} direction="vertical" distance={44} threshold={0.04}>
      <TiltedCard tiltMaxX={9} tiltMaxY={9} glareOpacity={0.11} scale={1.02}>
        <motion.div onClick={onClick}
          animate={{ borderColor: active ? C.orchid2 : C.darkBorder, boxShadow: active ? `0 0 0 1.5px ${C.orchid2},0 32px 64px rgba(0,0,0,.55),0 0 55px rgba(178,132,190,.22)` : `0 24px 48px rgba(0,0,0,.45)` }}
          transition={{ duration: 0.3 }}
          style={{ width, aspectRatio: "9/19.5", borderRadius: 40, overflow: "hidden", background: `linear-gradient(160deg,${C.darkMid},${C.dark})`, border: `1.5px solid ${C.darkBorder}`, cursor: onClick ? "pointer" : "default", position: "relative", flexShrink: 0 }}> <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: nr(width * .34), height: nr(width * .085), background: C.dark, borderRadius: `0 0 ${nr(width * .055)}px ${nr(width * .055)}px`, zIndex: 10 }} /> <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
            {children || (
              <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, padding: 28 }}>
                <div style={{ fontSize: 26, opacity: .18 }}></div>
                <div style={{ color: "rgba(245,240,255,.22)", fontSize: 11, textAlign: "center", lineHeight: 1.6 }}>Drop your<br />screenshot here</div>
                <div style={{ width: 40, height: 2, background: `linear-gradient(90deg,${C.orchid2},${C.periwinkle})`, borderRadius: 2, opacity: .35 }} />
              </div>
            )}
          </div> <div style={{ position: "absolute", bottom: 9, left: "50%", transform: "translateX(-50%)", width: nr(width * .36), height: 4, background: "rgba(245,240,255,.1)", borderRadius: 4 }} />
        </motion.div>
      </TiltedCard>
      {label && <div style={{ textAlign: "center", marginTop: 14, color: active ? C.orchid1 : "rgba(245,240,255,.38)", fontSize: 12, fontWeight: 700, transition: "color .2s" }}>{label}</div>}
    </AnimatedContent>
  );
}
function Nav({ active, setActive }) {
  const links = ["Home", "Features", "Design System", "Screens", "Coming Soon"];
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return (
    <motion.nav initial={{ y: -72, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: .7, ease: [.16, 1, .3, 1] }}
      style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: scrolled ? "rgba(13,11,20,.88)" : "transparent", backdropFilter: scrolled ? "blur(20px)" : "none", borderBottom: scrolled ? `1px solid ${C.darkBorder}` : "none", transition: "all .4s", padding: "0 5%", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
      <Magnet strength={18}><Logo size={34} /></Magnet>
      <div style={{ display: "flex", gap: 4 }}>
        {links.map(l => (
          <motion.button key={l} onClick={() => setActive(l)} whileHover={{ scale: 1.05 }} whileTap={{ scale: .96 }}
            style={{ background: active === l ? "rgba(178,132,190,.15)" : "transparent", border: `1px solid ${active === l ? C.orchid2 : "transparent"}`, color: active === l ? C.orchid1 : "rgba(245,240,255,.5)", borderRadius: 99, padding: "6px 15px", cursor: "pointer", fontSize: 13, fontWeight: 700 }}>
            {l}
          </motion.button>
        ))}
      </div>
      <ClickSpark sparkColor={C.orchid1} sparkCount={10}>
        <StarBorder color={C.orchid2} speed="5s">
          <div style={{ padding: "8px 20px", color: C.white, fontWeight: 800, fontSize: 13 }}>Get Early Access</div>
        </StarBorder>
      </ClickSpark>
    </motion.nav>
  );
}
function Hero() {
  return (
    <section style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "120px 5% 80px", position: "relative", overflow: "hidden" }}> <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <LiquidEther
          colors={[C.orchid2, C.orchid1, C.periwinkle]}
          mouseForce={20}
          cursorSize={100}
          isViscous
          viscous={30}
          resolution={0.5}
          autoDemo
          autoSpeed={1.2}
          autoIntensity={3.5}
          takeoverDuration={0.25}
          autoResumeDelay={3000}
          autoRampDuration={0.6}
        />
      </div> <div style={{ position: "absolute", inset: 0, background: "rgba(13,11,20,.55)", pointerEvents: "none", zIndex: 0 }} />

      <AnimatedContent delay={.1} blur>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(178,132,190,.12)", border: "1px solid rgba(178,132,190,.3)", borderRadius: 99, padding: "6px 18px", marginBottom: 32, position: "relative", zIndex: 1 }}>
          <motion.span animate={{ scale: [1, 1.4, 1], opacity: [1, .5, 1] }} transition={{ repeat: Infinity, duration: 2 }} style={{ width: 7, height: 7, borderRadius: "50%", background: C.orchid1, display: "block" }} />
          <span style={{ color: C.orchid1, fontSize: 11, fontWeight: 700, letterSpacing: 1.5 }}>AI-POWERED LEARNING COMPANION</span>
        </div>
      </AnimatedContent>

      <h1 style={{ fontSize: "clamp(62px,9.5vw,112px)", fontWeight: 800, lineHeight: .92, margin: "0 0 28px", letterSpacing: "-4px", color: C.white, position: "relative", zIndex: 1 }}>
        <BlurText text="Focus." delay={55} style={{ display: "block" }} />
        <BlurText text="Learn." delay={55} style={{ display: "block" }} />
        <ShinyText text="Thrive." speed={4} style={{ fontSize: "inherit", fontWeight: 800, letterSpacing: "inherit" }} />
      </h1>

      <AnimatedContent delay={.5} blur style={{ position: "relative", zIndex: 1 }}>
        <p style={{ color: "rgba(245,240,255,.52)", fontSize: 18, maxWidth: 520, lineHeight: 1.75, margin: "0 auto 48px", fontWeight: 700 }}>
          Neurova is your AI-powered academic companion — silence distractions, organise tasks, and actually achieve your goals.
        </p>
      </AnimatedContent>

      <AnimatedContent delay={.65} style={{ position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
          <ClickSpark sparkColor={C.peach} sparkCount={12} sparkRadius={72}>
            <motion.button whileHover={{ scale: 1.06 }} whileTap={{ scale: .97 }}
              style={{ background: `linear-gradient(135deg,${C.orchid2},${C.peach})`, border: "none", borderRadius: 99, padding: "15px 40px", color: "#0D0B14", fontWeight: 800, fontSize: 15, cursor: "pointer", boxShadow: "0 0 40px rgba(178,132,190,.35)" }}>
              Coming Soon
            </motion.button>
          </ClickSpark>
          <motion.button whileHover={{ scale: 1.04, borderColor: C.orchid2 }} whileTap={{ scale: .97 }}
            style={{ background: "rgba(245,240,255,.05)", border: `1px solid ${C.darkBorder}`, borderRadius: 99, padding: "15px 40px", color: C.white, fontWeight: 700, fontSize: 15, cursor: "pointer" }}>
            Watch Demo ▶
          </motion.button>
        </div>
      </AnimatedContent>

      <AnimatedContent delay={.8} style={{ position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", gap: 24, marginTop: 72, flexWrap: "wrap", justifyContent: "center" }}>
          {[{ to: 50, s: "K+", label: "Students" }, { to: 4.9, s: "★", label: "App Store", d: 1 }, { to: 98, s: "%", label: "Focus Rate" }].map(item => (
            <TiltedCard key={item.label} tiltMaxX={8} tiltMaxY={8}>
              <div style={{ textAlign: "center", background: "rgba(255,255,255,.04)", border: `1px solid ${C.darkBorder}`, borderRadius: 20, padding: "20px 32px" }}>
                <div style={{ fontSize: 34, fontWeight: 800, color: C.orchid1 }}><CountUp to={item.to} suffix={item.s} decimals={item.d || 0} duration={2} /></div>
                <div style={{ color: "rgba(245,240,255,.4)", fontSize: 13, marginTop: 4, fontWeight: 700 }}>{item.label}</div>
              </div>
            </TiltedCard>
          ))}
        </div>
      </AnimatedContent> <AnimatedContent delay={1.05} direction="vertical" distance={70} style={{ marginTop: 80, position: "relative", zIndex: 1 }}>
        <motion.div animate={{ y: [0, -12, 0] }} transition={{ repeat: Infinity, duration: 5.5, ease: "easeInOut" }}>
          <div style={{ width: 280, aspectRatio: "402/874", borderRadius: 42, overflow: "hidden", background: `linear-gradient(145deg,${C.darkMid},${C.dark})`, border: `1.5px solid ${C.darkBorder}`, boxShadow: "0 40px 80px rgba(0,0,0,.65),0 0 80px rgba(178,132,190,.12)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
            <img src={`${BASE}images/screens/Onboarding_1.png`} alt="Neurova hero" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 95, height: 24, background: C.dark, borderRadius: "0 0 16px 16px" }} />
            <div style={{ position: "absolute", bottom: 10, left: "50%", transform: "translateX(-50%)", width: 95, height: 4, background: "rgba(245,240,255,.1)", borderRadius: 4 }} />
          </div>
          <div style={{ position: "absolute", bottom: -28, left: "50%", transform: "translateX(-50%)", width: 200, height: 28, background: "radial-gradient(ellipse,rgba(178,132,190,.45),transparent)", filter: "blur(14px)" }} />
        </motion.div>
      </AnimatedContent>
    </section>
  );
}
const FEATURES = [
  { icon: "AI", title: "AI Assistant", desc: "Concept explanations, personalised study plans, and weakness analysis tailored to your major.", color: C.orchid1 },
  { icon: "TM", title: "Smart Task Manager", desc: "Manage deadlines, priorities, and categories. Sync with Google Calendar effortlessly.", color: C.peach },
  { icon: "PF", title: "Pomodoro Focus", desc: "Deep work timers, ambient soundscapes, and optional app blocking keep you locked in.", color: C.periwinkle },
  { icon: "PA", title: "Progress Analytics", desc: "Track learning streaks, time spent, and improvement curves across weeks and months.", color: C.cream },
  { icon: "DS", title: "Distraction Shield", desc: "Block social media, silence notifications, and create a dedicated study environment.", color: C.orchid2 },
  { icon: "SG", title: "Study Groups", desc: "Collaborate with classmates, share notes, hold each other accountable in real-time.", color: C.peach },
];

function Features() {
  return (
    <section style={{ padding: "100px 5%" }}>
      <AnimatedContent direction="vertical" distance={30} threshold={.2}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <SectionBadge text="FEATURES" color={C.peach} />
          <h2 style={{ fontSize: "clamp(36px,5vw,60px)", fontWeight: 800, color: C.white, margin: 0, letterSpacing: "-2px" }}>
            <ScrollReveal stagger={.06}>Everything you need to actually succeed</ScrollReveal>
          </h2>
        </div>
      </AnimatedContent>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 18, maxWidth: 1100, margin: "0 auto" }}>
        {FEATURES.map((f, i) => (
          <AnimatedContent key={f.title} delay={i * .08} direction="vertical" distance={30} threshold={.1}>
            <TiltedCard tiltMaxX={10} tiltMaxY={10} glareOpacity={.1}>
              <div style={{ background: `linear-gradient(135deg,${C.darkCard},rgba(26,22,40,.7))`, border: `1px solid ${C.darkBorder}`, borderRadius: 24, padding: 32, height: "100%" }}>
                <motion.div whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }} transition={{ duration: .4 }}
                  style={{ width: 52, height: 52, borderRadius: 16, fontSize: 13, fontWeight: 800, color: f.color, background: f.color + "18", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20, border: `1px solid ${f.color}30`, letterSpacing: "0.5px" }}>{f.icon}</motion.div>
                <h3 style={{ color: C.white, fontSize: 18, fontWeight: 800, margin: "0 0 10px" }}>{f.title}</h3>
                <p style={{ color: "rgba(245,240,255,.5)", fontSize: 14, lineHeight: 1.75, margin: 0, fontWeight: 700 }}>{f.desc}</p>
              </div>
            </TiltedCard>
          </AnimatedContent>
        ))}
      </div>
    </section>
  );
}
function DesignSystem() {
  const [copied, setCopied] = useState(null);
  const palette = [
    { name: "Lilac Orchid", hex: "#C8A2C8", use: "Primary Light" }, { name: "Deep Orchid", hex: "#B284BE", use: "Primary" },
    { name: "Periwinkle", hex: "#A2ADD0", use: "Secondary" }, { name: "Cream", hex: "#ECEBBD", use: "Accent Light" },
    { name: "Peach", hex: "#F8B878", use: "CTA / Warm" }, { name: "Dark Base", hex: "#0D0B14", use: "Background" },
    { name: "Dark Card", hex: "#1A1628", use: "Card Surface" }, { name: "Dark Border", hex: "#2A2440", use: "Dividers" },
  ];
  const typo = [
    { n: "Display", sz: "clamp(48px,7vw,88px)", w: 800, s: "Focus. Learn. Thrive.", l: "-3px" },
    { n: "H1", sz: "clamp(32px,5vw,52px)", w: 800, s: "All your tasks", l: "-2px" },
    { n: "H2", sz: "clamp(24px,3vw,36px)", w: 800, s: "AI Assistant", l: "-1px" },
    { n: "H3", sz: "20px", w: 700, s: "Deep Work Mode", l: "-.5px" },
    { n: "Body", sz: "16px", w: 700, s: "Personalised study plans tailored to you.", l: "0" },
    { n: "Caption", sz: "11px", w: 700, s: "POMODORO — AI POWERED", l: "1.5px" },
  ];
  return (
    <section style={{ padding: "100px 5%" }}>
      <AnimatedContent direction="vertical" distance={30} threshold={.2}>
        <div style={{ textAlign: "center", marginBottom: 72 }}>
          <SectionBadge text="DESIGN SYSTEM" color={C.periwinkle} />
          <h2 style={{ fontSize: "clamp(36px,5vw,60px)", fontWeight: 800, color: C.white, margin: 0, letterSpacing: "-2px" }}>
            Built on <GradientText text="Candy Orchid Twist" gradient={`linear-gradient(135deg,${C.orchid1},${C.orchid2},${C.periwinkle})`} />
          </h2>
        </div>
      </AnimatedContent>
      <div style={{ maxWidth: 1100, margin: "0 auto 80px" }}>
        <div style={{ color: "rgba(245,240,255,.35)", fontSize: 10, fontWeight: 700, letterSpacing: 2, marginBottom: 16 }}>COLOR TOKENS — click to copy</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(116px,1fr))", gap: 12 }}>
          {palette.map((c, i) => (
            <AnimatedContent key={c.hex} delay={i * .05} direction="vertical" distance={20}>
              <TiltedCard tiltMaxX={12} tiltMaxY={12} glareOpacity={.2}>
                <motion.div onClick={() => { navigator.clipboard.writeText(c.hex); setCopied(c.hex); setTimeout(() => setCopied(null), 1500); }}
                  whileTap={{ scale: .95 }} style={{ borderRadius: 14, overflow: "hidden", cursor: "pointer", border: `1px solid ${C.darkBorder}` }}>
                  <div style={{ height: 72, background: c.hex }} />
                  <div style={{ padding: "10px 12px", background: C.darkCard }}>
                    <div style={{ color: C.white, fontSize: 11, fontWeight: 700 }}>{c.name}</div>
                    <div style={{ color: "rgba(245,240,255,.4)", fontSize: 10, fontFamily: "monospace" }}>{c.hex}</div>
                    <div style={{ color: "rgba(245,240,255,.25)", fontSize: 9, marginTop: 2 }}>{c.use}</div>
                    <AnimatePresence>{copied === c.hex && <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ color: C.peach, fontSize: 10, fontWeight: 700, marginTop: 4 }}>✓ Copied!</motion.div>}</AnimatePresence>
                  </div>
                </motion.div>
              </TiltedCard>
            </AnimatedContent>
          ))}
        </div>
      </div>
      <AnimatedContent direction="vertical" distance={20} threshold={.1}>
        <div style={{ maxWidth: 1100, margin: "0 auto 60px" }}>
          <div style={{ color: "rgba(245,240,255,.35)", fontSize: 10, fontWeight: 700, letterSpacing: 2, marginBottom: 16 }}>TYPOGRAPHY — SYNE 700 BOLD &amp; 800 EXTRABOLD</div>
          <div style={{ background: C.darkCard, border: `1px solid ${C.darkBorder}`, borderRadius: 24, overflow: "hidden" }}>
            {typo.map((t, i) => (
              <motion.div key={t.n} whileHover={{ background: "rgba(255,255,255,.025)" }}
                style={{ display: "flex", alignItems: "center", gap: 24, padding: "18px 32px", borderBottom: i < typo.length - 1 ? `1px solid ${C.darkBorder}` : "none" }}>
                <div style={{ width: 72, flexShrink: 0 }}>
                  <div style={{ color: "rgba(245,240,255,.35)", fontSize: 10, fontWeight: 700 }}>{t.n}</div>
                  <div style={{ color: "rgba(245,240,255,.18)", fontSize: 9, fontFamily: "monospace", marginTop: 2 }}>{t.w}</div>
                </div>
                <div style={{ color: C.white, fontSize: t.sz, fontWeight: t.w, letterSpacing: t.l, lineHeight: 1.2, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>{t.s}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedContent>
    </section>
  );
}
const SCREEN_DATA = [
  { label: "Onboarding 1", file: "Onboarding_1.png" },
  { label: "Onboarding 2", file: "Onboarding_2.png" },
  { label: "Onboarding 3", file: "Onboarding 3.png" },
  { label: "Onboarding 4", file: "Onboarding 4.png" },
  { label: "Sign Up", file: "Sign Up.png" },
  { label: "Log In", file: "Log In.png" },
  { label: "Reset Password", file: "Reset Password.png" },
  { label: "Pass Reset", file: "Pass reset.png" },
  { label: "Confirm Reset", file: "Confirmation Email.png" },
  { label: "Confirmation", file: "Confirm pass reset.png" },
];

function Screens() {
  const [active, setActive] = useState(0);
  return (
    <section style={{ padding: "100px 5%" }}>
      <AnimatedContent direction="vertical" distance={30} threshold={.2}>
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <SectionBadge text="APP SCREENS" color={C.peach} />
          <h2 style={{ fontSize: "clamp(36px,5vw,60px)", fontWeight: 800, color: C.white, margin: 0, letterSpacing: "-2px" }}>
            Crafted to <GradientText text="delight" gradient={`linear-gradient(135deg,${C.peach},${C.orchid1})`} />
          </h2>
          <p style={{ color: "rgba(245,240,255,.36)", fontSize: 15, marginTop: 14, fontWeight: 700 }}>10 beautifully crafted screens</p>
        </div>
      </AnimatedContent>
      <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", marginBottom: 52 }}>
        {SCREEN_DATA.map((s, i) => (
          <motion.button key={s.label} onClick={() => setActive(i)} whileTap={{ scale: .95 }}
            style={{ background: active === i ? "rgba(178,132,190,.18)" : "rgba(255,255,255,.04)", border: `1px solid ${active === i ? C.orchid2 : C.darkBorder}`, color: active === i ? C.orchid1 : "rgba(245,240,255,.4)", borderRadius: 99, padding: "7px 16px", fontSize: 12, fontWeight: 700, cursor: "pointer", transition: "all .2s" }}>
            {s.label}
          </motion.button>
        ))}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 24, justifyContent: "center", maxWidth: 1400, margin: "0 auto" }}>
        {SCREEN_DATA.map((s, i) => (
          <PhoneFrame key={s.label} label={s.label} active={active === i} onClick={() => setActive(i)} animDelay={i * .055} width={220}>
            <img src={`${BASE}images/screens/${encodeURIComponent(s.file)}`} alt={s.label} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </PhoneFrame>
        ))}
      </div>
    </section>
  );
}
function Download() {
  return (
    <section style={{ padding: "100px 5%", display: "flex", justifyContent: "center" }}>
      <AnimatedContent direction="vertical" distance={50} blur threshold={.2} style={{ width: "100%", maxWidth: 720 }}>
        <div style={{ position: "relative", borderRadius: 40, overflow: "hidden", border: "1px solid rgba(178,132,190,.2)" }}>
          <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
            <LiquidEther
              colors={[C.orchid2, C.periwinkle, C.peach]}
              mouseForce={15}
              cursorSize={80}
              isViscous
              viscous={25}
              resolution={0.5}
              autoDemo
              autoSpeed={0.4}
              autoIntensity={1.8}
              takeoverDuration={0.25}
              autoResumeDelay={2000}
              autoRampDuration={0.6}
            />
          </div>
          <div style={{ position: "absolute", inset: 0, background: "rgba(13,11,20,.6)", pointerEvents: "none", zIndex: 0 }} />
          <div style={{ position: "relative", zIndex: 2, padding: "80px 60px", textAlign: "center" }}>
            <AnimatedContent delay={.2}><SectionBadge text="COMING SOON" color={C.peach} /></AnimatedContent>
            <h2 style={{ fontSize: "clamp(34px,5vw,52px)", fontWeight: 800, color: C.white, margin: "0 0 20px", letterSpacing: "-2px" }}>
              <BlurText text="Something exciting is on its way" animateBy="words" delay={80} />
            </h2>
            <AnimatedContent delay={.4} blur>
              <p style={{ color: "rgba(245,240,255,.5)", fontSize: 16, lineHeight: 1.7, margin: "0 0 44px", fontWeight: 700 }}>
                We're putting the finishing touches on <strong style={{ color: C.orchid1 }}>Neurova</strong>. Stay tuned — it'll be worth the wait.
              </p>
            </AnimatedContent>
            <AnimatedContent delay={.6} direction="vertical" distance={20}>
              <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
                <ClickSpark sparkColor={C.orchid1} sparkCount={10}>
                  <motion.button whileHover={{ scale: 1.05, y: -3 }} whileTap={{ scale: .97 }}
                    style={{ background: `linear-gradient(135deg,${C.orchid2},${C.periwinkle})`, border: "none", borderRadius: 16, padding: "16px 36px", cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ color: C.dark, fontSize: 15, fontWeight: 800 }}>Notify Me</span>
                  </motion.button>
                </ClickSpark>
              </div>
            </AnimatedContent>
          </div>
        </div>
      </AnimatedContent>
    </section>
  );
}
function Footer() {
  return (
    <footer style={{ borderTop: `1px solid ${C.darkBorder}`, padding: "40px 5%", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 20 }}>
      <Magnet strength={15}><Logo size={30} /></Magnet>
      <div style={{ color: "rgba(245,240,255,.22)", fontSize: 12, fontWeight: 700 }}>© 2026 Neurova — Built for students who mean it.</div>
      <div style={{ display: "flex", gap: 20 }}>
        {["Privacy", "Terms", "Support", "Twitter"].map(l => (
          <motion.span key={l} whileHover={{ color: C.orchid1 }} style={{ color: "rgba(245,240,255,.33)", fontSize: 12, cursor: "pointer", transition: "color .2s", fontWeight: 700 }}>{l}</motion.span>
        ))}
      </div>
    </footer>
  );
}
export default function App() {
  const [active, setActive] = useState("Home");
  return (
    <div style={{ background: C.dark, minHeight: "100vh", fontFamily: "'Syne',sans-serif", color: C.white, overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:5px}
        ::-webkit-scrollbar-track{background:${C.dark}}
        ::-webkit-scrollbar-thumb{background:${C.darkBorder};border-radius:3px}
        ::selection{background:rgba(178,132,190,.35)}
      `}</style>
      <Nav active={active} setActive={setActive} />
      <main><Hero /><Features /><DesignSystem /><Screens /><Download /></main>
      <Footer />
    </div>
  );
}
