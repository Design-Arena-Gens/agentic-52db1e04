import {
  JokeIdea,
  LipSyncFrame,
  ProductionPlan,
  TimelineSegment,
  VoicePreset,
} from "@/types/pipeline";

const voicePresets: VoicePreset[] = [
  {
    id: "ellie-standup",
    name: "Ellie Bright",
    performerStyle: "standup",
    pitch: 1.05,
    speed: 1.0,
    warmth: 0.8,
    description: "Upbeat club comic with tight punch delivery and quick wit.",
  },
  {
    id: "leo-late-night",
    name: "Leo Midnight",
    performerStyle: "late-night",
    pitch: 0.95,
    speed: 0.92,
    warmth: 0.9,
    description: "Smooth late-night host energy with conversational pacing.",
  },
  {
    id: "nova-news",
    name: "Nova Fielding",
    performerStyle: "news-anchor",
    pitch: 0.9,
    speed: 1.08,
    warmth: 0.7,
    description: "Sharp newsroom presenter with headline-ready cadence.",
  },
  {
    id: "sage-narrator",
    name: "Sage Harper",
    performerStyle: "narrator",
    pitch: 1.0,
    speed: 0.88,
    warmth: 1.0,
    description: "Cinematic narrator with premium documentary polish.",
  },
];

const backgroundThemes: Array<{
  theme: TimelineSegment["background"]["theme"];
  accentColor: string;
  mediaPrompt: string;
}> = [
  {
    theme: "stage",
    accentColor: "#EF4444",
    mediaPrompt: "Spotlit brick wall comedy stage with audience bokeh",
  },
  {
    theme: "studio",
    accentColor: "#6366F1",
    mediaPrompt: "Modern neon comedy studio with depth and light trails",
  },
  {
    theme: "nightlife",
    accentColor: "#22D3EE",
    mediaPrompt: "City rooftop lounge at night with skyline lights",
  },
  {
    theme: "newsroom",
    accentColor: "#F59E0B",
    mediaPrompt: "Dynamic virtual newsroom with ticker holograms",
  },
  {
    theme: "abstract",
    accentColor: "#10B981",
    mediaPrompt: "Abstract playful shapes with vibrant gradients",
  },
];

type JokeApiPayload =
  | {
      type: "single";
      joke: string;
      id: number;
      category: string;
      safe: boolean;
      lang: string;
    }
  | {
      type: "twopart";
      setup: string;
      delivery: string;
      id: number;
      category: string;
      safe: boolean;
      lang: string;
    };

type DailyContext = {
  headlineHook: string;
  observance: string;
  vibe: "optimistic" | "reflective" | "electric" | "chill";
  crowdEnergy: number;
  newsFlash: string;
};

const seasonalMoments: Record<string, string> = {
  "1-1": "New Year's reboot energy is in the air.",
  "2-14": "It's Valentine's Day, love and awkwardness collide.",
  "3-17": "St. Patrick's festivities fuel the crowd's boldness.",
  "4-1": "April Fools' Day primes everyone for punchlines.",
  "7-4": "Independence celebrations keep the energy sky-high.",
  "10-31": "It's spooky season—lean into playful eeriness.",
  "12-25": "Holiday warmth keeps the audience feeling generous.",
  "12-31": "Year-end reflections are ripe for callback humor.",
};

const weekdayHooks = [
  "Kick off the week with a joke sharper than Monday coffee.",
  "Keep momentum rolling—Tuesday deserves a headline laugh.",
  "It's Wednesday—the midpoint miracle needs levity.",
  "Thursday pregame energy is perfect for premium comedy.",
  "Friday crowds crave top-shelf punchlines.",
  "Saturday night lights the stage for bold bits.",
  "Sunday reflections get brighter with smart humor.",
];

const vibeByHour: Record<string, DailyContext["vibe"]> = {
  morning: "optimistic",
  afternoon: "electric",
  evening: "chill",
  late: "reflective",
};

const mouthMap: Record<string, LipSyncFrame["mouthShape"]> = {
  a: "wide",
  e: "wide",
  i: "narrow",
  o: "pucker",
  u: "pucker",
  y: "narrow",
  b: "clench",
  p: "clench",
  m: "clench",
  f: "narrow",
  v: "narrow",
  s: "narrow",
  z: "narrow",
  d: "wide",
  t: "wide",
  l: "wide",
  r: "open",
  g: "open",
  k: "open",
  h: "open",
  w: "pucker",
  q: "clench",
  c: "wide",
  j: "open",
  x: "narrow",
};

const energyByCategory: Record<string, number> = {
  Programming: 0.7,
  Miscellaneous: 0.6,
  Dark: 0.9,
  Pun: 0.75,
  Spooky: 0.8,
  Christmas: 0.65,
  Any: 0.7,
};

export function getVoicePresets() {
  return voicePresets;
}

export function deriveDailyContext(date = new Date()): DailyContext {
  const monthDay = `${date.getMonth() + 1}-${date.getDate()}`;
  const weekday = date.getDay();
  const hours = date.getHours();

  const observance =
    seasonalMoments[monthDay] ??
    (date.getDate() === 1
      ? "New month, fresh jokes to kick things off."
      : "Lean into real-time humor that feels live and current.");

  let dayPeriod: keyof typeof vibeByHour = "evening";
  if (hours < 11) dayPeriod = "morning";
  else if (hours < 16) dayPeriod = "afternoon";
  else if (hours < 21) dayPeriod = "evening";
  else dayPeriod = "late";

  const vibe = vibeByHour[dayPeriod];
  const headlineHook = weekdayHooks[weekday];

  const newsFlash = `Tap into ${new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(date)} headlines with a ${vibe} tone.`;

  const crowdEnergy = Math.min(
    1,
    Math.max(0.5, 0.6 + weekday * 0.05 + (dayPeriod === "evening" ? 0.15 : 0))
  );

  return {
    headlineHook,
    observance,
    vibe,
    crowdEnergy,
    newsFlash,
  };
}

function normalizeText(input: string) {
  return input.replace(/\s+/g, " ").trim();
}

function generateJokeIdea(
  raw: JokeApiPayload,
  ctx: DailyContext
): { idea: JokeIdea; energy: number } {
  const isTwoPart = raw.type === "twopart";
  const setup = isTwoPart ? raw.setup : raw.joke.slice(0, Math.floor(raw.joke.length * 0.6));
  const punchline = isTwoPart
    ? raw.delivery
    : raw.joke.slice(Math.floor(raw.joke.length * 0.6));

  const cleanSetup = normalizeText(setup);
  const cleanPunch = normalizeText(punchline);
  const tags = [
    raw.category.toLowerCase(),
    ctx.vibe,
    cleanSetup.length > 140 ? "story" : "quick-hit",
  ];

  const mood =
    raw.category === "Dark"
      ? "edgy"
      : raw.category === "Programming"
        ? "satire"
        : ctx.vibe === "optimistic"
          ? "feel-good"
          : "wholesome";

  const energy =
    energyByCategory[raw.category] ??
    (mood === "edgy" ? 0.85 : mood === "satire" ? 0.75 : 0.65);

  const idea: JokeIdea = {
    id: `joke-${raw.id}`,
    title: `Topical ${raw.category} bit`,
    setup: cleanSetup,
    punchline: cleanPunch,
    tags,
    mood,
    topicalHook: ctx.headlineHook,
    toneNotes: `${ctx.newsFlash} ${ctx.observance}`,
    timestamp: new Date().toISOString(),
  };

  return { idea, energy };
}

function timelineFromJoke(
  joke: JokeIdea,
  energy: number,
  ctx: DailyContext
): TimelineSegment[] {
  const segments: TimelineSegment[] = [];
  const theme =
    backgroundThemes[
      Math.floor(Math.random() * backgroundThemes.length)
    ];

  segments.push({
    id: `${joke.id}-hook`,
    label: "Cold Open Hook",
    text: `${joke.topicalHook} ${joke.setup.split(".")[0]}.`,
    duration: 5,
    background: theme,
    emphasis: {
      beat: "setup",
      energy: Math.min(1, energy + 0.1),
      gestures: ["lean-in", "eyebrow-pop"],
    },
  });

  segments.push({
    id: `${joke.id}-setup`,
    label: "Story Build",
    text: joke.setup,
    duration: Math.max(6, Math.round(joke.setup.length / 22)),
    background: theme,
    emphasis: {
      beat: "transition",
      energy,
      gestures: ["hand-wave", "shoulder-drop"],
    },
  });

  segments.push({
    id: `${joke.id}-punch`,
    label: "Punchline",
    text: joke.punchline,
    duration: Math.max(4, Math.round(joke.punchline.length / 25)),
    background: {
      ...theme,
      accentColor: "#F97316",
    },
    emphasis: {
      beat: "punch",
      energy: Math.min(1, energy + ctx.crowdEnergy * 0.2),
      gestures: ["palm-up", "beat-hit"],
    },
  });

  segments.push({
    id: `${joke.id}-tag`,
    label: "Callback Tag",
    text: `Callback it to today: ${ctx.observance}`,
    duration: 5,
    background: {
      ...theme,
      accentColor: "#22C55E",
    },
    emphasis: {
      beat: "callback",
      energy: Math.max(0.6, ctx.crowdEnergy),
      gestures: ["chin-raise", "spotlight-scan"],
    },
  });

  return segments;
}

function pickVoice(mood: JokeIdea["mood"], ctx: DailyContext): VoicePreset {
  if (mood === "edgy") return voicePresets[0];
  if (mood === "satire") return voicePresets[1];
  if (ctx.vibe === "electric") return voicePresets[0];
  if (ctx.vibe === "reflective") return voicePresets[3];
  if (ctx.vibe === "optimistic") return voicePresets[0];
  return voicePresets[2];
}

function buildLipSync(
  text: string,
  baseDuration: number,
  offset: number
): LipSyncFrame[] {
  const frames: LipSyncFrame[] = [];
  const sanitized = text.replace(/[^a-zA-Z0-9\s]/g, "");
  const totalPhonemes = sanitized.length;
  const duration = Math.max(baseDuration, totalPhonemes * 0.075);
  const phonemeDuration = duration / Math.max(totalPhonemes, 1);

  let timecode = offset;
  for (const char of sanitized.toLowerCase()) {
    if (char === " ") {
      timecode += phonemeDuration * 0.6;
      continue;
    }
    frames.push({
      timecode,
      mouthShape: mouthMap[char] ?? "rest",
      phoneme: char,
    });
    timecode += phonemeDuration;
  }
  frames.push({
    timecode: timecode + phonemeDuration,
    mouthShape: "rest",
    phoneme: "rest",
  });
  return frames;
}

export function stitchLipSyncForTimeline(
  timeline: TimelineSegment[]
): LipSyncFrame[] {
  const frames: LipSyncFrame[] = [];
  let cursor = 0;
  timeline.forEach((segment) => {
    const segFrames = buildLipSync(segment.text, segment.duration, cursor);
    frames.push(...segFrames);
    cursor += segment.duration;
  });
  return frames;
}

export function orchestratePlan(
  rawJokes: JokeApiPayload[],
  ctx = deriveDailyContext()
): ProductionPlan[] {
  return rawJokes.map((raw) => {
    const { idea, energy } = generateJokeIdea(raw, ctx);
    const timeline = timelineFromJoke(idea, energy, ctx);
    const lipSync = stitchLipSyncForTimeline(timeline);
    const voice = pickVoice(idea.mood, ctx);
    return {
      joke: idea,
      timeline,
      lipSync,
      voice,
    };
  });
}

export type { JokeApiPayload, DailyContext };
