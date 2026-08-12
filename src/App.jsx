// When Barcode is scanned, user will see the id of the hunter

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
  Share2,
} from "lucide-react";
import { THEMES } from "./constants/themes";
import { RANKS, CLASSES, RANDOM_TITLES, RANDOM_NAMES } from "./constants/stats";
import { RANDOM_QUOTES } from "./constants/quotes";
import { PFPS } from "./constants/pfps";
import { randomDraft } from "./utils/random";
import Field from "./components/Field";
import Barcode from "./components/Barcode";
import HunterCard from "./components/HunterCard";
import LeftForm from "./components/LeftForm";
import { toBlob, toPng } from "html-to-image";

const DEFAULT_DRAFT = {
  avatar: "/pfps/pfp-1.png",
  name: "Kael Voss",
  rank: "A",
  level: 42,
  title: "Player",
  date: new Date().toISOString().slice(0, 10),
  quote: "Strength is a promise kept in silence.",
  theme: "purple",
  stats: {
    strength: 80,
    agility: 70,
    intelligence: 60,
    vitality: 90,
    perception: 75,
  },
};

export default function HunterIdGenerator() {
  const fileRef = useRef(null);
  const cardRef = useRef(null);

  const [draft, setDraft] = useState(DEFAULT_DRAFT);
  const [applied, setApplied] = useState(DEFAULT_DRAFT);
  const [pulse, setPulse] = useState(false);

  const generateCard = async () => {
    if (!cardRef.current) return null;

    return await toPng(cardRef.current, {
      pixelRatio: 4,
    });
  };

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
    setDraft(r);
    setApplied(r);
    setPulse(true);
    window.setTimeout(() => setPulse(false), 450);
  };

  const handleDownload = async () => {
    const dataUrl = await generateCard();

    if (!dataUrl) return;

    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `${applied.name || "hunter"}-card.png`;
    link.click();
  };

  const shareCard = async () => {
    try {
      const dataUrl = await generateCard();

      if (!dataUrl) return;

      const response = await fetch(dataUrl);
      const blob = await response.blob();

      const file = new File([blob], `${applied.name || "hunter"}-card.png`, {
        type: "image/png",
      });

      if (!navigator.canShare?.({ files: [file] })) {
        return;
      }

      await navigator.share({
        title: "My Hunter Card",
        text: "Check out my Hunter Card!",
        files: [file],
      });
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("Failed to share Hunter Card:", error);
      }
    }
  };

  return (
    <div className="min-h-screen w-full bg-white">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-5 py-10 sm:px-8 sm:py-14 lg:grid-cols-[minmax(0,420px)_1fr] lg:gap-10">
        {/* ---------------- LEFT: FORM ---------------- */}
        <LeftForm
          draft={draft}
          onChange={setDraft}
          onGenerate={handleGenerate}
        />

        {/* ---------------- RIGHT: HUNTER CARD ---------------- */}
        <div className="flex flex-col items-center">
          <div className="flex w-full flex-1 items-center justify-center rounded-2xl bg-slate-50/70 px-4 py-10 sm:px-10 sm:py-14">
            <HunterCard data={applied} pulse={pulse} cardRef={cardRef} />
          </div>

          <div className="mt-6 w-full max-w-105 space-y-3">
            <button
              type="button"
              onClick={handleRandomize}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-[13.5px] font-medium text-slate-700 shadow-sm transition-all duration-150 hover:border-slate-300 hover:bg-slate-50 active:scale-[0.99]"
            >
              <Shuffle size={15} />
              Randomize
            </button>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleDownload}
                type="button"
                className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-[13.5px] font-medium text-white shadow-sm transition-all duration-150 hover:bg-slate-800 active:scale-[0.99]"
              >
                <Download size={15} />
                Download HD
              </button>

              <button
                onClick={shareCard}
                type="button"
                className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-[13.5px] font-medium text-white shadow-sm transition-all duration-150 hover:bg-slate-800 active:scale-[0.99]"
              >
                <Share2 size={15} />
                Share
              </button>
            </div>
          </div>

          <div className="mt-5 w-full max-w-105 overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/[0.07] via-white to-white shadow-sm">
            <div className="p-5">
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
                  <Zap size={14} className="text-primary" />
                </div>

                <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-primary">
                  SoloLevelX
                </span>
              </div>

              <h4 className="text-[15px] font-bold tracking-tight text-slate-900">
                Your Hunter journey starts here.
              </h4>

              <p className="mt-1.5 text-[12.5px] leading-relaxed text-slate-500">
                Turn your progress into real stats. Complete quests, build
                streaks, earn XP and level up your Hunter.
              </p>

              <a
                href="https://sololevelx.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="group mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-[13px] font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
              >
                Start Your Journey
                <ArrowRight
                  size={15}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
