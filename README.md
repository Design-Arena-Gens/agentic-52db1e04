## Agentic Joke-to-Video Lab

This project delivers an end-to-end comedy automation studio that transforms daily jokes into premium, lip-synced video storyboards. It is designed for instant deployment on Vercel and showcases a fully client-side creative workflow.

### Capabilities

- **Daily Joke Intelligence** — Pulls in fresh jokes from Joke API, adapts them to today’s cultural hooks, and scores them for video-readiness.
- **Timeline Orchestration** — Auto-builds a four-beat cinematic storyboard that can be tweaked live with duration sliders and script editing.
- **Voice Automation** — Offers curated performer presets with Web Speech API previews for rapid voice auditioning.
- **Lip Sync Visualizer** — Generates phoneme-accurate mouth-shape timelines for premium sync confidence.
- **Smart Video Composer** — Provides a live, stage-inspired preview plus exportable JSON storyboards to hand off downstream.

### Running Locally

```bash
npm install
npm run dev
```

Then visit [http://localhost:3000](http://localhost:3000).

### Production Build

```bash
npm run build
npm run start
```

### Deployment

This app is optimized for Vercel. Deploy with:

```bash
vercel deploy --prod --yes --token $VERCEL_TOKEN --name agentic-52db1e04
```
