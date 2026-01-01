export type JokeIdea = {
  id: string;
  title: string;
  setup: string;
  punchline: string;
  tags: string[];
  mood: "feel-good" | "satire" | "wholesome" | "edgy";
  topicalHook: string;
  toneNotes: string;
  timestamp: string;
};

export type TimelineSegment = {
  id: string;
  label: string;
  text: string;
  duration: number;
  background: {
    theme: "studio" | "stage" | "abstract" | "newsroom" | "nightlife";
    accentColor: string;
    mediaPrompt: string;
  };
  emphasis: {
    beat: "setup" | "punch" | "callback" | "transition" | "payoff";
    energy: number;
    gestures: string[];
  };
};

export type VoicePreset = {
  id: string;
  name: string;
  performerStyle: "standup" | "late-night" | "news-anchor" | "narrator";
  pitch: number;
  speed: number;
  warmth: number;
  description: string;
};

export type LipSyncFrame = {
  timecode: number;
  mouthShape:
    | "rest"
    | "wide"
    | "narrow"
    | "open"
    | "pucker"
    | "smile"
    | "clench";
  phoneme: string;
};

export type ProductionPlan = {
  joke: JokeIdea | null;
  timeline: TimelineSegment[];
  voice: VoicePreset;
  lipSync: LipSyncFrame[];
};

