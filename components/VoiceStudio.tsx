"use client";

import { VoicePreset } from "@/types/pipeline";
import { useCallback, useEffect, useMemo, useState } from "react";

type VoiceStudioProps = {
  voices: VoicePreset[];
  activeVoice: VoicePreset;
  onSelect: (voice: VoicePreset) => void;
  sampleScript: string;
};

export function VoiceStudio({
  voices,
  activeVoice,
  onSelect,
  sampleScript,
}: VoiceStudioProps) {
  const [speechVoices, setSpeechVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const synthAvailable =
    typeof window !== "undefined" && "speechSynthesis" in window;

  useEffect(() => {
    if (!synthAvailable) return;
    const populate = () => {
      const list = window.speechSynthesis.getVoices();
      setSpeechVoices(list);
    };

    populate();
    window.speechSynthesis.addEventListener("voiceschanged", populate);
    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", populate);
    };
  }, [synthAvailable]);

  const preview = useCallback(() => {
    if (!synthAvailable || typeof window === "undefined") return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(sampleScript);
    utterance.pitch = activeVoice.pitch;
    utterance.rate = activeVoice.speed;
    utterance.volume = 0.9;
    const candidate = speechVoices.find((voice) =>
      activeVoice.performerStyle === "standup"
        ? /en/i.test(voice.lang) && /female/i.test(voice.name.toLowerCase())
        : /en/i.test(voice.lang)
    );
    if (candidate) {
      utterance.voice = candidate;
    }
    utterance.onstart = () => setIsPreviewing(true);
    utterance.onend = () => setIsPreviewing(false);
    window.speechSynthesis.speak(utterance);
  }, [activeVoice, sampleScript, speechVoices, synthAvailable]);

  const highlight = useMemo(
    () =>
      `Pitch ${(activeVoice.pitch * 100).toFixed(
        0
      )}% • Pace ${(activeVoice.speed * 100).toFixed(0)}% • Warmth ${(
        activeVoice.warmth * 100
      ).toFixed(0)}%`,
    [activeVoice.pitch, activeVoice.speed, activeVoice.warmth]
  );

  return (
    <section className="rounded-3xl border border-zinc-200 bg-white/80 p-6 shadow-sm backdrop-blur-md transition hover:border-zinc-300">
      <header className="flex flex-col gap-2 pb-5 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-rose-500">
            Voice Automation
          </p>
          <h2 className="text-2xl font-semibold text-zinc-900">
            Choose the premium voice performance
          </h2>
        </div>
        {synthAvailable ? (
          <button
            onClick={preview}
            className="inline-flex items-center gap-2 rounded-full bg-rose-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-rose-400/25 transition hover:bg-rose-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2"
          >
            {isPreviewing ? (
              <>
                <span className="h-2 w-2 animate-ping rounded-full bg-white" />
                Playing Preview
              </>
            ) : (
              <>
                <span aria-hidden>🎙️</span>
                Preview Voice
              </>
            )}
          </button>
        ) : (
          <span className="rounded-full bg-zinc-100 px-4 py-2 text-xs font-semibold text-zinc-500">
            Browser speech synthesis unavailable
          </span>
        )}
      </header>

      <p className="mb-5 text-sm text-zinc-500">{highlight}</p>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {voices.map((voice) => {
          const active = voice.id === activeVoice.id;
          return (
            <button
              key={voice.id}
              onClick={() => onSelect(voice)}
              className={[
                "flex h-full flex-col items-start gap-2 rounded-2xl border p-4 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2",
                active
                  ? "border-rose-400 bg-white shadow-lg shadow-rose-300/10"
                  : "border-zinc-200 bg-white/80 hover:border-rose-200 hover:shadow-md",
              ].join(" ")}
            >
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500">
                {voice.performerStyle}
              </span>
              <span className="text-lg font-semibold text-zinc-900">
                {voice.name}
              </span>
              <p className="text-sm text-zinc-500">{voice.description}</p>
            </button>
          );
        })}
      </div>
    </section>
  );
}
