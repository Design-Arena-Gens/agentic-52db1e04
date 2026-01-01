"use client";

import { JokePanel } from "@/components/JokePanel";
import { LipSyncVisualizer } from "@/components/LipSyncVisualizer";
import { TimelineEditor } from "@/components/TimelineEditor";
import { VideoComposer } from "@/components/VideoComposer";
import { VoiceStudio } from "@/components/VoiceStudio";
import {
  DailyContext,
  getVoicePresets,
  stitchLipSyncForTimeline,
} from "@/lib/jokeEngine";
import { ProductionPlan, TimelineSegment, VoicePreset } from "@/types/pipeline";
import { useCallback, useEffect, useMemo, useState } from "react";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [context, setContext] = useState<DailyContext | null>(null);
  const [plans, setPlans] = useState<ProductionPlan[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const voiceCatalog = useMemo<VoicePreset[]>(() => getVoicePresets(), []);

  const activePlan = useMemo(
    () => (activeIndex !== null ? plans[activeIndex] ?? null : null),
    [plans, activeIndex]
  );

  const fetchPlans = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/jokes?topic=Any&count=3", {
        method: "GET",
      });
      if (!response.ok) {
        throw new Error("Failed to load jokes");
      }
      const payload = await response.json();
      setContext(payload.context as DailyContext);
      setPlans(payload.plans as ProductionPlan[]);
      setActiveIndex(0);
    } catch (error) {
      console.error("Plan generation failed", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  const updateTimeline = useCallback(
    (segments: TimelineSegment[]) => {
      if (activeIndex === null) return;
      setPlans((prev) =>
        prev.map((plan, index) =>
          index === activeIndex
            ? {
                ...plan,
                timeline: segments,
                lipSync: stitchLipSyncForTimeline(segments),
              }
            : plan
        )
      );
    },
    [activeIndex]
  );

  const updateVoice = useCallback(
    (voice: VoicePreset) => {
      if (activeIndex === null) return;
      setPlans((prev) =>
        prev.map((plan, index) =>
          index === activeIndex ? { ...plan, voice } : plan
        )
      );
    },
    [activeIndex]
  );

  return (
    <div className="bg-gradient-to-br from-zinc-100 via-white to-indigo-100">
      <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-8 px-6 pb-24 pt-16 lg:px-10">
        <header className="flex flex-col gap-6 rounded-3xl border border-white/60 bg-white/80 p-10 text-zinc-900 shadow-xl shadow-indigo-200/20 backdrop-blur">
          <span className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-500">
            Agentic Joke-to-Video Lab
          </span>
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            Craft premium lip-synced joke videos in seconds.
          </h1>
          <p className="max-w-3xl text-lg leading-7 text-zinc-600">
            Generate topical comedy, auto-build cinematic timelines, synthesize
            pro-grade voiceovers, and preview lip sync frames—all inside a
            deploy-ready agent that targets Vercel instantly.
          </p>
        </header>

        <JokePanel
          loading={loading}
          context={context}
          plans={plans}
          activeIndex={activeIndex}
          onGenerate={fetchPlans}
          onSelect={setActiveIndex}
        />

        {activePlan && (
          <>
            <TimelineEditor
              segments={activePlan.timeline}
              onChange={updateTimeline}
            />
            <VoiceStudio
              voices={voiceCatalog}
              activeVoice={activePlan.voice}
              onSelect={updateVoice}
              sampleScript={`${activePlan.joke?.setup} ${activePlan.joke?.punchline}`}
            />
            <LipSyncVisualizer
              frames={activePlan.lipSync}
              segments={activePlan.timeline}
            />
          </>
        )}

        <VideoComposer plan={activePlan} />
      </main>
    </div>
  );
}
