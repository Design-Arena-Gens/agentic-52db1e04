"use client";

import { DailyContext } from "@/lib/jokeEngine";
import { ProductionPlan } from "@/types/pipeline";
import { useMemo } from "react";

type JokePanelProps = {
  loading: boolean;
  context: DailyContext | null;
  plans: ProductionPlan[];
  activeIndex: number | null;
  onGenerate: () => void;
  onSelect: (index: number) => void;
};

export function JokePanel({
  loading,
  context,
  plans,
  activeIndex,
  onGenerate,
  onSelect,
}: JokePanelProps) {
  const summary = useMemo(() => {
    if (!context) return null;
    return [
      context.headlineHook,
      context.newsFlash,
      context.observance,
    ].join(" ");
  }, [context]);

  return (
    <section className="rounded-3xl border border-zinc-200 bg-white/70 p-6 shadow-sm backdrop-blur-md transition hover:border-zinc-300">
      <header className="flex flex-col gap-2 pb-5 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-indigo-500">
            Daily Joke Intelligence
          </p>
          <h2 className="text-2xl font-semibold text-zinc-900">
            Premium scripts tuned to today&apos;s vibe
          </h2>
        </div>
        <button
          onClick={onGenerate}
          className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="h-2 w-2 animate-ping rounded-full bg-white" />
              Calibrating jokes...
            </>
          ) : (
            <>
              <span aria-hidden>⚡️</span>
              Regenerate Set
            </>
          )}
        </button>
      </header>

      {summary && (
        <div className="mb-6 rounded-2xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm text-indigo-900">
          {summary}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        {plans.map((plan, index) => {
          const isActive = index === activeIndex;
          return (
            <article
              key={plan.joke?.id ?? index}
              className={[
                "flex h-full flex-col gap-3 rounded-2xl border p-4 transition",
                isActive
                  ? "border-indigo-400 bg-white shadow-xl shadow-indigo-500/10"
                  : "border-zinc-200 bg-white/80 hover:border-zinc-300 hover:shadow-md",
              ].join(" ")}
            >
              <header className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500">
                  Option {index + 1}
                </span>
                <span className="rounded-full bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-600">
                  {plan.joke?.mood ?? "feel-good"}
                </span>
              </header>
              <h3 className="text-lg font-semibold text-zinc-900">
                {plan.joke?.title}
              </h3>
              <p className="line-clamp-3 text-sm leading-6 text-zinc-600">
                {plan.joke?.setup}
              </p>
              <div className="flex flex-wrap gap-2 text-xs">
                {plan.joke?.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-zinc-100 px-3 py-1 text-zinc-500"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
              <button
                onClick={() => onSelect(index)}
                className={[
                  "mt-auto inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2",
                  isActive
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/25"
                    : "bg-zinc-900 text-white hover:bg-zinc-700",
                ].join(" ")}
              >
                {isActive ? "Selected" : "Use This Joke"}
              </button>
            </article>
          );
        })}
        {!plans.length && (
          <div className="col-span-full flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 px-8 py-16 text-center">
            <span className="text-4xl">🎬</span>
            <p className="text-lg font-semibold text-zinc-700">
              Generate today&apos;s premium joke lineup
            </p>
            <p className="max-w-md text-sm text-zinc-500">
              Tap into smart topical analysis, curated setups and punchlines
              ready for video-first storytelling.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

