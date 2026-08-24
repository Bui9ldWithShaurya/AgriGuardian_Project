import { useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Bot, Send, User, Sparkle, Leaf } from "lucide-react";
import { PageHeader, Panel } from "@/components/app/Primitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/advisor")({
  head: () => ({
    meta: [
      { title: "AI Advisor — AgriGuardian AI" },
      {
        name: "description",
        content:
          "Chat with the AgriGuardian AI copilot for crop management, irrigation and disease guidance.",
      },
      { property: "og:title", content: "AI Advisor — AgriGuardian AI" },
      {
        property: "og:description",
        content: "Personalized agronomy answers powered by your live farm data.",
      },
    ],
  }),
  component: AdvisorPage,
});

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "Why is my tomato yield dropping?",
  "When should I irrigate Plot A4?",
  "How do I treat Early Blight organically?",
  "What fertilizer suits the fruiting stage?",
];

const CANNED: { match: RegExp; reply: string }[] = [
  {
    match: /blight|disease|fungus/i,
    reply:
      "Early Blight thrives in the humid microclimate under a dense canopy. Prune the lower 30 cm of foliage to improve airflow, apply copper oxychloride at 3 g/L, and repeat after 7 days. Avoid overhead irrigation — water at the base early in the morning so leaves dry quickly.",
  },
  {
    match: /irrigat|water/i,
    reply:
      "Soil moisture in Plot A4 is 42% and falling roughly 3% per day. With 12 mm of rain forecast in 36 hours, hold the next cycle and re-check tomorrow evening. If moisture drops below 30% before the rain lands, apply a short 12 L/m² pulse before 10 AM.",
  },
  {
    match: /fertil|npk|nutrient/i,
    reply:
      "At the fruiting stage, switch to a high-potassium formula such as NPK 10-26-26 at 120 kg/ha. Cut nitrogen back — excess nitrogen now pushes leaf growth at the expense of fruit set and increases disease pressure.",
  },
  {
    match: /yield|drop/i,
    reply:
      "Three factors are pulling yield down: air temperature is running 4°C above the optimum band for tomato pollination, potassium is moderate rather than high during fruiting, and canopy humidity is raising blight risk. Shade netting during peak hours plus a potassium correction should recover most of the gap.",
  },
];

function reply(question: string) {
  return (
    CANNED.find((c) => c.match.test(question))?.reply ??
    "Based on your current sensor readings (42% soil moisture, 31°C air temp, pH 6.8) conditions are broadly favourable. Keep monitoring canopy humidity and re-scan leaves twice a week — I'll flag anything that trends out of range."
  );
}

function AdvisorPage() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const ask = (text: string) => {
    const q = text.trim();
    if (!q || thinking) return;
    setMessages((m) => [...m, { role: "user", content: q }]);
    setInput("");
    setThinking(true);
    setTimeout(() => {
      setMessages((m) => [...m, { role: "assistant", content: reply(q) }]);
      setThinking(false);
      endRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 700);
  };

  return (
    <>
      <PageHeader
        title="AI Advisor"
        subtitle="Your always-on agronomist, grounded in live field data"
      />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <Panel className="flex min-h-[32rem] flex-col p-0">
          <div className="flex-1 space-y-5 overflow-y-auto p-5">
            {messages.length === 0 && (
              <div className="grid h-full place-items-center py-10 text-center">
                <div>
                  <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-primary">
                    <Leaf className="h-7 w-7 text-primary-foreground" />
                  </div>
                  <p className="mt-4 font-heading text-lg font-extrabold">
                    Ask about your farm
                  </p>
                  <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                    I can read your sensor history, disease scans and weather outlook to answer
                    crop questions in plain language.
                  </p>
                </div>
              </div>
            )}

            {messages.map((m, i) =>
              m.role === "user" ? (
                <div key={i} className="flex justify-end gap-2">
                  <p className="max-w-[80%] rounded-2xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground">
                    {m.content}
                  </p>
                  <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-accent">
                    <User className="h-4 w-4 text-accent-foreground" />
                  </div>
                </div>
              ) : (
                <div key={i} className="flex gap-2">
                  <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary">
                    <Bot className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <p className="max-w-[85%] text-sm leading-relaxed">{m.content}</p>
                </div>
              ),
            )}

            {thinking && (
              <div className="flex gap-2 text-sm text-muted-foreground">
                <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary">
                  <Bot className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="animate-pulse pt-1.5">Thinking…</span>
              </div>
            )}
            <div ref={endRef} />
          </div>

          <form
            className="flex items-center gap-2 border-t border-border p-3"
            onSubmit={(e) => {
              e.preventDefault();
              ask(input);
            }}
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about irrigation, disease, fertilizer…"
              aria-label="Message the AI advisor"
            />
            <Button type="submit" size="icon" disabled={!input.trim() || thinking}>
              <Send className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </Panel>

        <Panel className="h-fit p-5">
          <p className="mb-3 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
            <Sparkle className="h-3.5 w-3.5" />
            Suggested questions
          </p>
          <div className="space-y-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => ask(s)}
                className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-left text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                {s}
              </button>
            ))}
          </div>
        </Panel>
      </div>
    </>
  );
}
