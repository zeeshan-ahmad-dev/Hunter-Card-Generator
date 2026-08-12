import React, { useState, useRef, useMemo } from "react";
import {
  Upload,
  Shield,
  Zap,
  Shuffle,
  Download,
  ArrowRight,
  Sparkles,
  Crosshair,
  Radio,
  Image as ImageIcon,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Static config                                                      */
/* ------------------------------------------------------------------ */

const THEMES = {
  purple: { label: "Purple", accent: "#a855f7", accentSoft: "#c084fc", glow: "rgba(168,85,247,0.35)" },
  blue: { label: "Blue", accent: "#3b82f6", accentSoft: "#60a5fa", glow: "rgba(59,130,246,0.35)" },
  red: { label: "Red", accent: "#ef4444", accentSoft: "#f87171", glow: "rgba(239,68,68,0.35)" },
  teal: { label: "Teal", accent: "#14b8a6", accentSoft: "#2dd4bf", glow: "rgba(20,184,166,0.35)" },
  gold: { label: "Gold", accent: "#eab308", accentSoft: "#facc15", glow: "rgba(234,179,8,0.35)" },
};

const RANKS = ["S", "A", "B", "C", "D", "E"];
const CLASSES = ["Assassin", "Mage", "Warrior", "Tank", "Ranger", "Healer"];

const RANDOM_NAMES = ["Kael Voss", "Rin Asakura", "Dorian Vex", "Mira Solt", "Theo Kade", "Ysolde Fenn"];
const RANDOM_GUILDS = ["Ashford Order", "Nightfall Union", "The Hollow Vanguard", "Ember Concord", "Wraithbound"];
const RANDOM_TITLES = ["The Silent Blade", "Stormcaller", "Ashwalker", "The Last Vanguard", "Duskbringer"];
const RANDOM_QUOTES = [
  "Strength is a promise kept in silence.",
  "I do not chase the gate. I close it.",
  "Every rank is a door. I've never met one that stayed shut.",
  "Fear is just data I haven't processed yet.",
];

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDraft() {
  return {
    avatar: null,
    name: randomFrom(RANDOM_NAMES),
    rank: randomFrom(RANKS),
    level: String(Math.floor(Math.random() * 90) + 10),
    hunterClass: randomFrom(CLASSES),
    guild: randomFrom(RANDOM_GUILDS),
    title: randomFrom(RANDOM_TITLES),
    date: new Date().toISOString().slice(0, 10),
    quote: randomFrom(RANDOM_QUOTES),
    theme: randomFrom(Object.keys(THEMES)),
  };
}

const DEFAULT_DRAFT = {
  avatar: null,
  name: "Kael Voss",
  rank: "A",
  level: "42",
  hunterClass: "Assassin",
  guild: "Ashford Order",
  title: "The Silent Blade",
  date: new Date().toISOString().slice(0, 10),
  quote: "Strength is a promise kept in silence.",
  theme: "purple",
};

/* ------------------------------------------------------------------ */
/*  Small building blocks                                              */
/* ------------------------------------------------------------------ */

function Field({ label, children, hint }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-medium text-slate-700">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-[11px] text-slate-400">{hint}</span>}
    </label>
  );
}

const inputClasses =
  "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-[14px] text-slate-800 placeholder:text-slate-350 outline-none transition-all duration-150 focus:border-[#6366F1] focus:ring-4 focus:ring-[#6366F1]/10 hover:border-slate-300";

function Barcode({ seed, accent }) {
  const bars = useMemo(() => {
    const s = seed || "HUNTER0000";
    const arr = [];
    for (let i = 0; i < 46; i++) {
      const code = s.charCodeAt(i % s.length) || 65;
      arr.push(((code * (i + 3)) % 4) + 1);
    }
    return arr;
  }, [seed]);

  return (
    <div className="flex h-8 items-end gap-[2px]">
      {bars.map((w, i) => (
        <div
          key={i}
          style={{ width: `${w}px`, opacity: i % 7 === 0 ? 0.35 : 0.85 }}
          className="h-full bg-white/70"
        />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  ID Card                                                             */
/* ------------------------------------------------------------------ */

function IDCard({ data, pulse }) {
  const theme = THEMES[data.theme];
  const idNumber = useMemo(() => {
    const hash = (data.name || "HUNTER")
      .split("")
      .reduce((a, c) => a + c.charCodeAt(0), 0);
    return `HX-${String(hash).slice(0, 4).padStart(4, "0")}-${data.rank}${data.level || "00"}`;
  }, [data.name, data.rank, data.level]);

  return (
    <div
      className={`relative w-full max-w-[420px] overflow-hidden rounded-[22px] p-[1.5px] transition-all duration-500 ${
        pulse ? "scale-[1.015]" : "scale-100"
      }`}
      style={{
        background: `linear-gradient(135deg, ${theme.accent}, transparent 40%, transparent 60%, ${theme.accent})`,
        boxShadow: `0 25px 60px -20px ${theme.glow}, 0 10px 25px -10px rgba(0,0,0,0.4)`,
      }}
    >
      <div
        className="relative rounded-[20.5px] px-6 pb-5 pt-5 sm:px-7 sm:pb-6 sm:pt-6"
        style={{
          background:
            "radial-gradient(120% 120% at 100% 0%, rgba(255,255,255,0.05), transparent 55%), linear-gradient(160deg, #14141c 0%, #0a0a0f 60%, #0a0a0f 100%)",
        }}
      >
        {/* corner brackets */}
        {[
          "left-3 top-3 border-l border-t",
          "right-3 top-3 border-r border-t",
          "left-3 bottom-3 border-l border-b",
          "right-3 bottom-3 border-r border-b",
        ].map((pos, i) => (
          <div
            key={i}
            className={`pointer-events-none absolute h-4 w-4 ${pos}`}
            style={{ borderColor: theme.accent, opacity: 0.6 }}
          />
        ))}

        {/* header */}
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Shield size={13} style={{ color: theme.accent }} />
            <span
              className="text-[10px] font-semibold uppercase tracking-[0.18em]"
              style={{ color: theme.accentSoft }}
            >
              Hunter License
            </span>
          </div>
          <div
            className="flex h-7 min-w-[28px] items-center justify-center rounded-md border px-1.5 font-serif text-[15px] font-bold"
            style={{ borderColor: theme.accent, color: theme.accent, background: `${theme.accent}14` }}
          >
            {data.rank || "?"}
          </div>
        </div>

        {/* body */}
        <div className="mb-5 flex gap-4">
          <div
            className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border"
            style={{ borderColor: `${theme.accent}55`, background: "#1a1a24" }}
          >
            {data.avatar ? (
              <img src={data.avatar} alt="Hunter portrait" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <ImageIcon size={22} className="text-white/15" />
              </div>
            )}
            <div
              className="absolute inset-x-0 bottom-0 h-6"
              style={{ background: `linear-gradient(to top, ${theme.accent}22, transparent)` }}
            />
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="truncate font-serif text-[21px] font-semibold leading-tight text-white">
              {data.name || "Unnamed Hunter"}
            </h3>
            <p className="mb-3 truncate text-[12px] font-medium italic" style={{ color: theme.accentSoft }}>
              {data.title || "—"}
            </p>

            <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-[12px]">
              <div className="flex items-center gap-1.5 text-white/40">
                <Zap size={11} style={{ color: theme.accent }} />
                <span>
                  Lv. <span className="text-white/80">{data.level || "0"}</span>
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-white/40">
                <Crosshair size={11} style={{ color: theme.accent }} />
                <span className="truncate text-white/80">{data.hunterClass}</span>
              </div>
              <div className="col-span-2 flex items-center gap-1.5 text-white/40">
                <Radio size={11} style={{ color: theme.accent }} />
                <span className="truncate text-white/80">{data.guild || "Unaffiliated"}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-4 h-px w-full" style={{ background: `linear-gradient(to right, ${theme.accent}66, transparent)` }} />

        {/* quote */}
        {data.quote && (
          <p className="mb-4 line-clamp-2 text-[12.5px] italic leading-relaxed text-white/55">
            &ldquo;{data.quote}&rdquo;
          </p>
        )}

        {/* footer */}
        <div className="flex items-end justify-between">
          <div>
            <p className="mb-1 text-[9px] uppercase tracking-[0.15em] text-white/30">Registered</p>
            <p className="text-[11.5px] font-medium text-white/70">{data.date || "—"}</p>
            <p className="mt-2 font-mono text-[10px] tracking-wider text-white/35">{idNumber}</p>
          </div>
          <Barcode seed={idNumber} accent={theme.accent} />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main app                                                            */
/* ------------------------------------------------------------------ */

export default function HunterIdGenerator() {
  const [draft, setDraft] = useState(DEFAULT_DRAFT);
  const [applied, setApplied] = useState(DEFAULT_DRAFT);
  const [pulse, setPulse] = useState(false);
  const fileRef = useRef(null);

  const update = (key) => (e) => setDraft((d) => ({ ...d, [key]: e.target.value }));

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setDraft((d) => ({ ...d, avatar: reader.result }));
    reader.readAsDataURL(file);
  };

  const handleGenerate = () => {
    setApplied(draft);
    setPulse(true);
    window.setTimeout(() => setPulse(false), 450);
  };

  const handleRandomize = () => {
    const r = randomDraft();
    const merged = { ...r, avatar: draft.avatar };
    setDraft(merged);
    setApplied(merged);
    setPulse(true);
    window.setTimeout(() => setPulse(false), 450);
  };

  return (
    <div className="min-h-screen w-full bg-white">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-5 py-10 sm:px-8 sm:py-14 lg:grid-cols-[minmax(0,420px)_1fr] lg:gap-10">
        {/* ---------------- LEFT: FORM ---------------- */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.03),0_20px_40px_-24px_rgba(15,23,42,0.12)] sm:p-7">
          <div className="mb-6">
            <h1 className="text-[19px] font-semibold tracking-tight text-slate-900">Hunter ID Generator</h1>
            <p className="mt-1 text-[13px] text-slate-500">Build a custom hunter license card.</p>
          </div>

          <div className="space-y-5">
            <Field label="Upload image">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="flex w-full items-center gap-3 rounded-xl border border-dashed border-slate-250 bg-slate-50/60 px-3.5 py-3 text-left transition-all duration-150 hover:border-[#6366F1]/50 hover:bg-[#6366F1]/[0.03]"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white ring-1 ring-slate-200">
                  {draft.avatar ? (
                    <img src={draft.avatar} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <Upload size={15} className="text-slate-400" />
                  )}
                </div>
                <span className="text-[13px] text-slate-500">
                  {draft.avatar ? "Change image" : "Click to upload a portrait"}
                </span>
              </button>
              <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
            </Field>

            <Field label="Hunter name">
              <input
                className={inputClasses}
                value={draft.name}
                onChange={update("name")}
                placeholder="e.g. Kael Voss"
              />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Rank">
                <select className={inputClasses} value={draft.rank} onChange={update("rank")}>
                  {RANKS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Level">
                <input
                  className={inputClasses}
                  type="number"
                  min="1"
                  value={draft.level}
                  onChange={update("level")}
                  placeholder="42"
                />
              </Field>
            </div>

            <Field label="Class">
              <select className={inputClasses} value={draft.hunterClass} onChange={update("hunterClass")}>
                {CLASSES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Guild / organization">
              <input
                className={inputClasses}
                value={draft.guild}
                onChange={update("guild")}
                placeholder="e.g. Ashford Order"
              />
            </Field>

            <Field label="Title / nickname">
              <input
                className={inputClasses}
                value={draft.title}
                onChange={update("title")}
                placeholder="e.g. The Silent Blade"
              />
            </Field>

            <Field label="Registration date">
              <input className={inputClasses} type="date" value={draft.date} onChange={update("date")} />
            </Field>

            <Field label="Theme">
              <div className="flex items-center gap-2.5">
                {Object.entries(THEMES).map(([key, t]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setDraft((d) => ({ ...d, theme: key }))}
                    aria-label={t.label}
                    className="group relative flex h-8 w-8 items-center justify-center rounded-full transition-transform duration-150 hover:scale-110"
                  >
                    <span
                      className="h-6 w-6 rounded-full ring-2 ring-offset-2 transition-all duration-150"
                      style={{
                        background: t.accent,
                        boxShadow: draft.theme === key ? `0 0 0 2px white, 0 0 0 4px ${t.accent}` : "none",
                      }}
                    />
                  </button>
                ))}
              </div>
            </Field>

            <Field label="Quote" hint="Optional">
              <textarea
                className={`${inputClasses} min-h-[72px] resize-none`}
                value={draft.quote}
                onChange={update("quote")}
                placeholder="A line that defines your hunter…"
              />
            </Field>
          </div>

          <button
            type="button"
            onClick={handleGenerate}
            className="mt-7 w-full rounded-xl bg-[#6366F1] px-4 py-3 text-[14px] font-semibold text-white shadow-[0_8px_20px_-6px_rgba(99,102,241,0.55)] transition-all duration-150 hover:bg-[#5457e5] hover:shadow-[0_10px_24px_-6px_rgba(99,102,241,0.65)] active:scale-[0.99]"
          >
            Generate Card
          </button>
          <p className="mt-3 text-center text-[11.5px] text-slate-400">Your data never leaves your browser.</p>
        </div>

        {/* ---------------- RIGHT: PREVIEW ---------------- */}
        <div className="flex flex-col items-center">
          <div className="flex w-full flex-1 items-center justify-center rounded-2xl bg-slate-50/70 px-4 py-10 sm:px-10 sm:py-14">
            <IDCard data={applied} pulse={pulse} />
          </div>

          <div className="mt-6 grid w-full max-w-[420px] grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleRandomize}
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-[13.5px] font-medium text-slate-700 shadow-sm transition-all duration-150 hover:border-slate-300 hover:bg-slate-50 active:scale-[0.99]"
            >
              <Shuffle size={15} />
              Randomize
            </button>
            <button
              type="button"
              className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-[13.5px] font-medium text-white shadow-sm transition-all duration-150 hover:bg-slate-800 active:scale-[0.99]"
            >
              <Download size={15} />
              Download HD
            </button>
          </div>

          <div className="mt-4 w-full max-w-[420px] rounded-2xl border border-slate-200 bg-gradient-to-br from-[#6366F1]/[0.04] to-transparent p-5 transition-colors duration-150 hover:border-[#6366F1]/30">
            <div className="mb-1.5 flex items-center gap-1.5">
              <Sparkles size={13} className="text-[#6366F1]" />
              <h4 className="text-[13.5px] font-semibold text-slate-800">Want to level up for real?</h4>
            </div>
            <p className="mb-3.5 text-[12.5px] leading-relaxed text-slate-500">
              Track your progress, complete quests and build better habits with SoloLevelX.
            </p>
            <button
              type="button"
              className="group flex items-center gap-1 text-[13px] font-semibold text-[#6366F1] transition-colors duration-150 hover:text-[#4f52e0]"
            >
              Try SoloLevelX
              <ArrowRight size={14} className="transition-transform duration-150 group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}