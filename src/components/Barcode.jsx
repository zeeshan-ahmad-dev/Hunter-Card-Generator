import { useMemo } from "react";

export default function Barcode({ seed, accent }) {
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
    <div className="flex h-8 items-end gap-0.5">
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