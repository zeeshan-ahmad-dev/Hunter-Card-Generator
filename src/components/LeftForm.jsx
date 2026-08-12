import { useRef } from "react";
import Field from "./Field";
import { Upload } from "lucide-react";
import { CLASSES, RANKS, STATS } from "../constants/stats";
import { THEMES } from "../constants/themes";

const LeftForm = ({ draft, onChange, onGenerate }) => {
  const fileRef = useRef(null);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      onChange({
        ...draft,
        avatar: reader.result,
      });
    };

    reader.readAsDataURL(file);
  };

  const handleUpdateTheme = (theme) => {
    onChange({
      ...draft,
      theme,
    });
  };

  const handleUpdate = (key, value) => {
    onChange((prev) => ({
      ...prev,
      [key]: value,
    }));
  };
  const handleStatUpdate = (key, value) => {
    onChange((prev) => ({
      ...prev,
      stats: {
        ...prev.stats,
        [key]: value,
      },
    }));
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.03),0_20px_40px_-24px_rgba(15,23,42,0.12)] sm:p-7">
      <div className="mb-6">
        <h1 className="text-[19px] font-semibold tracking-tight text-slate-900">
          Hunter Card Generator
        </h1>
        <p className="mt-1 text-[13px] text-slate-500">
          Create your own Hunter Card.
        </p>
      </div>

      <div className="space-y-5">
        <Field label="Upload image">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="flex w-full items-center gap-3 rounded-xl border border-dashed border-slate-250 bg-slate-50/60 px-3.5 py-3 text-left transition-all duration-150 hover:border-primary/50 hover:bg-primary/3"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white ring-1 ring-slate-200">
              {draft.avatar ? (
                <img
                  src={draft.avatar}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                <Upload size={15} className="text-slate-400" />
              )}
            </div>
            <span className="text-[13px] text-slate-500">
              {draft.avatar ? "Change image" : "Click to upload a portrait"}
            </span>
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleFile}
            className="hidden"
          />
        </Field>

        <Field label="Hunter name">
          <input
            className="input"
            value={draft.name}
            onChange={(e) => handleUpdate("name", e.target.value)}
            placeholder="e.g. Kael Voss"
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Rank">
            <select
              className="input"
              value={draft.rank}
              onChange={(e) => handleUpdate("rank", e.target.value)}
            >
              {RANKS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Level">
            <input
              className="input"
              type="number"
              min="1"
              value={draft.level}
              onChange={(e) => handleUpdate("level", e.target.value)}
              placeholder="42"
            />
          </Field>
        </div>

        <Field label="Title">
          <input
            className="input"
            value={draft.title}
            onChange={(e) => handleUpdate("title", e.target.value)}
            placeholder="e.g. The Silent Blade"
          />
        </Field>

        <Field label="Registration date">
          <input
            className="input"
            type="date"
            value={draft.date}
            onChange={(e) => handleUpdate("date", e.target.value)}
          />
        </Field>

        <Field label="Stats">
          <div className="grid grid-cols-2 gap-4">
            {STATS.map((stat) => (
              <div key={stat.key} className="flex flex-col gap-2">
                <label className="text-[13px] text-slate-500">{stat.label}</label>
                <input
                  className="input"
                  type="number"
                  min="0"
                  max={stat.max}
                  value={draft.stats[stat.key]}
                  onChange={(e) => handleStatUpdate(stat.key, e.target.value)}
                />
              </div>
            ))}
          </div>
        </Field>

        <Field label="Theme">
          <div className="flex items-center gap-2.5">
            {Object.entries(THEMES).map(([key, t]) => (
              <button
                key={key}
                type="button"
                onClick={() => handleUpdateTheme(key)}
                aria-label={t.label}
                className="group relative flex h-8 w-8 items-center justify-center rounded-full transition-transform duration-150 hover:scale-110"
              >
                <span
                  className="h-6 w-6 rounded-full ring-2 ring-offset-2 transition-all duration-150"
                  style={{
                    background: t.accent,
                    boxShadow:
                      draft.theme === key
                        ? `0 0 0 2px white, 0 0 0 4px ${t.accent}`
                        : "none",
                  }}
                />
              </button>
            ))}
          </div>
        </Field>

        <Field label="Quote" hint="Optional">
          <textarea
            className="input min-h-18 resize-none"
            value={draft.quote}
            onChange={(e) => handleUpdate("quote", e.target.value)}
            placeholder="A line that defines your hunter…"
          />
        </Field>
      </div>

      <button
        type="button"
        onClick={() => onGenerate()}
        className="mt-7 w-full rounded-xl bg-primary px-4 py-3 text-[14px] font-semibold text-white shadow-[0_8px_20px_-6px_rgba(99,102,241,0.55)] transition-all duration-150 hover:bg-[#5457e5] hover:shadow-[0_10px_24px_-6px_rgba(99,102,241,0.65)] active:scale-[0.99]"
      >
        Generate Card
      </button>
      <p className="mt-3 text-center text-[11.5px] text-slate-400">
        Your data never leaves your browser.
      </p>
    </div>
  );
};

export default LeftForm;
