import { useMemo, useRef } from "react";
import { toPng } from "html-to-image";
import { THEMES } from "../constants/themes.js";
import {
  Crosshair,
  ImageIcon,
  Radio,
  Shield,
  Zap,
  Swords,
  Wind,
  Brain,
  HeartPulse,
  Eye,
} from "lucide-react";
import Barcode from "./Barcode";

const STAT_DEFS = [
  { key: "strength", label: "STR", icon: Swords },
  { key: "agility", label: "AGI", icon: Wind },
  { key: "intelligence", label: "INT", icon: Brain },
  { key: "vitality", label: "VIT", icon: HeartPulse },
  { key: "perception", label: "PER", icon: Eye },
];

export default function HunterCard({ data, pulse, cardRef }) {
  const theme = THEMES[data.theme];
  const idNumber = useMemo(() => {
    const hash = (data.name || "HUNTER")
      .split("")
      .reduce((a, c) => a + c.charCodeAt(0), 0);
    return `HX-${String(hash).slice(0, 4).padStart(4, "0")}-${data.rank}${data.level || "00"}`;
  }, [data.name, data.rank, data.level]);

  return (
    <div
      ref={cardRef}
      className={`bg-transparent relative w-full max-w-105 overflow-hidden rounded-[22px] p-[1.5px] transition-all duration-500 ${
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
        {/* faint grid texture for depth */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `linear-gradient(${theme.accent} 1px, transparent 1px), linear-gradient(90deg, ${theme.accent} 1px, transparent 1px)`,
            backgroundSize: "22px 22px",
          }}
        />

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
        <div className="relative mb-5 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Shield size={13} style={{ color: theme.accent }} />
            <span
              className="text-[10px] font-semibold uppercase tracking-[0.18em]"
              style={{ color: theme.accentSoft }}
            >
              Hunter Card
            </span>
          </div>
          <div
            className="flex h-7 min-w-7 items-center justify-center rounded-md border px-1.5 font-serif text-[15px] font-bold"
            style={{
              borderColor: theme.accent,
              color: theme.accent,
              background: `${theme.accent}14`,
            }}
          >
            {data.rank || "?"}
          </div>
        </div>

        {/* body */}
        <div className="relative mb-5 flex flex-col items-center">
          {/* portrait */}
          <div
            className="relative h-28 w-28 shrink-0 overflow-hidden rounded-xl border"
            style={{
              borderColor: `${theme.accent}55`,
              background: "#1a1a24",
            }}
          >
            {data.avatar ? (
              <img
                src={data.avatar}
                alt="Hunter portrait"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <ImageIcon size={22} className="text-white/15" />
              </div>
            )}

            <div
              className="absolute inset-x-0 bottom-0 h-7"
              style={{
                background: `linear-gradient(to top, ${theme.accent}22, transparent)`,
              }}
            />
          </div>

          {/* hunter information */}
          <div className="mt-4 w-full text-center">
            <div className="mb-1 flex items-center justify-center gap-2">
              <span
                className="text-[8px] font-semibold uppercase tracking-[0.2em]"
                style={{ color: theme.accent }}
              >
                Registered Hunter
              </span>

              <span className="h-1 w-1 rounded-full bg-white/20" />

              <span className="text-[8px] uppercase tracking-wider text-white/30">
                Active
              </span>
            </div>

            <h3 className="truncate font-serif text-[22px] font-semibold leading-tight text-white">
              {data.name || "Unnamed Hunter"}
            </h3>

            <p
              className="mt-1 text-[12px] font-medium italic"
              style={{ color: theme.accentSoft }}
            >
              {data.title || "—"}
            </p>

            {/* rank + level */}
            <div className="mt-4 flex items-center justify-center gap-8">
              <div>
                <p className="text-[8px] uppercase tracking-wider text-white/25">
                  Rank
                </p>

                <p
                  className="mt-0.5 text-3xl font-semibold"
                  style={{ color: theme.accent }}
                >
                  {data.rank || "—"}
                </p>
              </div>

              <div className="h-7 w-px bg-white/10" />

              <div>
                <p className="text-[8px] uppercase tracking-wider text-white/25">
                  Level
                </p>

                <p className="mt-0.5 text-3xl font-semibold text-white/70">
                  {data.level || "0"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div
          className="relative mb-4 h-px w-full"
          style={{
            background: `linear-gradient(to right, ${theme.accent}66, transparent)`,
          }}
        />

        {/* stats */}
        {data.stats && (
          <div className="relative mb-4 grid grid-cols-5 gap-2">
            {STAT_DEFS.map(({ key, label, icon: Icon }) => {
              const value = data.stats[key] ?? 0;
              return (
                <div key={key} className="flex flex-col items-center gap-1">
                  <Icon size={12} style={{ color: theme.accent }} />
                  <span className="text-[9px] font-semibold uppercase tracking-wide text-white/35">
                    {label}
                  </span>
                  <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(100, value)}%`,
                        background: theme.accent,
                      }}
                    />
                  </div>
                  <span className="text-[10px] font-medium text-white/60">
                    {value}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* quote */}
        {data.quote && (
          <p className="relative mb-4 line-clamp-2 text-[12.5px] text-center italic leading-relaxed text-white/55">
            &ldquo;{data.quote}&rdquo;
          </p>
        )}

        {/* footer */}
        <div className="relative flex items-end justify-between">
          <div>
            <p className="mb-1 text-[9px] uppercase tracking-[0.15em] text-white/30">
              Registered
            </p>
            <p className="text-[11.5px] font-medium text-white/70">
              {data.date || "—"}
            </p>
            <p className="mt-2 font-mono text-[10px] tracking-wider text-white/35">
              {idNumber}
            </p>
          </div>
          <Barcode seed={idNumber} accent={theme.accent} />
        </div>
      </div>
    </div>
  );
}
