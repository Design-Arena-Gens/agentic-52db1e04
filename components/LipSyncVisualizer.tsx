"use client";

import { LipSyncFrame, TimelineSegment } from "@/types/pipeline";
import { useMemo } from "react";

type LipSyncVisualizerProps = {
  frames: LipSyncFrame[];
  segments: TimelineSegment[];
};

const mouthPalette: Record<LipSyncFrame["mouthShape"], string> = {
  rest: "#D4D4D8",
  wide: "#818CF8",
  narrow: "#34D399",
  open: "#FB7185",
  pucker: "#F59E0B",
  smile: "#38BDF8",
  clench: "#A855F7",
};

export function LipSyncVisualizer({
  frames,
  segments,
}: LipSyncVisualizerProps) {
  const totalDuration = useMemo(
    () => segments.reduce((acc, segment) => acc + segment.duration, 0),
    [segments]
  );

  const cells = useMemo(() => {
    if (!totalDuration) return [];
    return frames.map((frame) => ({
      ...frame,
      left: (frame.timecode / totalDuration) * 100,
    }));
  }, [frames, totalDuration]);

  return (
    <section className="rounded-3xl border border-zinc-200 bg-white/80 p-6 shadow-sm backdrop-blur-md transition hover:border-zinc-300">
      <header className="flex flex-col gap-2 pb-5 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-sky-500">
            Lip Sync Lab
          </p>
          <h2 className="text-2xl font-semibold text-zinc-900">
            Frame-perfect mouth choreography
          </h2>
        </div>
        <span className="rounded-full bg-sky-50 px-4 py-2 text-xs font-semibold text-sky-600">
          {frames.length} phoneme frames
        </span>
      </header>

      <div className="relative mb-4 h-36 overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50">
        {cells.map((cell) => (
          <div
            key={`${cell.timecode}-${cell.phoneme}`}
            className="absolute top-0 h-full w-[1.5%] rounded-full opacity-80 transition hover:opacity-100"
            style={{
              left: `${cell.left}%`,
              background: mouthPalette[cell.mouthShape],
            }}
            title={`${cell.phoneme.toUpperCase()} • ${cell.mouthShape}`}
          />
        ))}
        <div className="absolute inset-x-0 bottom-3 flex justify-between px-4 text-xs font-semibold text-zinc-400">
          {segments.map((segment) => (
            <span key={segment.id}>{segment.label}</span>
          ))}
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {segments.map((segment, index) => (
          <div
            key={segment.id}
            className="rounded-2xl border border-zinc-200 bg-white p-4 text-sm text-zinc-600"
          >
            <div className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
              <span>
                Part {index + 1}
              </span>
              <span>{segment.duration}s</span>
            </div>
            <p className="line-clamp-3 leading-6">{segment.text}</p>
          </div>
        ))}
      </div>

      <footer className="mt-4 flex flex-wrap gap-3 text-xs text-zinc-500">
        {Object.entries(mouthPalette).map(([shape, color]) => (
          <span
            key={shape}
            className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 shadow-sm"
          >
            <span
              className="h-3 w-3 rounded-full"
              style={{ background: color }}
            />
            {shape}
          </span>
        ))}
      </footer>
    </section>
  );
}

