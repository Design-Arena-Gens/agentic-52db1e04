"use client";

import { ProductionPlan } from "@/types/pipeline";
import { useCallback, useEffect, useMemo, useState } from "react";

type VideoComposerProps = {
  plan: ProductionPlan | null;
};

export function VideoComposer({ plan }: VideoComposerProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    if (!isPlaying || !plan) return;
    const segment = plan.timeline[activeIndex];
    const timeout = window.setTimeout(() => {
      setActiveIndex((prev) =>
        prev + 1 >= plan.timeline.length ? 0 : prev + 1
      );
    }, segment.duration * 1000);
    return () => window.clearTimeout(timeout);
  }, [isPlaying, activeIndex, plan]);

  useEffect(() => {
    setActiveIndex(0);
    setIsPlaying(false);
  }, [plan?.joke?.id]);

  const activeSegment = plan?.timeline[activeIndex];
  const runtime = useMemo(
    () =>
      plan?.timeline.reduce((acc, segment) => acc + segment.duration, 0) ?? 0,
    [plan?.timeline]
  );

  const handleExport = useCallback(() => {
    if (!plan) return;
    try {
      setExporting(true);
      const payload = JSON.stringify(plan, null, 2);
      const blob = new Blob([payload], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${plan.joke?.id ?? "plan"}-storyboard.json`;
      link.click();
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  }, [plan]);

  if (!plan) {
    return (
      <section className="rounded-3xl border border-zinc-200 bg-white/80 p-6 text-center text-zinc-500 shadow-sm">
        Select a joke to generate the full production stack.
      </section>
    );
  }

  return (
    <section className="rounded-3xl border border-zinc-200 bg-white/90 p-6 shadow-lg shadow-indigo-200/30 backdrop-blur">
      <header className="flex flex-col gap-2 pb-5 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-indigo-500">
            Smart Video Composer
          </p>
          <h2 className="text-2xl font-semibold text-zinc-900">
            Preview the adaptive video build
          </h2>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setIsPlaying((prev) => !prev)}
            className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-400/25 transition hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
          >
            <span aria-hidden>{isPlaying ? "⏸" : "▶️"}</span>
            {isPlaying ? "Pause" : "Play Preview"}
          </button>
          <button
            onClick={handleExport}
            disabled={exporting}
            className="inline-flex items-center gap-2 rounded-full border border-zinc-200 px-5 py-2 text-sm font-semibold text-zinc-700 transition hover:border-indigo-200 hover:text-indigo-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
          >
            <span aria-hidden>💾</span>
            {exporting ? "Exporting..." : "Export Storyboard JSON"}
          </button>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <div className="relative aspect-video overflow-hidden rounded-3xl border border-zinc-100 bg-black shadow-2xl shadow-indigo-500/20">
          {activeSegment && (
            <>
              <div
                className="absolute inset-0 opacity-80"
                style={{
                  background:
                    "radial-gradient(circle at 20% 20%, rgba(99,102,241,0.25), transparent 60%), radial-gradient(circle at 80% 20%, rgba(14,165,233,0.25), transparent 55%)",
                }}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-12 text-center text-white">
                <span className="text-xs uppercase tracking-[0.3em] text-indigo-200">
                  {activeSegment.label}
                </span>
                <h3 className="text-3xl font-semibold leading-tight">
                  {plan.joke?.title}
                </h3>
                <p className="line-clamp-5 text-sm leading-6 text-indigo-50/90">
                  {activeSegment.text}
                </p>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-indigo-100">
                  {activeSegment.background.theme} •{" "}
                  {activeSegment.background.mediaPrompt}
                </span>
              </div>
            </>
          )}
          <div className="absolute inset-x-0 bottom-4 mx-6 rounded-full bg-white/10 p-2 backdrop-blur">
            <div className="flex items-center gap-2">
              {plan.timeline.map((segment, index) => (
                <button
                  key={segment.id}
                  onClick={() => {
                    setActiveIndex(index);
                    setIsPlaying(false);
                  }}
                  className={[
                    "flex-1 rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition",
                    index === activeIndex
                      ? "bg-white text-indigo-600 shadow-lg"
                      : "bg-white/10 text-white/70 hover:bg-white/20",
                  ].join(" ")}
                >
                  {segment.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <aside className="flex flex-col gap-4 rounded-3xl border border-zinc-100 bg-white/70 p-5 shadow-inner">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500">
              Premium Script
            </p>
            <h3 className="text-lg font-semibold text-zinc-900">
              {plan.joke?.setup}
            </h3>
            <p className="mt-2 text-sm text-zinc-600">
              {plan.joke?.punchline}
            </p>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-white p-4">
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">
              Voice Profile
            </span>
            <p className="mt-1 text-lg font-semibold text-zinc-900">
              {plan.voice.name}
            </p>
            <p className="text-sm text-zinc-500">{plan.voice.description}</p>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-white p-4 text-sm text-zinc-600">
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">
              <span>Runtime</span>
              <span>{runtime}s</span>
            </div>
            <ul className="mt-3 space-y-2">
              {plan.timeline.map((segment) => (
                <li key={segment.id} className="flex justify-between">
                  <span>{segment.label}</span>
                  <span>{segment.duration}s</span>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </section>
  );
}

