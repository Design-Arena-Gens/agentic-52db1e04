"use client";

import { TimelineSegment } from "@/types/pipeline";
import { useCallback } from "react";

type TimelineEditorProps = {
  segments: TimelineSegment[];
  onChange: (segments: TimelineSegment[]) => void;
};

export function TimelineEditor({ segments, onChange }: TimelineEditorProps) {
  const updateSegment = useCallback(
    (id: string, patch: Partial<TimelineSegment>) => {
      const updated = segments.map((segment) =>
        segment.id === id ? { ...segment, ...patch } : segment
      );
      onChange(updated);
    },
    [segments, onChange]
  );

  return (
    <section className="rounded-3xl border border-zinc-200 bg-white/80 p-6 shadow-sm backdrop-blur-md transition hover:border-zinc-300">
      <header className="flex flex-col gap-2 pb-5 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-emerald-500">
            Story Timeline
          </p>
          <h2 className="text-2xl font-semibold text-zinc-900">
            Edit the cinematic beats
          </h2>
        </div>
        <div className="flex items-center gap-3 rounded-full bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-600">
          <span aria-hidden>🎞️</span>
          {segments.reduce((acc, seg) => acc + seg.duration, 0)}s runtime
        </div>
      </header>
      <div className="space-y-5">
        {segments.map((segment) => (
          <article
            key={segment.id}
            className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-inner transition hover:border-emerald-200 hover:shadow-md"
          >
            <header className="flex flex-col gap-2 pb-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500">
                  {segment.label}
                </p>
                <p className="text-sm text-zinc-500">
                  {segment.background.mediaPrompt}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-xs font-semibold text-zinc-500">
                  Duration
                  <output className="rounded-full bg-zinc-100 px-2 py-1 text-zinc-600">
                    {segment.duration}s
                  </output>
                </label>
                <input
                  type="range"
                  min={3}
                  max={20}
                  value={segment.duration}
                  onChange={(event) =>
                    updateSegment(segment.id, {
                      duration: Number(event.target.value),
                    })
                  }
                  className="h-1 w-32 cursor-pointer appearance-none rounded-full bg-emerald-200"
                />
              </div>
            </header>
            <textarea
              value={segment.text}
              onChange={(event) =>
                updateSegment(segment.id, { text: event.target.value })
              }
              className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm leading-6 text-zinc-700 transition focus:border-emerald-500 focus:bg-white focus:outline-none"
              rows={3}
            />
            <footer className="mt-4 flex flex-wrap items-center gap-3 text-xs text-zinc-500">
              <span className="inline-flex items-center gap-2 rounded-full bg-zinc-100 px-3 py-1 font-medium">
                Beat: {segment.emphasis.beat}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-zinc-100 px-3 py-1 font-medium">
                Energy: {(segment.emphasis.energy * 100).toFixed(0)}%
              </span>
              {segment.emphasis.gestures.map((gesture) => (
                <span
                  key={gesture}
                  className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 font-medium shadow-sm"
                >
                  🎯 {gesture}
                </span>
              ))}
            </footer>
          </article>
        ))}
      </div>
    </section>
  );
}

