import { NextRequest, NextResponse } from "next/server";
import { deriveDailyContext, orchestratePlan } from "@/lib/jokeEngine";
import type { JokeApiPayload } from "@/lib/jokeEngine";

const JOKE_ENDPOINT = "https://v2.jokeapi.dev/joke";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const topic = searchParams.get("topic") ?? "Any";
  const count = Math.min(Number(searchParams.get("count") ?? "3"), 5);
  const safeMode = searchParams.get("safe") ?? "true";

  try {
    const url = `${JOKE_ENDPOINT}/${encodeURIComponent(
      topic
    )}?amount=${count}&type=single,twopart&safe-mode=${safeMode}`;

    const response = await fetch(url, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Joke API responded with ${response.status}`);
    }

    const raw = (await response.json()) as
      | (JokeApiPayload & { jokes?: never })
      | { jokes: JokeApiPayload[] };

    let jokesArray: JokeApiPayload[];
    if ("jokes" in raw && Array.isArray(raw.jokes)) {
      jokesArray = raw.jokes;
    } else {
      jokesArray = [raw as JokeApiPayload];
    }

    const ctx = deriveDailyContext();
    const plans = orchestratePlan(jokesArray, ctx);

    return NextResponse.json({
      context: ctx,
      plans,
    });
  } catch (error) {
    console.error("Failed to fetch jokes", error);
    return NextResponse.json(
      {
        error: "Failed to connect to joke generator. Try again shortly.",
      },
      { status: 502 }
    );
  }
}
